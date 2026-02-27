"""
Tests for /api/v1/segment endpoints — auto segmentation, point segmentation.
"""
import io
import pytest
from PIL import Image

from tests.conftest import make_test_image_bytes, make_test_image_base64


@pytest.mark.asyncio
class TestSegmentAuto:
    async def test_segment_auto_success(self, client):
        image_bytes = make_test_image_bytes(200, 200)
        resp = await client.post(
            "/api/v1/segment/auto",
            files={"image": ("test.jpg", io.BytesIO(image_bytes), "image/jpeg")},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert "masks" in data
        assert "image_width" in data
        assert "image_height" in data
        assert isinstance(data["masks"], list)
        assert len(data["masks"]) > 0

    async def test_segment_auto_mask_fields(self, client):
        image_bytes = make_test_image_bytes(200, 200)
        resp = await client.post(
            "/api/v1/segment/auto",
            files={"image": ("test.jpg", io.BytesIO(image_bytes), "image/jpeg")},
        )
        data = resp.json()
        for mask in data["masks"]:
            assert "id" in mask
            assert "polygon" in mask
            assert "area" in mask

    async def test_segment_auto_png(self, client):
        img = Image.new("RGB", (200, 200), (200, 180, 160))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        buf.seek(0)
        resp = await client.post(
            "/api/v1/segment/auto",
            files={"image": ("test.png", buf, "image/png")},
        )
        assert resp.status_code == 200


@pytest.mark.asyncio
class TestSegmentPoint:
    async def test_segment_point_success(self, client):
        resp = await client.post("/api/v1/segment/point", json={
            "image_base64": make_test_image_base64(),
            "point_x": 50,
            "point_y": 50,
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "id" in data
        assert "polygon" in data
        assert "area" in data

    async def test_segment_point_edge_coordinates(self, client):
        resp = await client.post("/api/v1/segment/point", json={
            "image_base64": make_test_image_base64(200, 200),
            "point_x": 0,
            "point_y": 0,
        })
        assert resp.status_code == 200
