"""
Tests for app.utils.color — LAB conversion, delta-E, complementary/analogous.
"""
import pytest
from app.utils.color import (
    hex_to_rgb,
    rgb_to_hex,
    hex_to_lab,
    lab_to_hex,
    delta_e,
    generate_complementary,
    generate_analogous,
)


# ---------------------------------------------------------------------------
# hex ↔ rgb
# ---------------------------------------------------------------------------
class TestHexRgb:
    def test_hex_to_rgb_basic(self):
        assert hex_to_rgb("#FF0000") == (255, 0, 0)
        assert hex_to_rgb("#00FF00") == (0, 255, 0)
        assert hex_to_rgb("#0000FF") == (0, 0, 255)

    def test_hex_to_rgb_no_hash(self):
        assert hex_to_rgb("FFFFFF") == (255, 255, 255)

    def test_hex_to_rgb_lowercase(self):
        assert hex_to_rgb("#aabbcc") == (170, 187, 204)

    def test_rgb_to_hex(self):
        assert rgb_to_hex(255, 0, 0) == "#ff0000"
        assert rgb_to_hex(0, 0, 0) == "#000000"
        assert rgb_to_hex(255, 255, 255) == "#ffffff"

    def test_roundtrip(self):
        r, g, b = hex_to_rgb("#A3C1DA")
        assert rgb_to_hex(r, g, b) == "#a3c1da"


# ---------------------------------------------------------------------------
# hex ↔ lab
# ---------------------------------------------------------------------------
class TestHexLab:
    def test_white(self):
        l, a, b = hex_to_lab("#FFFFFF")
        assert abs(l - 100) < 1
        assert abs(a) < 1
        assert abs(b) < 1

    def test_black(self):
        l, a, b = hex_to_lab("#000000")
        assert abs(l) < 1

    def test_roundtrip(self):
        original = "#D4B896"
        l, a, b = hex_to_lab(original)
        back = lab_to_hex(l, a, b)
        # Allow small rounding errors
        from app.utils.color import hex_to_rgb
        r1, g1, b1 = hex_to_rgb(original)
        r2, g2, b2 = hex_to_rgb(back)
        assert abs(r1 - r2) <= 2
        assert abs(g1 - g2) <= 2
        assert abs(b1 - b2) <= 2


# ---------------------------------------------------------------------------
# Delta-E (CIEDE2000)
# ---------------------------------------------------------------------------
class TestDeltaE:
    def test_identical_colors_zero(self):
        assert delta_e("#FF0000", "#FF0000") == pytest.approx(0, abs=0.01)

    def test_similar_colors_small(self):
        # Very similar beiges
        d = delta_e("#D4B896", "#D6BA98")
        assert d < 5  # Perceptually very close

    def test_opposite_colors_large(self):
        d = delta_e("#FF0000", "#00FFFF")
        assert d > 30  # Very different

    def test_black_white_large(self):
        d = delta_e("#000000", "#FFFFFF")
        assert d > 50

    def test_symmetric(self):
        d1 = delta_e("#FF0000", "#0000FF")
        d2 = delta_e("#0000FF", "#FF0000")
        assert d1 == pytest.approx(d2, abs=0.001)


# ---------------------------------------------------------------------------
# Complementary / Analogous
# ---------------------------------------------------------------------------
class TestColorGeneration:
    def test_complementary_returns_string(self):
        result = generate_complementary("#D4B896")
        assert isinstance(result, str)
        assert result.startswith("#")
        assert len(result) == 7

    def test_complementary_different(self):
        original = "#D4B896"
        comp = generate_complementary(original)
        d = delta_e(original, comp)
        assert d > 5  # Should be noticeably different

    def test_analogous_returns_two(self):
        result = generate_analogous("#D4B896")
        assert isinstance(result, list)
        assert len(result) == 2
        for hex_code in result:
            assert hex_code.startswith("#")
            assert len(hex_code) == 7

    def test_analogous_close_to_original(self):
        original = "#D4B896"
        analogs = generate_analogous(original, angle=30)
        for analog in analogs:
            d = delta_e(original, analog)
            assert d < 30  # Should be relatively close
