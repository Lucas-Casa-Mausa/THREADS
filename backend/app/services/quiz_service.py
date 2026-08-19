from typing import List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.quiz_question import QuizQuestion
from app.schemas.quiz import QuizQuestion as QuizQuestionSchema

async def get_questions(db: AsyncSession) -> List[QuizQuestionSchema]:
    """Return quiz questions from database without correct answers."""
    result = await db.execute(select(QuizQuestion).order_by(QuizQuestion.id.asc()))
    questions = result.scalars().all()
    return [
        QuizQuestionSchema(
            id=q.id,
            question=q.question,
            options=q.options
        )
        for q in questions
    ]

async def get_question_by_id(db: AsyncSession, question_id: str) -> Optional[QuizQuestion]:
    """Get a specific question by id from database."""
    result = await db.execute(select(QuizQuestion).where(QuizQuestion.id == question_id))
    return result.scalar_one_or_none()

async def check_answer(db: AsyncSession, question_id: str, selected: str) -> Dict:
    """Check if the selected answer is correct against database."""
    question = await get_question_by_id(db, question_id)
    
    if not question:
        return {"is_correct": False, "message": "Question not found", "score": 0, "correct_answer": ""}
    
    is_correct = selected == question.correct
    feedback_dict = question.feedback if isinstance(question.feedback, dict) else {}
    
    return {
        "is_correct": is_correct,
        "message": feedback_dict.get("correct") if is_correct else feedback_dict.get("incorrect", ""),
        "correct_answer": question.correct,
        "score": 1 if is_correct else 0
    }
