from pydantic import BaseModel


class BuildPlanRequest(BaseModel):
    project_id: int | None = None
    description: str
    room_id: int | None = None
    scope: str = ""
    skill_level: str = "beginner"


class BuildStepSchema(BaseModel):
    order: int
    title: str
    description: str
    tools: list[str]
    materials: list[dict]
    safety_warnings: list[str]
    estimated_mins: int | None
    image_url: str | None = None

    class Config:
        from_attributes = True


class BuildPlanResponse(BaseModel):
    id: int
    project_id: int
    title: str
    difficulty: str
    estimated_hours: float | None
    total_cost_est: float | None
    safety_level: str | None
    steps: list[BuildStepSchema]
    created_at: str

    class Config:
        from_attributes = True
