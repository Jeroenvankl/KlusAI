from pydantic import BaseModel


class ProductSchema(BaseModel):
    id: int
    store: str
    category: str
    subcategory: str | None
    name: str
    description: str | None
    price: float | None
    unit: str | None
    product_url: str | None
    image_url: str | None
    brand: str | None
    eco_score: str | None
    in_stock: bool
    tags: list[str] | None

    class Config:
        from_attributes = True


class ProductSearchParams(BaseModel):
    query: str | None = None
    store: str | None = None
    category: str | None = None
    min_price: float | None = None
    max_price: float | None = None
    eco_score: str | None = None
    page: int = 1
    per_page: int = 20
