from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from uuid import UUID
from app.db.session import get_db
from app.db.models.quiz_result import QuizResult
from app.db.models.user import User
from app.schemas.quiz import (
    QuizQuestion, 
    QuizSubmit, 
    QuizFeedback, 
    QuizResultResponse,
    QuizSummary
)
from app.services.quiz_service import get_questions, check_answer
from app.api.deps import get_current_user

router = APIRouter(prefix="/quiz", tags=["quiz"])

@router.get("/questions", response_model=List[QuizQuestion])
async def get_quiz_questions(db: AsyncSession = Depends(get_db)):
    """Get all quiz questions (without correct answers)."""
    return await get_questions(db)

@router.post("/submit", response_model=QuizFeedback)
async def submit_quiz_answer(
    submission: QuizSubmit,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Submit a quiz answer for the authenticated user and get immediate feedback."""

    # Check answer from database
    result = await check_answer(db, submission.question_id, submission.selected)

    # Always bind the result to the authenticated user — never trust submission.user_id.
    quiz_result = QuizResult(
        user_id=current_user.id,
        question_id=submission.question_id,
        selected=submission.selected,
        is_correct=result["is_correct"],
        score=result["score"]
    )

    db.add(quiz_result)
    await db.commit()

    return QuizFeedback(**result)

@router.get("/results/{user_id}", response_model=List[QuizResultResponse])
async def get_quiz_results(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all quiz results for the authenticated user."""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access another user's quiz results",
        )
    result = await db.execute(
        select(QuizResult)
        .where(QuizResult.user_id == current_user.id)
        .order_by(QuizResult.submitted_at.desc())
    )
    results = result.scalars().all()
    return results

@router.get("/summary/{user_id}", response_model=QuizSummary)
async def get_quiz_summary(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get quiz summary statistics for the authenticated user."""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access another user's quiz summary",
        )

    # Get latest attempt (most recent 3 questions)
    result = await db.execute(
        select(QuizResult)
        .where(QuizResult.user_id == current_user.id)
        .order_by(QuizResult.submitted_at.desc())
        .limit(3)
    )
    latest_results = result.scalars().all()
    
    if not latest_results:
        return QuizSummary(
            total_questions=0,
            correct_answers=0,
            total_score=0,
            percentage=0.0
        )
    
    total = len(latest_results)
    correct = sum(1 for r in latest_results if r.is_correct)
    score = sum(r.score for r in latest_results)
    percentage = (correct / total * 100) if total > 0 else 0
    
    return QuizSummary(
        total_questions=total,
        correct_answers=correct,
        total_score=score,
        percentage=percentage
    )
