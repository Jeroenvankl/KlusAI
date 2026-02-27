import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import get_session
from app.models.project import Project
from app.models.room import Room
from app.schemas.build_plan import BuildPlanRequest, BuildPlanResponse
from app.services.build_planner import BuildPlanner

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/create", response_model=dict)
async def create_build_plan(
    request: Request,
    body: BuildPlanRequest,
    session: AsyncSession = Depends(get_session),
):
    """Generate an AI-powered step-by-step build plan."""
    room_analysis = None

    # If project_id provided, verify project exists
    if body.project_id is not None:
        result = await session.execute(
            select(Project).where(Project.id == body.project_id)
        )
        project = result.scalar_one_or_none()
        if project is None:
            raise HTTPException(status_code=404, detail="Project niet gevonden")

    # Get room analysis if room_id provided
    if body.room_id:
        result = await session.execute(
            select(Room).where(Room.id == body.room_id)
        )
        room = result.scalar_one_or_none()
        if room and room.analysis_data:
            room_analysis = room.analysis_data

    claude = request.app.state.claude
    planner = BuildPlanner(claude)

    plan = planner.create_plan(
        description=body.description,
        room_analysis=room_analysis,
        skill_level=body.skill_level,
    )

    return plan
