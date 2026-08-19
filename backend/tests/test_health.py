import pytest
from httpx import AsyncClient, ASGITransport
from fastapi import status
from unittest.mock import AsyncMock
from app.main import app
from app.db.session import get_db

async def test_root_endpoint(client: AsyncClient):
    """Test that the root endpoint returns API details and documentation link."""
    response = await client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["message"] == "THREADS API"
    assert "version" in data
    assert data["docs"] == "/docs"

async def test_health_check_healthy(client: AsyncClient):
    """Test that the health endpoint verifies database connectivity and returns 200."""
    response = await client.get("/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"

async def test_health_check_unhealthy():
    """Test that the health endpoint returns 503 when the database is unreachable."""
    async def failing_db():
        mock_session = AsyncMock()
        mock_session.execute.side_effect = Exception("Database connection timeout")
        yield mock_session

    app.dependency_overrides[get_db] = failing_db
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/health")
            assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
            data = response.json()
            assert data["status"] == "unhealthy"
            assert data["database"] == "disconnected"
    finally:
        app.dependency_overrides.clear()
