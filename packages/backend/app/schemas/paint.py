from pydantic import BaseModel, Field


class PaintRequest(BaseModel):
    image_base64: str
    mask_id: int
    color_hex: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")
    brightness: float = Field(default=50, ge=0, le=100)
    warmth: float = Field(default=0, ge=-50, le=50)


class PaintResponse(BaseModel):
    preview_image_base64: str
    applied_color_hex: str
    estimated_area_m2: float | None = None
    estimated_liters: float | None = None
    estimated_cost: float | None = None


class PaintColorSchema(BaseModel):
    id: int
    brand: str
    collection: str | None
    name: str
    hex_code: str
    price_per_liter: float | None
    coverage_m2: float | None
    eco_score: str | None
    product_url: str | None
    finish: str | None

    class Config:
        from_attributes = True


class ColorSearchRequest(BaseModel):
    hex_code: str = Field(pattern=r"^#[0-9A-Fa-f]{6}$")
    limit: int = Field(default=10, ge=1, le=50)
    brand: str | None = None
    finish: str | None = None
