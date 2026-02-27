import base64
import io

import numpy as np
from PIL import Image, ExifTags


MAX_DIMENSION = 1024


def decode_image(image_bytes: bytes) -> np.ndarray:
    image = Image.open(io.BytesIO(image_bytes))
    image = fix_exif_rotation(image)
    image = image.convert("RGB")
    return np.array(image)


def decode_base64_image(base64_str: str) -> np.ndarray:
    # Strip data URI prefix if present (e.g. "data:image/jpeg;base64,...")
    if "," in base64_str and base64_str.startswith("data:"):
        base64_str = base64_str.split(",", 1)[1]
    image_bytes = base64.b64decode(base64_str)
    return decode_image(image_bytes)


def encode_image_base64(image: np.ndarray, format: str = "JPEG", quality: int = 85) -> str:
    pil_image = Image.fromarray(image)
    buffer = io.BytesIO()
    pil_image.save(buffer, format=format, quality=quality)
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def fix_exif_rotation(image: Image.Image) -> Image.Image:
    try:
        exif = image._getexif()
        if exif is None:
            return image
        orientation_key = None
        for key, val in ExifTags.TAGS.items():
            if val == "Orientation":
                orientation_key = key
                break
        if orientation_key is None or orientation_key not in exif:
            return image
        orientation = exif[orientation_key]
        rotations = {
            3: Image.ROTATE_180,
            6: Image.ROTATE_270,
            8: Image.ROTATE_90,
        }
        if orientation in rotations:
            image = image.transpose(rotations[orientation])
    except (AttributeError, KeyError):
        pass
    return image


def resize_for_processing(image: np.ndarray, max_dim: int = MAX_DIMENSION) -> np.ndarray:
    h, w = image.shape[:2]
    if max(h, w) <= max_dim:
        return image
    scale = max_dim / max(h, w)
    new_w = int(w * scale)
    new_h = int(h * scale)
    pil_image = Image.fromarray(image)
    pil_image = pil_image.resize((new_w, new_h), Image.LANCZOS)
    return np.array(pil_image)


def image_to_base64_for_claude(image: np.ndarray) -> tuple[str, str]:
    base64_str = encode_image_base64(image, format="JPEG", quality=85)
    return base64_str, "image/jpeg"
