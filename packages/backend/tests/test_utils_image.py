"""
Tests for app.utils.image — decode/encode, EXIF rotation, resize.
"""
import base64
import io

import numpy as np
import pytest
from PIL import Image

from app.utils.image import (
    decode_image,
    decode_base64_image,
    encode_image_base64,
    fix_exif_rotation,
    resize_for_processing,
    image_to_base64_for_claude,
)


def _make_jpeg_bytes(w=100, h=80, color=(200, 150, 100)):
    img = Image.new("RGB", (w, h), color)
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _make_png_bytes(w=100, h=80, color=(200, 150, 100)):
    img = Image.new("RGB", (w, h), color)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# ---------------------------------------------------------------------------
# decode_image
# ---------------------------------------------------------------------------
class TestDecodeImage:
    def test_jpeg(self):
        raw = _make_jpeg_bytes()
        arr = decode_image(raw)
        assert isinstance(arr, np.ndarray)
        assert arr.shape == (80, 100, 3)
        assert arr.dtype == np.uint8

    def test_png(self):
        raw = _make_png_bytes()
        arr = decode_image(raw)
        assert arr.shape == (80, 100, 3)

    def test_invalid_bytes(self):
        with pytest.raises(Exception):
            decode_image(b"not-an-image")


# ---------------------------------------------------------------------------
# decode_base64_image
# ---------------------------------------------------------------------------
class TestDecodeBase64:
    def test_basic(self):
        raw = _make_jpeg_bytes()
        b64 = base64.b64encode(raw).decode()
        arr = decode_base64_image(b64)
        assert isinstance(arr, np.ndarray)
        assert arr.shape[2] == 3

    def test_with_data_uri_prefix(self):
        raw = _make_jpeg_bytes()
        b64 = "data:image/jpeg;base64," + base64.b64encode(raw).decode()
        arr = decode_base64_image(b64)
        assert isinstance(arr, np.ndarray)


# ---------------------------------------------------------------------------
# encode_image_base64
# ---------------------------------------------------------------------------
class TestEncodeBase64:
    def test_roundtrip(self):
        arr = np.full((80, 100, 3), 128, dtype=np.uint8)
        b64 = encode_image_base64(arr)
        assert isinstance(b64, str)
        # Should be valid base64
        decoded = base64.b64decode(b64)
        assert len(decoded) > 0

    def test_jpeg_format(self):
        arr = np.full((50, 50, 3), 200, dtype=np.uint8)
        b64 = encode_image_base64(arr, format="JPEG")
        raw = base64.b64decode(b64)
        # JPEG magic bytes
        assert raw[:2] == b"\xff\xd8"

    def test_png_format(self):
        arr = np.full((50, 50, 3), 200, dtype=np.uint8)
        b64 = encode_image_base64(arr, format="PNG")
        raw = base64.b64decode(b64)
        # PNG magic bytes
        assert raw[:4] == b"\x89PNG"


# ---------------------------------------------------------------------------
# fix_exif_rotation
# ---------------------------------------------------------------------------
class TestFixExif:
    def test_no_exif(self):
        img = Image.new("RGB", (100, 80))
        result = fix_exif_rotation(img)
        assert result.size == (100, 80)


# ---------------------------------------------------------------------------
# resize_for_processing
# ---------------------------------------------------------------------------
class TestResize:
    def test_small_image_unchanged(self):
        arr = np.zeros((100, 100, 3), dtype=np.uint8)
        result = resize_for_processing(arr, max_dim=1024)
        assert result.shape == (100, 100, 3)

    def test_large_image_downsized(self):
        arr = np.zeros((2048, 3072, 3), dtype=np.uint8)
        result = resize_for_processing(arr, max_dim=1024)
        assert max(result.shape[:2]) <= 1024
        # Aspect ratio approximately preserved
        ratio_orig = 3072 / 2048
        ratio_new = result.shape[1] / result.shape[0]
        assert abs(ratio_orig - ratio_new) < 0.1

    def test_preserves_dtype(self):
        arr = np.zeros((2000, 2000, 3), dtype=np.uint8)
        result = resize_for_processing(arr, max_dim=500)
        assert result.dtype == np.uint8


# ---------------------------------------------------------------------------
# image_to_base64_for_claude
# ---------------------------------------------------------------------------
class TestImageToBase64ForClaude:
    def test_returns_tuple(self):
        arr = np.full((100, 100, 3), 128, dtype=np.uint8)
        b64, media_type = image_to_base64_for_claude(arr)
        assert isinstance(b64, str)
        assert media_type in ("image/jpeg", "image/png")
        assert len(b64) > 0
