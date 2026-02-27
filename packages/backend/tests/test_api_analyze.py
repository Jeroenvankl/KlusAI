"""
Tests for /api/v1/analyze-room endpoint — room analysis from photo.
"""
import io
import pytest

from tests.conftest import make_test_image_bytes


@pytest.mark.asyncio
class TestAnalyzeRoom:
    async def test_analyze_room_success(self, client):
        image_bytes = make_test_image_bytes(300, 200)
        resp = await client.post(
            "/api/v1/analyze-room/",
            files={"image": ("room.jpg", io.BytesIO(image_bytes), "image/jpeg")},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "room_type" in data
        assert "walls" in data
        assert "windows" in data
        assert "doors" in data
        assert "floor" in data
        assert "ceiling" in data
        assert "furniture" in data
        assert "lighting" in data
        assert "estimated_dimensions" in data
        assert "style_assessment" in data

    async def test_analyze_room_returns_dutch_content(self, client):
        image_bytes = make_test_image_bytes(300, 200)
        resp = await client.post(
            "/api/v1/analyze-room/",
            files={"image": ("room.jpg", io.BytesIO(image_bytes), "image/jpeg")},
        )
        data = resp.json()
        # Room type should be Dutch
        assert data["room_type"] == "woonkamer"
