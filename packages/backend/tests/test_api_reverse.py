"""
Tests for /api/v1/reverse endpoint — reverse engineering of inspiration photos.
"""
import io
import pytest

from tests.conftest import make_test_image_bytes


@pytest.mark.asyncio
class TestReverse:
    async def test_reverse_analyze_success(self, client):
        image_bytes = make_test_image_bytes(300, 200)
        resp = await client.post(
            "/api/v1/reverse/analyze",
            files={"image": ("inspo.jpg", io.BytesIO(image_bytes), "image/jpeg")},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "style_name" in data
        assert "description" in data
        assert "color_palette" in data
        assert "furniture" in data
        assert "how_to_recreate" in data
        assert "total_estimated_cost" in data

    async def test_reverse_returns_products(self, client):
        image_bytes = make_test_image_bytes(300, 200)
        resp = await client.post(
            "/api/v1/reverse/analyze",
            files={"image": ("inspo.jpg", io.BytesIO(image_bytes), "image/jpeg")},
        )
        data = resp.json()
        assert len(data["furniture"]) > 0
        for item in data["furniture"]:
            assert "item" in item
            assert "store" in item
