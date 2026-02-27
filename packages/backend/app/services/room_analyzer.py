import logging

import numpy as np

from app.services.claude_client import ClaudeClient
from app.services.segmentation import SegmentationService
from app.utils.image import image_to_base64_for_claude, resize_for_processing

logger = logging.getLogger(__name__)


class RoomAnalyzer:
    def __init__(self, segmentation: SegmentationService, claude: ClaudeClient):
        self.segmentation = segmentation
        self.claude = claude

    def analyze(self, image: np.ndarray) -> dict:
        """
        Full room analysis pipeline:
        1. Segment the image to find regions
        2. Send to Claude Vision for identification and analysis
        3. Return structured room data
        """
        # Resize for processing
        processed = resize_for_processing(image)

        # Get segmentation masks
        masks = self.segmentation.segment_auto(processed)
        logger.info("Found %d segments in image", len(masks))

        # Send original image to Claude for analysis
        image_b64, media_type = image_to_base64_for_claude(processed)
        analysis = self.claude.analyze_room(image_b64, media_type)

        # Attach mask data to analysis
        analysis["segments"] = [
            {
                "id": m["id"],
                "polygon": m["polygon"],
                "area": m["area"],
                "label": m["label"],
                "segment_type": m["segment_type"],
            }
            for m in masks
        ]

        return analysis

    def get_masks(self, image: np.ndarray) -> list[dict]:
        """Get segmentation masks without Claude analysis."""
        processed = resize_for_processing(image)
        masks = self.segmentation.segment_auto(processed)
        return [
            {
                "id": m["id"],
                "polygon": m["polygon"],
                "area": m["area"],
                "label": m["label"],
                "segment_type": m["segment_type"],
            }
            for m in masks
        ]
