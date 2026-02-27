import logging

from fastapi import APIRouter, Depends, File, Request, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import get_session
from app.schemas.room import RoomAnalysisResponse
from app.services.image_pipeline import ImagePipeline
from app.services.room_analyzer import RoomAnalyzer

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/", response_model=RoomAnalysisResponse)
async def analyze_room(
    request: Request,
    image: UploadFile = File(...),
    session: AsyncSession = Depends(get_session),
):
    """Analyze a room from a photo: detect walls, windows, doors, furniture, and style."""
    image_bytes = await image.read()
    processed = ImagePipeline.preprocess_upload(image_bytes)

    claude = request.app.state.claude
    segmentation = request.app.state.segmentation

    analyzer = RoomAnalyzer(segmentation, claude)
    analysis = analyzer.analyze(processed)

    return RoomAnalysisResponse(**analysis)
