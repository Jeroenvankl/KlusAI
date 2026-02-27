import logging

from fastapi import APIRouter, File, Request, UploadFile

from app.services.image_pipeline import ImagePipeline
from app.utils.image import image_to_base64_for_claude

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/analyze")
async def reverse_engineer_photo(
    request: Request,
    image: UploadFile = File(...),
):
    """Analyze an inspiration photo and break it down into recreatable components."""
    image_bytes = await image.read()
    processed = ImagePipeline.preprocess_upload(image_bytes)

    image_b64, media_type = image_to_base64_for_claude(processed)

    claude = request.app.state.claude
    analysis = claude.reverse_engineer(image_b64, media_type)

    return analysis
