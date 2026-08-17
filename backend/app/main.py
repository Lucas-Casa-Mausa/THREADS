from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from app.core.config import settings
from app.core.limiter import limiter
from app.db.session import get_db, AsyncSessionLocal
from app.db.seed import seed_quiz_questions
from app.api.routes import users, progress, quiz

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context for startup and shutdown events."""
    try:
        async with AsyncSessionLocal() as session:
            await seed_quiz_questions(session)
    except Exception:
        pass
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Interactive educational platform for concurrency concepts",
    lifespan=lifespan
)

# Rate limiter wiring (per-IP, in-memory).
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS — restrict to known origins, methods and headers actually used by the SPA.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# Include routers
app.include_router(users.router, prefix="/api")
app.include_router(progress.router, prefix="/api")
app.include_router(quiz.router, prefix="/api")

@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "THREADS API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Health check endpoint that verifies database connectivity."""
    try:
        await db.execute(text("SELECT 1"))
        return {
            "status": "healthy",
            "database": "connected",
            "version": settings.VERSION
        }
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "detail": str(e) if settings.DEBUG else "Database unavailable"
            }
        )
