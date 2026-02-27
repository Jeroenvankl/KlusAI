"""
Tests for /api/v1/design endpoints — suggest, styles.
"""
import pytest


@pytest.mark.asyncio
class TestDesignStyles:
    async def test_get_styles(self, client):
        resp = await client.get("/api/v1/design/styles")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Each style should have key and description
        for style in data:
            assert "key" in style
            assert "description" in style
        # Known styles should be present
        keys = [s["key"] for s in data]
        assert "japandi" in keys
        assert "scandinavisch" in keys
        assert "modern" in keys


@pytest.mark.asyncio
class TestDesignSuggest:
    async def test_suggest_success(self, client, seeded_db):
        resp = await client.post("/api/v1/design/suggest", json={
            "room_id": 1,
            "style": "japandi",
            "preferences": ["licht", "minimalistisch"],
        })
        # Will use mock Claude client
        assert resp.status_code == 200
        data = resp.json()
        assert "style" in data
        assert "color_palette" in data
        assert "furniture_changes" in data
        assert "total_estimated_cost" in data

    async def test_suggest_with_budget(self, client, seeded_db):
        resp = await client.post("/api/v1/design/suggest", json={
            "room_id": 1,
            "style": "scandinavisch",
            "budget_min": 500,
            "budget_max": 2000,
        })
        assert resp.status_code == 200
