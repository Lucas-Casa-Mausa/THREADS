from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class ProgressBase(BaseModel):
    section: str
    completed: bool = False

class ProgressCreate(ProgressBase):
    user_id: UUID

class ProgressUpdate(BaseModel):
    completed: bool

class ProgressResponse(ProgressBase):
    id: UUID
    user_id: UUID
    updated_at: datetime

    class Config:
        from_attributes = True
