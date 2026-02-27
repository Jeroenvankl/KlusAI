import logging

import numpy as np

from app.utils.image import decode_image, decode_base64_image, resize_for_processing

logger = logging.getLogger(__name__)


class ImagePipeline:
    """Orchestrates image processing steps."""

    @staticmethod
    def preprocess_upload(image_bytes: bytes) -> np.ndarray:
        """Process an uploaded image: decode, fix rotation, resize."""
        image = decode_image(image_bytes)
        image = resize_for_processing(image)
        logger.info("Preprocessed image: %dx%d", image.shape[1], image.shape[0])
        return image

    @staticmethod
    def preprocess_base64(base64_str: str) -> np.ndarray:
        """Process a base64-encoded image."""
        image = decode_base64_image(base64_str)
        image = resize_for_processing(image)
        return image
