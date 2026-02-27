import numpy as np
from scipy.ndimage import gaussian_filter
from skimage.color import rgb2lab, lab2rgb

from app.utils.color import hex_to_lab, hex_to_rgb


# Alpha controls how much of the original wall texture (lightness) is preserved.
# Higher = more texture visible, lower = more uniform paint look.
TEXTURE_ALPHA = 0.7

# Edge feathering radius in pixels
FEATHER_RADIUS = 3


def apply_paint(
    image: np.ndarray,
    mask: np.ndarray,
    target_hex: str,
    brightness: float = 50.0,
    warmth: float = 0.0,
) -> np.ndarray:
    """
    Apply a paint color to a masked region using LAB color blending.

    The key insight: by preserving a percentage of the original L channel,
    we keep the wall's texture (shadows, plaster bumps, light falloff).
    By replacing a* and b* channels, we get the target paint color.

    Args:
        image: Original image (H, W, 3) uint8 RGB
        mask: Binary mask (H, W) bool - True where paint should be applied
        target_hex: Target paint color as hex string "#RRGGBB"
        brightness: 0-100, 50 is neutral
        warmth: -50 to +50, 0 is neutral (negative = cool, positive = warm)

    Returns:
        Painted image (H, W, 3) uint8 RGB
    """
    # Convert image to LAB
    image_float = image.astype(np.float64) / 255.0
    lab_image = rgb2lab(image_float)

    # Get target color in LAB
    target_l, target_a, target_b = hex_to_lab(target_hex)

    # Create the painted version
    painted_lab = lab_image.copy()

    # L channel: blend original texture with target lightness
    original_l = lab_image[:, :, 0]
    painted_lab[:, :, 0] = original_l * TEXTURE_ALPHA + target_l * (1 - TEXTURE_ALPHA)

    # a* and b* channels: fully replace with target color
    painted_lab[:, :, 1] = target_a
    painted_lab[:, :, 2] = target_b

    # Apply brightness adjustment (-25 to +25 on L channel)
    brightness_offset = (brightness - 50.0) * 0.5
    painted_lab[:, :, 0] += brightness_offset

    # Apply warmth adjustment (shifts b* channel: negative = blue/cool, positive = yellow/warm)
    warmth_offset = warmth * 0.3
    painted_lab[:, :, 2] += warmth_offset

    # Clamp LAB values to valid ranges
    painted_lab[:, :, 0] = np.clip(painted_lab[:, :, 0], 0, 100)
    painted_lab[:, :, 1] = np.clip(painted_lab[:, :, 1], -128, 127)
    painted_lab[:, :, 2] = np.clip(painted_lab[:, :, 2], -128, 127)

    # Create feathered mask for smooth edges
    mask_float = mask.astype(np.float64)
    if FEATHER_RADIUS > 0:
        mask_float = gaussian_filter(mask_float, sigma=FEATHER_RADIUS)

    # Blend: painted region where mask is True, original elsewhere
    mask_3d = mask_float[:, :, np.newaxis]
    result_lab = painted_lab * mask_3d + lab_image * (1 - mask_3d)

    # Convert back to RGB
    result_rgb = lab2rgb(result_lab)
    result_uint8 = np.clip(result_rgb * 255, 0, 255).astype(np.uint8)

    return result_uint8


def generate_comparison(
    image: np.ndarray,
    mask: np.ndarray,
    hex_codes: list[str],
    brightness: float = 50.0,
    warmth: float = 0.0,
) -> list[np.ndarray]:
    """Generate painted previews for multiple colors for side-by-side comparison."""
    return [
        apply_paint(image, mask, hex_code, brightness, warmth)
        for hex_code in hex_codes
    ]


def estimate_paint_needed(area_m2: float, coverage_per_liter: float = 12.0, coats: int = 2) -> float:
    """Estimate liters of paint needed with margin."""
    if coverage_per_liter <= 0:
        coverage_per_liter = 12.0
    base = (area_m2 / coverage_per_liter) * coats
    # Add 10% margin for waste
    return round(base * 1.10, 1)
