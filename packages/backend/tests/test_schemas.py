"""
Tests for Pydantic schemas — validation, serialization.
"""
import pytest
from pydantic import ValidationError

from app.schemas.paint import PaintRequest, PaintResponse, ColorSearchRequest, PaintColorSchema
from app.schemas.product import ProductSchema
from app.schemas.segment import PointSegmentRequest


# ---------------------------------------------------------------------------
# Paint schemas
# ---------------------------------------------------------------------------
class TestPaintRequest:
    def test_valid_request(self):
        req = PaintRequest(
            image_base64="abc123",
            mask_id=0,
            color_hex="#FF0000",
        )
        assert req.brightness == 50  # default
        assert req.warmth == 0  # default

    def test_invalid_hex_code(self):
        with pytest.raises(ValidationError):
            PaintRequest(image_base64="abc", mask_id=0, color_hex="red")

    def test_hex_code_too_short(self):
        with pytest.raises(ValidationError):
            PaintRequest(image_base64="abc", mask_id=0, color_hex="#FFF")

    def test_brightness_range(self):
        with pytest.raises(ValidationError):
            PaintRequest(image_base64="abc", mask_id=0, color_hex="#FF0000", brightness=101)

    def test_warmth_range(self):
        with pytest.raises(ValidationError):
            PaintRequest(image_base64="abc", mask_id=0, color_hex="#FF0000", warmth=-51)


class TestColorSearchRequest:
    def test_valid_request(self):
        req = ColorSearchRequest(hex_code="#D4B896")
        assert req.limit == 10  # default
        assert req.brand is None
        assert req.finish is None

    def test_custom_limit(self):
        req = ColorSearchRequest(hex_code="#D4B896", limit=50)
        assert req.limit == 50

    def test_limit_too_high(self):
        with pytest.raises(ValidationError):
            ColorSearchRequest(hex_code="#D4B896", limit=51)

    def test_limit_too_low(self):
        with pytest.raises(ValidationError):
            ColorSearchRequest(hex_code="#D4B896", limit=0)


class TestPaintColorSchema:
    def test_from_dict(self):
        schema = PaintColorSchema(
            id=1, brand="Flexa", collection="Creations",
            name="Sandy Beach", hex_code="#D4B896",
            price_per_liter=8.99, coverage_m2=12.0,
            eco_score="B", product_url=None, finish="mat",
        )
        assert schema.brand == "Flexa"
        assert schema.hex_code == "#D4B896"


# ---------------------------------------------------------------------------
# Product schemas
# ---------------------------------------------------------------------------
class TestProductSchema:
    def test_from_dict(self):
        schema = ProductSchema(
            id=1, store="Gamma", category="Verf",
            subcategory=None, name="Muurverf",
            description="Witte muurverf", price=29.99,
            unit="stuk", product_url=None, image_url=None,
            brand="Flexa", eco_score="A", in_stock=True,
            tags=["verf", "wit"],
        )
        assert schema.store == "Gamma"
        assert schema.tags == ["verf", "wit"]


# ---------------------------------------------------------------------------
# Segment schemas
# ---------------------------------------------------------------------------
class TestPointSegmentRequest:
    def test_valid_request(self):
        req = PointSegmentRequest(
            image_base64="abc123",
            point_x=50,
            point_y=50,
        )
        assert req.point_x == 50
