from pydantic import BaseModel


class DesignRequest(BaseModel):
    room_id: int
    style: str
    budget_min: float | None = None
    budget_max: float | None = None
    preferences: list[str] = []


class DesignSuggestionResponse(BaseModel):
    style: str
    description: str
    color_palette: list[dict]
    furniture_changes: list[dict]
    lighting_suggestions: list[str]
    accessories: list[dict]
    budget_breakdown: list[dict]
    total_estimated_cost: float
    mood_keywords: list[str]
