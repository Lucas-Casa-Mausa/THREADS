import uuid
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.session import Base

class QuizResult(Base):
    __tablename__ = "quiz_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String, nullable=False)  # 'q1' | 'q2' | 'q3'
    selected = Column(String, nullable=False)  # Selected option id
    is_correct = Column(Boolean, nullable=False)
    score = Column(Integer, nullable=False)  # 0 or 1
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="quiz_results")
