from app.db.session import Base

# Import all models here for Alembic to detect
from app.db.models.user import User
from app.db.models.progress import Progress
from app.db.models.quiz_result import QuizResult
from app.db.models.quiz_question import QuizQuestion

__all__ = ["Base", "User", "Progress", "QuizResult", "QuizQuestion"]
