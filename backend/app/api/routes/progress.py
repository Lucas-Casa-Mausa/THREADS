from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from uuid import UUID
from app.db.session import get_db
from app.db.models.progress import Progress
from app.db.models.user import User
from app.schemas.progress import ProgressResponse, ProgressCreate
from app.api.deps import get_current_user

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/{user_id}", response_model=List[ProgressResponse])
async def get_user_progress(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all progress for the authenticated user."""
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access another user's progress",
        )
    result = await db.execute(
        select(Progress).where(Progress.user_id == current_user.id)
    )
    progress = result.scalars().all()
    return progress

@router.post("/", response_model=ProgressResponse, status_code=status.HTTP_201_CREATED)
async def create_or_update_progress(
    progress_data: ProgressCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark a section as complete for the authenticated user."""

    # Check if progress already exists
    result = await db.execute(
        select(Progress).where(
            Progress.user_id == current_user.id,
            Progress.section == progress_data.section
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        # Update existing
        existing.completed = progress_data.completed
        await db.commit()
        await db.refresh(existing)
        return existing

    # Create new
    new_progress = Progress(
        user_id=current_user.id,
        section=progress_data.section,
        completed=progress_data.completed
    )

    db.add(new_progress)
    await db.commit()
    await db.refresh(new_progress)

    return new_progress
