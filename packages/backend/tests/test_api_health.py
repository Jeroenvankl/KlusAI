"""
Tests for the health endpoint and basic app configuration.
"""
import pytest


@pytest.mark.asyncio
class TestHealth:
    async def test_health_endpoint(self, client):
        resp = await client.get("/health")
        assert resp.status_code == 200
        data = resp.json()
        assert data["status"] == "ok"
        assert data["version"] == "1.0.0"

    async def test_docs_endpoint(self, client):
        resp = await client.get("/docs")
        assert resp.status_code == 200

    async def test_openapi_schema(self, client):
        resp = await client.get("/openapi.json")
        assert resp.status_code == 200
        schema = resp.json()
        assert schema["info"]["title"] == "KlusAI API"
        assert "/api/v1/paint/apply" in schema["paths"]
        assert "/api/v1/segment/auto" in schema["paths"]
        assert "/api/v1/products/" in schema["paths"]

    async def test_404_for_unknown_route(self, client):
        resp = await client.get("/api/v1/does-not-exist")
        assert resp.status_code == 404
