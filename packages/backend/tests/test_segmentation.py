"""
Tests for app.services.segmentation — OpenCV fallback segmentation.
SAM model is not available in test environment, so we test the OpenCV path.
"""
import numpy as np
import pytest

from app.services.segmentation import SegmentationService, compress_mask_rle, decompress_mask_rle


@pytest.fixture
def segmentation_service():
    return SegmentationService()


@pytest.fixture
def wall_image():
    """Create a test image with distinct regions (simulating walls, floor, ceiling)."""
    img = np.zeros((200, 300, 3), dtype=np.uint8)
    # "Ceiling" - light gray top
    img[0:50, :] = (220, 220, 220)
    # "Wall left" - beige
    img[50:150, 0:150] = (200, 180, 160)
    # "Wall right" - slightly different beige
    img[50:150, 150:300] = (210, 190, 170)
    # "Floor" - dark brown
    img[150:200, :] = (100, 80, 60)
    return img


# ---------------------------------------------------------------------------
# OpenCV fallback segmentation
# ---------------------------------------------------------------------------
class TestSegmentAuto:
    def test_returns_list(self, segmentation_service, wall_image):
        result = segmentation_service.segment_auto(wall_image)
        assert isinstance(result, list)
        assert len(result) > 0

    def test_each_segment_has_required_fields(self, segmentation_service, wall_image):
        result = segmentation_service.segment_auto(wall_image)
        for segment in result:
            assert "id" in segment
            assert "polygon" in segment
            assert "area" in segment
            assert "mask" in segment

    def test_masks_are_boolean(self, segmentation_service, wall_image):
        result = segmentation_service.segment_auto(wall_image)
        for segment in result:
            mask = segment["mask"]
            assert mask.dtype == bool or mask.dtype == np.bool_

    def test_masks_match_image_size(self, segmentation_service, wall_image):
        result = segmentation_service.segment_auto(wall_image)
        h, w = wall_image.shape[:2]
        for segment in result:
            assert segment["mask"].shape == (h, w)


class TestSegmentWithPoint:
    def test_returns_segment_at_center(self, segmentation_service, wall_image):
        result = segmentation_service.segment_with_point(wall_image, 150, 100)
        assert result is not None
        assert "mask" in result
        assert "polygon" in result

    def test_returns_segment_at_corner(self, segmentation_service, wall_image):
        result = segmentation_service.segment_with_point(wall_image, 10, 10)
        # Should find something (the ceiling region)
        assert result is not None


# ---------------------------------------------------------------------------
# RLE mask compression
# ---------------------------------------------------------------------------
class TestMaskRLE:
    def test_roundtrip_simple(self):
        mask = np.zeros((50, 50), dtype=bool)
        mask[10:40, 10:40] = True
        compressed = compress_mask_rle(mask)
        decompressed = decompress_mask_rle(compressed, mask.shape)
        np.testing.assert_array_equal(mask, decompressed)

    def test_roundtrip_full(self):
        mask = np.ones((100, 100), dtype=bool)
        compressed = compress_mask_rle(mask)
        decompressed = decompress_mask_rle(compressed, mask.shape)
        np.testing.assert_array_equal(mask, decompressed)

    def test_roundtrip_empty(self):
        mask = np.zeros((100, 100), dtype=bool)
        compressed = compress_mask_rle(mask)
        decompressed = decompress_mask_rle(compressed, mask.shape)
        np.testing.assert_array_equal(mask, decompressed)

    def test_compression_saves_space(self):
        mask = np.zeros((500, 500), dtype=bool)
        mask[100:400, 100:400] = True
        compressed = compress_mask_rle(mask)
        # Compressed should be smaller than the raw mask
        raw_size = mask.nbytes
        assert len(compressed) < raw_size
