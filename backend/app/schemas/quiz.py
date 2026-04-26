from pydantic import BaseModel
from typing import List, Dict
from uuid import UUID
from datetime import datetime

class QuizOption(BaseModel):
    id: str
    text: str

class QuizQuestion(BaseModel):
    id: str
    question: str
    options: List[QuizOption]

class QuizQuestionWithFeedback(QuizQuestion):
    correct: str
    feedback: Dict[str, str]

class QuizSubmit(BaseModel):
    question_id: str
    selected: str

class QuizFeedback(BaseModel):
    is_correct: bool
    message: str
    correct_answer: str
    score: int

class QuizResultResponse(BaseModel):
    id: UUID
    user_id: UUID
    question_id: str
    selected: str
    is_correct: bool
    score: int
    submitted_at: datetime

    class Config:
        from_attributes = True

class QuizSummary(BaseModel):
    total_questions: int
    correct_answers: int
    total_score: int
    percentage: float
