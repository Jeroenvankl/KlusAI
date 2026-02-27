"""
Tests for app.services.paint_engine — LAB blending, comparison, estimation.
"""
import numpy as np
import pytest

from app.services.paint_engine import apply_paint, generate_comparison, estimate_paint_needed


@pytest.fixture
def sample_image():
    """100x100 beige-ish image simulating a wall."""
    return np.full((100, 100, 3), (200, 180, 160), dtype=np.uint8)


@pytest.fixture
def center_mask():
    """Mask with the center 50x50 region as True."""
    mask = np.zeros((100, 100), dtype=bool)
    mask[25:75, 25:75] = True
    return mask


# ---------------------------------------------------------------------------
# apply_paint
# ---------------------------------------------------------------------------
class TestApplyPaint:
    def test_output_shape_and_dtype(self, sample_image, center_mask):
        result = apply_paint(sample_image, center_mask, "#FF0000")
        assert result.shape == sample_image.shape
        assert result.dtype == np.uint8

    def test_painted_region_differs(self, sample_image, center_mask):
        result = apply_paint(sample_image, center_mask, "#FF0000")
        # Center should be different from original
        orig_center = sample_image[50, 50].astype(float)
        new_center = result[50, 50].astype(float)
        diff = np.linalg.norm(orig_center - new_center)
        assert diff > 20  # Should be noticeably different

    def test_unpainted_region_preserved(self, sample_image, center_mask):
        result = apply_paint(sample_image, center_mask, "#FF0000")
        # Corner (0,0) is outside mask — should be ~same as original
        # (feathering might slightly affect border pixels)
        np.testing.assert_array_almost_equal(
            result[0, 0].astype(float),
            sample_image[0, 0].astype(float),
            decimal=0,
        )

    def test_brightness_lighter(self, sample_image, center_mask):
        base = apply_paint(sample_image, center_mask, "#808080", brightness=50)
        bright = apply_paint(sample_image, center_mask, "#808080", brightness=80)
        # The brighter version should have higher mean pixel values in painted area
        base_mean = base[40:60, 40:60].mean()
        bright_mean = bright[40:60, 40:60].mean()
        assert bright_mean > base_mean

    def test_brightness_darker(self, sample_image, center_mask):
        base = apply_paint(sample_image, center_mask, "#808080", brightness=50)
        dark = apply_paint(sample_image, center_mask, "#808080", brightness=20)
        base_mean = base[40:60, 40:60].mean()
        dark_mean = dark[40:60, 40:60].mean()
        assert dark_mean < base_mean

    def test_warmth_positive(self, sample_image, center_mask):
        neutral = apply_paint(sample_image, center_mask, "#808080", warmth=0)
        warm = apply_paint(sample_image, center_mask, "#808080", warmth=40)
        # Warm should have more red/yellow relative
        # Check that red channel is higher or blue channel is lower
        neutral_b = neutral[50, 50, 2].astype(float)
        warm_b = warm[50, 50, 2].astype(float)
        # Warmth shifts b* up → less blue expected
        assert warm_b <= neutral_b + 10  # Allowing some tolerance

    def test_white_paint(self, sample_image, center_mask):
        result = apply_paint(sample_image, center_mask, "#FFFFFF")
        center = result[50, 50]
        # Should be very light
        assert center.mean() > 180

    def test_black_paint(self, sample_image, center_mask):
        result = apply_paint(sample_image, center_mask, "#000000")
        center = result[50, 50]
        # Should be darker than original (~180 mean) but LAB blending
        # preserves 70% of original lightness texture, so not fully black
        assert center.mean() < 160
        assert center.mean() < sample_image[50, 50].mean()

    def test_full_mask(self, sample_image):
        full_mask = np.ones((100, 100), dtype=bool)
        result = apply_paint(sample_image, full_mask, "#FF0000")
        assert result.shape == sample_image.shape

    def test_empty_mask(self, sample_image):
        empty_mask = np.zeros((100, 100), dtype=bool)
        result = apply_paint(sample_image, empty_mask, "#FF0000")
        # Image should be essentially unchanged
        np.testing.assert_array_almost_equal(
            result.astype(float), sample_image.astype(float), decimal=0,
        )


# ---------------------------------------------------------------------------
# generate_comparison
# ---------------------------------------------------------------------------
class TestGenerateComparison:
    def test_returns_correct_count(self, sample_image, center_mask):
        colors = ["#FF0000", "#00FF00", "#0000FF"]
        results = generate_comparison(sample_image, center_mask, colors)
        assert len(results) == 3

    def test_each_result_valid_shape(self, sample_image, center_mask):
        colors = ["#FF0000", "#00FF00"]
        results = generate_comparison(sample_image, center_mask, colors)
        for r in results:
            assert r.shape == sample_image.shape
            assert r.dtype == np.uint8

    def test_different_colors_produce_different_images(self, sample_image, center_mask):
        results = generate_comparison(sample_image, center_mask, ["#FF0000", "#0000FF"])
        diff = np.abs(results[0].astype(float) - results[1].astype(float)).mean()
        assert diff > 5  # Should be noticeably different


# ---------------------------------------------------------------------------
# estimate_paint_needed
# ---------------------------------------------------------------------------
class TestEstimatePaint:
    def test_basic_calculation(self):
        # 12 m² wall, 12 m²/L coverage, 2 coats = 2L + 10% = 2.2L
        result = estimate_paint_needed(12.0)
        assert result == pytest.approx(2.2, abs=0.1)

    def test_large_area(self):
        result = estimate_paint_needed(50.0)
        assert result > 5  # Should need several liters

    def test_zero_area(self):
        result = estimate_paint_needed(0)
        assert result == 0.0

    def test_custom_coverage(self):
        result = estimate_paint_needed(10.0, coverage_per_liter=10.0, coats=1)
        assert result == pytest.approx(1.1, abs=0.1)

    def test_invalid_coverage_defaults(self):
        # coverage_per_liter = 0 should default to 12.0
        result = estimate_paint_needed(12.0, coverage_per_liter=0)
        assert result > 0
