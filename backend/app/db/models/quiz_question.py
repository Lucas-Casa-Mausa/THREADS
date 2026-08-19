from sqlalchemy import Column, String, JSON, DateTime, func
from app.db.session import Base

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(String, primary_key=True)
    question = Column(String, nullable=False)
    options = Column(JSON, nullable=False)
    correct = Column(String, nullable=False)
    feedback = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
