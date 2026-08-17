import pytest
from httpx import AsyncClient
from fastapi import status
from app.core.security import create_access_token
from datetime import timedelta

async def test_register_user_success(client: AsyncClient):
    """Test successful user registration."""
    payload = {
        "email": "newuser@example.com",
        "username": "newuser",
        "password": "SecurePassword123"
    }
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["email"] == payload["email"]
    assert data["username"] == payload["username"]
    assert "id" in data
    assert "hashed_password" not in data

async def test_register_duplicate_email(client: AsyncClient, test_user):
    """Test that registering with an existing email returns 400 Bad Request."""
    payload = {
        "email": test_user.email,
        "username": "anothername",
        "password": "SecurePassword123"
    }
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "Email already registered" in response.json()["detail"]

async def test_register_weak_password(client: AsyncClient):
    """Test that registering with password lacking uppercase/numbers returns 422."""
    payload = {
        "email": "weak@example.com",
        "username": "weakuser",
        "password": "weakpassword"
    }
    response = await client.post("/api/auth/register", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

async def test_login_success(client: AsyncClient, test_user):
    """Test login with correct credentials returns a valid JWT."""
    payload = {
        "email": test_user.email,
        "password": "Password123"
    }
    response = await client.post("/api/auth/login", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

async def test_login_incorrect_password(client: AsyncClient, test_user):
    """Test login with incorrect password returns 401 Unauthorized."""
    payload = {
        "email": test_user.email,
        "password": "WrongPassword123"
    }
    response = await client.post("/api/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Incorrect email or password" in response.json()["detail"]

async def test_login_nonexistent_email(client: AsyncClient):
    """Test login with unregistered email returns 401 Unauthorized."""
    payload = {
        "email": "nobody@example.com",
        "password": "Password123"
    }
    response = await client.post("/api/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Incorrect email or password" in response.json()["detail"]

async def test_get_me_authenticated(client: AsyncClient, test_user, auth_headers):
    """Test /api/auth/me returns the current user profile when authenticated."""
    response = await client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["id"] == str(test_user.id)
    assert data["email"] == test_user.email
    assert data["username"] == test_user.username

async def test_get_me_unauthenticated(client: AsyncClient):
    """Test /api/auth/me rejects requests without token with 401 or 403."""
    response = await client.get("/api/auth/me")
    assert response.status_code in [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]

async def test_get_me_invalid_token(client: AsyncClient):
    """Test /api/auth/me rejects invalid token with 401 Unauthorized."""
    headers = {"Authorization": "Bearer invalid.jwt.token"}
    response = await client.get("/api/auth/me", headers=headers)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

async def test_get_me_expired_token(client: AsyncClient, test_user):
    """Test /api/auth/me rejects expired token."""
    expired_token = create_access_token(
        data={"sub": str(test_user.id)},
        expires_delta=timedelta(minutes=-10)
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = await client.get("/api/auth/me", headers=headers)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
