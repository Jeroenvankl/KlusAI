from pydantic import BaseModel


class RoomAnalysisResponse(BaseModel):
    room_type: str
    walls: list[dict]
    windows: list[dict]
    doors: list[dict]
    floor: dict
    ceiling: dict
    furniture: list[dict]
    lighting: dict
    estimated_dimensions: dict
    style_assessment: str


class RoomCreateRequest(BaseModel):
    project_id: int
    name: str
    room_type: str | None = None


class RoomResponse(BaseModel):
    id: int
    project_id: int
    name: str
    room_type: str | None
    dimensions: dict | None
    analysis_data: dict | None
    created_at: str

    class Config:
        from_attributes = True
