import pytest
from httpx import AsyncClient
from fastapi import status
from app.db.models.user import User
from app.core.security import get_password_hash

async def test_get_quiz_questions_sanitized(client: AsyncClient):
    """Test that quiz questions do not expose correct answers or secret feedbacks."""
    response = await client.get("/api/quiz/questions")
    assert response.status_code == status.HTTP_200_OK
    questions = response.json()
    assert len(questions) == 3
    for q in questions:
        assert "id" in q
        assert "question" in q
        assert "options" in q
        assert len(q["options"]) == 4
        # Security assertion: Gabarito and feedback must not leak in question fetch
        assert "correct" not in q
        assert "feedback" not in q

async def test_submit_quiz_answer_correct(client: AsyncClient, test_user: User, auth_headers: dict):
    """Test submitting a correct quiz answer."""
    payload = {
        "question_id": "q1",
        "selected": "b"
    }
    response = await client.post("/api/quiz/submit", json=payload, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["is_correct"] is True
    assert data["score"] == 1
    assert data["correct_answer"] == "b"
    assert "Exato!" in data["message"]

async def test_submit_quiz_answer_incorrect(client: AsyncClient, test_user: User, auth_headers: dict):
    """Test submitting an incorrect quiz answer."""
    payload = {
        "question_id": "q1",
        "selected": "a"
    }
    response = await client.post("/api/quiz/submit", json=payload, headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["is_correct"] is False
    assert data["score"] == 0
    assert data["correct_answer"] == "b"
    assert "Quase!" in data["message"]

async def test_quiz_results_and_summary(client: AsyncClient, test_user: User, auth_headers: dict):
    """Test fetching quiz results history and score summary."""
    # Submit 3 answers: 2 correct, 1 wrong
    await client.post("/api/quiz/submit", json={"question_id": "q1", "selected": "b"}, headers=auth_headers)
    await client.post("/api/quiz/submit", json={"question_id": "q2", "selected": "c"}, headers=auth_headers)
    await client.post("/api/quiz/submit", json={"question_id": "q3", "selected": "a"}, headers=auth_headers)

    # 1. Test results list
    res_results = await client.get(f"/api/quiz/results/{test_user.id}", headers=auth_headers)
    assert res_results.status_code == status.HTTP_200_OK
    results = res_results.json()
    assert len(results) == 3

    # 2. Test summary
    res_summary = await client.get(f"/api/quiz/summary/{test_user.id}", headers=auth_headers)
    assert res_summary.status_code == status.HTTP_200_OK
    summary = res_summary.json()
    assert summary["total_questions"] == 3
    assert summary["correct_answers"] == 2
    assert summary["total_score"] == 2
    assert round(summary["percentage"], 1) == 66.7

async def test_quiz_idor_protection(client: AsyncClient, test_user: User, auth_headers: dict, db_session):
    """Test that a user cannot access another user's quiz results or summary."""
    other_user = User(
        email="other_quiz@example.com",
        username="otherquiz",
        hashed_password=get_password_hash("Password123")
    )
    db_session.add(other_user)
    await db_session.commit()
    await db_session.refresh(other_user)

    # Results IDOR check
    res_results = await client.get(f"/api/quiz/results/{other_user.id}", headers=auth_headers)
    assert res_results.status_code == status.HTTP_403_FORBIDDEN

    # Summary IDOR check
    res_summary = await client.get(f"/api/quiz/summary/{other_user.id}", headers=auth_headers)
    assert res_summary.status_code == status.HTTP_403_FORBIDDEN

async def test_seed_quiz_questions_idempotent(db_session):
    """Test that running seed_quiz_questions multiple times does not duplicate questions."""
    from app.db.seed import seed_quiz_questions
    from app.db.models.quiz_question import QuizQuestion
    from sqlalchemy import select, func

    # Run seed again
    await seed_quiz_questions(db_session)
    await seed_quiz_questions(db_session)

    result = await db_session.execute(select(func.count(QuizQuestion.id)))
    count = result.scalar()
    assert count == 3
