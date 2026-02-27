import logging

import cv2
import numpy as np

logger = logging.getLogger(__name__)


class SegmentationService:
    """
    Wall segmentation service.

    Uses OpenCV-based segmentation as the default approach.
    Can be extended with SAM (Segment Anything Model) when the model is available.
    """

    def __init__(self):
        self._sam_available = False
        self._predictor = None
        self._mask_generator = None
        self._try_load_sam()

    def _try_load_sam(self):
        """Try to load SAM model. Falls back to OpenCV if not available."""
        try:
            from segment_anything import sam_model_registry, SamPredictor, SamAutomaticMaskGenerator
            from app.config import settings
            import torch

            sam = sam_model_registry[settings.SAM_MODEL_TYPE](checkpoint=settings.SAM_MODEL_PATH)
            device = "cuda" if torch.cuda.is_available() else "cpu"
            sam.to(device=device)
            self._predictor = SamPredictor(sam)
            self._mask_generator = SamAutomaticMaskGenerator(
                sam,
                points_per_side=32,
                pred_iou_thresh=0.86,
                stability_score_thresh=0.92,
                min_mask_region_area=10000,
            )
            self._sam_available = True
            logger.info("SAM model loaded successfully on %s", device)
        except Exception as e:
            logger.warning("SAM model not available, using OpenCV fallback: %s", e)
            self._sam_available = False

    def segment_auto(self, image: np.ndarray) -> list[dict]:
        """
        Automatically segment the image into regions.
        Returns list of masks with metadata.
        """
        if self._sam_available:
            return self._segment_with_sam(image)
        return self._segment_with_opencv(image)

    def segment_with_point(self, image: np.ndarray, point_x: int, point_y: int) -> dict | None:
        """Segment a region based on a user-clicked point."""
        if self._sam_available:
            return self._segment_point_sam(image, point_x, point_y)
        return self._segment_point_opencv(image, point_x, point_y)

    def _segment_with_sam(self, image: np.ndarray) -> list[dict]:
        """Use SAM for automatic segmentation."""
        masks = self._mask_generator.generate(image)
        results = []
        for i, mask_data in enumerate(masks):
            mask = mask_data["segmentation"]
            area = int(mask_data["area"])
            # Filter for wall-like regions: large area, not too fragmented
            image_area = image.shape[0] * image.shape[1]
            if area < image_area * 0.03:
                continue
            polygon = self._mask_to_polygon(mask)
            if polygon is None:
                continue
            results.append({
                "id": i,
                "mask": mask,
                "polygon": polygon,
                "area": area,
                "label": "onbekend",
                "segment_type": "unknown",
            })
        return results

    def _segment_point_sam(self, image: np.ndarray, point_x: int, point_y: int) -> dict | None:
        """Use SAM with point prompt for targeted segmentation."""
        self._predictor.set_image(image)
        input_point = np.array([[point_x, point_y]])
        input_label = np.array([1])
        masks, scores, _ = self._predictor.predict(
            point_coords=input_point,
            point_labels=input_label,
            multimask_output=True,
        )
        # Use the mask with the highest score
        best_idx = np.argmax(scores)
        mask = masks[best_idx]
        polygon = self._mask_to_polygon(mask)
        if polygon is None:
            return None
        return {
            "id": 0,
            "mask": mask,
            "polygon": polygon,
            "area": int(mask.sum()),
            "label": "geselecteerd",
            "segment_type": "wall",
        }

    def _segment_with_opencv(self, image: np.ndarray) -> list[dict]:
        """Fallback: use OpenCV color-based segmentation for wall detection."""
        # Convert to LAB for better color segmentation
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)

        # Use K-means clustering to find dominant color regions
        pixels = lab.reshape(-1, 3).astype(np.float32)
        criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 100, 0.2)
        k = 6  # Number of clusters
        _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_PP_CENTERS)

        # Reshape labels back to image shape
        label_image = labels.reshape(image.shape[:2])
        image_area = image.shape[0] * image.shape[1]

        results = []
        for cluster_id in range(k):
            mask = (label_image == cluster_id).astype(np.uint8)
            area = int(mask.sum())

            # Filter small regions
            if area < image_area * 0.05:
                continue

            # Clean up mask with morphological operations
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)

            polygon = self._mask_to_polygon(mask.astype(bool))
            if polygon is None:
                continue

            results.append({
                "id": cluster_id,
                "mask": mask.astype(bool),
                "polygon": polygon,
                "area": area,
                "label": f"regio_{cluster_id}",
                "segment_type": "unknown",
            })

        return results

    def _segment_point_opencv(self, image: np.ndarray, point_x: int, point_y: int) -> dict | None:
        """Fallback: use flood fill from the clicked point."""
        lab = cv2.cvtColor(image, cv2.COLOR_RGB2LAB)
        h, w = lab.shape[:2]

        # Create mask for flood fill (needs to be 2 pixels larger)
        flood_mask = np.zeros((h + 2, w + 2), np.uint8)

        # Flood fill with tolerance
        tolerance = (20, 20, 20)
        cv2.floodFill(
            lab.copy(), flood_mask,
            seedPoint=(point_x, point_y),
            newVal=(0, 0, 0),
            loDiff=tolerance,
            upDiff=tolerance,
            flags=cv2.FLOODFILL_MASK_ONLY | (255 << 8),
        )

        # Extract the actual mask (without the 1-pixel border)
        mask = flood_mask[1:-1, 1:-1].astype(bool)

        # Clean up
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (10, 10))
        mask_uint8 = mask.astype(np.uint8) * 255
        mask_uint8 = cv2.morphologyEx(mask_uint8, cv2.MORPH_CLOSE, kernel)
        mask = mask_uint8 > 0

        polygon = self._mask_to_polygon(mask)
        if polygon is None:
            return None

        return {
            "id": 0,
            "mask": mask,
            "polygon": polygon,
            "area": int(mask.sum()),
            "label": "geselecteerd",
            "segment_type": "wall",
        }

    @staticmethod
    def _mask_to_polygon(mask: np.ndarray) -> list[list[float]] | None:
        """Convert a binary mask to a simplified polygon."""
        mask_uint8 = (mask.astype(np.uint8) * 255)
        contours, _ = cv2.findContours(mask_uint8, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return None
        # Take the largest contour
        largest = max(contours, key=cv2.contourArea)
        # Simplify the polygon
        epsilon = 0.005 * cv2.arcLength(largest, True)
        approx = cv2.approxPolyDP(largest, epsilon, True)
        polygon = approx.squeeze().tolist()
        if isinstance(polygon[0], int):
            polygon = [polygon]
        return polygon


def compress_mask_rle(mask: np.ndarray) -> bytes:
    """Compress a binary mask using simple run-length encoding."""
    flat = mask.flatten().astype(np.uint8)
    runs = []
    current_val = flat[0]
    count = 1
    for i in range(1, len(flat)):
        if flat[i] == current_val and count < 255:
            count += 1
        else:
            runs.extend([current_val, count])
            current_val = flat[i]
            count = 1
    runs.extend([current_val, count])
    return bytes(runs)


def decompress_mask_rle(data: bytes, shape: tuple[int, int]) -> np.ndarray:
    """Decompress an RLE-encoded mask."""
    flat = []
    for i in range(0, len(data), 2):
        val = data[i]
        count = data[i + 1]
        flat.extend([val] * count)
    return np.array(flat, dtype=bool).reshape(shape)
