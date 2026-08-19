import pytest
from httpx import AsyncClient
from fastapi import status
import uuid
from app.db.models.user import User
from app.core.security import get_password_hash, create_access_token

async def test_get_progress_empty(client: AsyncClient, test_user: User, auth_headers: dict):
    """Test getting progress for a user with no completed sections returns empty list."""
    response = await client.get(f"/api/progress/{test_user.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == []

async def test_create_and_update_progress(client: AsyncClient, test_user: User, auth_headers: dict):
    """Test creating and then updating progress for a section."""
    # 1. Create progress
    payload = {"section": "hero", "completed": True}
    res_create = await client.post("/api/progress/", json=payload, headers=auth_headers)
    assert res_create.status_code == status.HTTP_201_CREATED
    data_create = res_create.json()
    assert data_create["section"] == "hero"
    assert data_create["completed"] is True
    assert data_create["user_id"] == str(test_user.id)

    # 2. Update existing progress
    payload_update = {"section": "hero", "completed": False}
    res_update = await client.post("/api/progress/", json=payload_update, headers=auth_headers)
    assert res_update.status_code == status.HTTP_201_CREATED
    data_update = res_update.json()
    assert data_update["section"] == "hero"
    assert data_update["completed"] is False
    assert data_update["id"] == data_create["id"]

    # 3. Verify in GET
    res_get = await client.get(f"/api/progress/{test_user.id}", headers=auth_headers)
    assert res_get.status_code == status.HTTP_200_OK
    items = res_get.json()
    assert len(items) == 1
    assert items[0]["section"] == "hero"
    assert items[0]["completed"] is False

async def test_progress_idor_protection(client: AsyncClient, test_user: User, auth_headers: dict, db_session):
    """Test that a user cannot access another user's progress."""
    other_user = User(
        email="other@example.com",
        username="otheruser",
        hashed_password=get_password_hash("Password123")
    )
    db_session.add(other_user)
    await db_session.commit()
    await db_session.refresh(other_user)

    response = await client.get(f"/api/progress/{other_user.id}", headers=auth_headers)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Cannot access another user's progress" in response.json()["detail"]
