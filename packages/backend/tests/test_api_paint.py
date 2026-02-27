"""
Tests for /api/v1/paint endpoints — apply, search-colors, brands.
"""
import pytest

from tests.conftest import make_test_image_base64


@pytest.mark.asyncio
class TestPaintApply:
    async def test_apply_paint_success(self, client):
        resp = await client.post("/api/v1/paint/apply", json={
            "image_base64": make_test_image_base64(),
            "mask_id": 0,
            "color_hex": "#D4B896",
            "brightness": 50,
            "warmth": 0,
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "preview_image_base64" in data
        assert data["applied_color_hex"] == "#D4B896"
        assert data["estimated_area_m2"] is not None
        assert data["estimated_liters"] is not None

    async def test_apply_paint_invalid_hex(self, client):
        resp = await client.post("/api/v1/paint/apply", json={
            "image_base64": make_test_image_base64(),
            "mask_id": 0,
            "color_hex": "not-a-hex",
        })
        assert resp.status_code == 422  # Validation error

    async def test_apply_paint_brightness_out_of_range(self, client):
        resp = await client.post("/api/v1/paint/apply", json={
            "image_base64": make_test_image_base64(),
            "mask_id": 0,
            "color_hex": "#FF0000",
            "brightness": 150,  # Out of range
        })
        assert resp.status_code == 422

    async def test_apply_paint_warmth_out_of_range(self, client):
        resp = await client.post("/api/v1/paint/apply", json={
            "image_base64": make_test_image_base64(),
            "mask_id": 0,
            "color_hex": "#FF0000",
            "warmth": 100,  # Out of range
        })
        assert resp.status_code == 422


@pytest.mark.asyncio
class TestSearchColors:
    async def test_search_colors_basic(self, client, seeded_db):
        resp = await client.post("/api/v1/paint/search-colors", json={
            "hex_code": "#D4B896",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert len(data) > 0
        # Each item should have required fields
        for item in data:
            assert "id" in item
            assert "brand" in item
            assert "name" in item
            assert "hex_code" in item

    async def test_search_colors_with_brand_filter(self, client, seeded_db):
        resp = await client.post("/api/v1/paint/search-colors", json={
            "hex_code": "#D4B896",
            "brand": "Flexa",
        })
        assert resp.status_code == 200
        data = resp.json()
        for item in data:
            assert item["brand"] == "Flexa"

    async def test_search_colors_with_limit(self, client, seeded_db):
        resp = await client.post("/api/v1/paint/search-colors", json={
            "hex_code": "#D4B896",
            "limit": 2,
        })
        assert resp.status_code == 200
        data = resp.json()
        assert len(data) <= 2

    async def test_search_colors_invalid_hex(self, client):
        resp = await client.post("/api/v1/paint/search-colors", json={
            "hex_code": "bad",
        })
        assert resp.status_code == 422


@pytest.mark.asyncio
class TestBrands:
    async def test_get_brands(self, client, seeded_db):
        resp = await client.get("/api/v1/paint/brands")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
        assert "Flexa" in data
        assert "Sikkens" in data

    async def test_get_brands_empty_db(self, client):
        # Without seeding, should return empty list
        resp = await client.get("/api/v1/paint/brands")
        assert resp.status_code == 200
        data = resp.json()
        assert isinstance(data, list)
