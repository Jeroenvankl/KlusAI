import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import get_session
from app.models.room import Room
from app.schemas.design import DesignRequest, DesignSuggestionResponse
from app.services.design_engine import DesignEngine

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/suggest", response_model=DesignSuggestionResponse)
async def suggest_design(
    request: Request,
    body: DesignRequest,
    session: AsyncSession = Depends(get_session),
):
    """Get AI-powered design suggestions for a room."""
    # Fetch the room analysis
    result = await session.execute(
        select(Room).where(Room.id == body.room_id)
    )
    room = result.scalar_one_or_none()
    if room is None:
        raise HTTPException(status_code=404, detail="Kamer niet gevonden")
    if room.analysis_data is None:
        raise HTTPException(status_code=400, detail="Kamer is nog niet geanalyseerd")

    claude = request.app.state.claude
    engine = DesignEngine(claude)

    suggestion = engine.suggest(
        room_analysis=room.analysis_data,
        style=body.style,
        budget_min=body.budget_min,
        budget_max=body.budget_max,
        preferences=body.preferences,
    )

    return DesignSuggestionResponse(**suggestion)


@router.get("/styles")
async def get_styles(request: Request):
    """Get available design styles."""
    claude = request.app.state.claude
    engine = DesignEngine(claude)
    return engine.get_available_styles()
