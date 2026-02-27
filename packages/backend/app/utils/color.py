import numpy as np
from skimage.color import rgb2lab, lab2rgb, deltaE_ciede2000


def hex_to_rgb(hex_code: str) -> tuple[int, int, int]:
    hex_code = hex_code.lstrip("#")
    return (
        int(hex_code[0:2], 16),
        int(hex_code[2:4], 16),
        int(hex_code[4:6], 16),
    )


def rgb_to_hex(r: int, g: int, b: int) -> str:
    return f"#{r:02x}{g:02x}{b:02x}"


def hex_to_lab(hex_code: str) -> tuple[float, float, float]:
    r, g, b = hex_to_rgb(hex_code)
    rgb_normalized = np.array([[[r / 255.0, g / 255.0, b / 255.0]]])
    lab = rgb2lab(rgb_normalized)
    return float(lab[0, 0, 0]), float(lab[0, 0, 1]), float(lab[0, 0, 2])


def lab_to_hex(l: float, a: float, b: float) -> str:
    lab_array = np.array([[[l, a, b]]])
    rgb = lab2rgb(lab_array)
    rgb_uint8 = np.clip(rgb * 255, 0, 255).astype(np.uint8)
    return rgb_to_hex(int(rgb_uint8[0, 0, 0]), int(rgb_uint8[0, 0, 1]), int(rgb_uint8[0, 0, 2]))


def delta_e(hex1: str, hex2: str) -> float:
    lab1 = np.array([[hex_to_lab(hex1)]])
    lab2 = np.array([[hex_to_lab(hex2)]])
    return float(deltaE_ciede2000(lab1, lab2)[0, 0])


def generate_complementary(hex_code: str) -> str:
    l, a, b = hex_to_lab(hex_code)
    return lab_to_hex(l, -a, -b)


def generate_analogous(hex_code: str, angle: float = 30.0) -> list[str]:
    l, a, b = hex_to_lab(hex_code)
    chroma = np.sqrt(a**2 + b**2)
    hue = np.arctan2(b, a)
    rad = np.radians(angle)
    results = []
    for offset in [-rad, rad]:
        new_hue = hue + offset
        new_a = chroma * np.cos(new_hue)
        new_b = chroma * np.sin(new_hue)
        results.append(lab_to_hex(l, float(new_a), float(new_b)))
    return results
