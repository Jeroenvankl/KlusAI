import logging

from fastapi import APIRouter, File, Request, UploadFile

from app.schemas.segment import PointSegmentRequest, SegmentMask, SegmentResponse
from app.services.image_pipeline import ImagePipeline
from app.utils.image import decode_base64_image, resize_for_processing

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/auto", response_model=SegmentResponse)
async def segment_auto(request: Request, image: UploadFile = File(...)):
    """Automatically segment an image into regions (walls, floor, ceiling, etc.)."""
    image_bytes = await image.read()
    processed = ImagePipeline.preprocess_upload(image_bytes)

    segmentation = request.app.state.segmentation
    masks = segmentation.segment_auto(processed)

    return SegmentResponse(
        masks=[
            SegmentMask(
                id=m["id"],
                polygon=m["polygon"],
                area=m["area"],
                label=m["label"],
                segment_type=m["segment_type"],
            )
            for m in masks
        ],
        image_width=processed.shape[1],
        image_height=processed.shape[0],
    )


@router.post("/point", response_model=SegmentMask)
async def segment_point(request: Request, body: PointSegmentRequest):
    """Segment a region based on a user-clicked point."""
    image = decode_base64_image(body.image_base64)
    image = resize_for_processing(image)

    segmentation = request.app.state.segmentation
    result = segmentation.segment_with_point(image, body.point_x, body.point_y)

    if result is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Geen regio gevonden op dit punt")

    return SegmentMask(
        id=result["id"],
        polygon=result["polygon"],
        area=result["area"],
        label=result["label"],
        segment_type=result["segment_type"],
    )
