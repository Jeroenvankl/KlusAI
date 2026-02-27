import logging

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import get_session
from app.schemas.product import ProductSchema
from app.services.product_service import ProductService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/", response_model=dict)
async def search_products(
    query: str | None = None,
    store: str | None = None,
    category: str | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    eco_score: str | None = None,
    page: int = Query(default=1, ge=1),
    per_page: int = Query(default=20, ge=1, le=100),
    session: AsyncSession = Depends(get_session),
):
    """Search products across all stores."""
    service = ProductService(session)
    result = await service.search_products(
        query=query,
        store=store,
        category=category,
        min_price=min_price,
        max_price=max_price,
        eco_score=eco_score,
        page=page,
        per_page=per_page,
    )
    return {
        "products": [ProductSchema.model_validate(p) for p in result["products"]],
        "total": result["total"],
        "page": result["page"],
        "per_page": result["per_page"],
    }


@router.get("/{product_id}", response_model=ProductSchema)
async def get_product(
    product_id: int,
    session: AsyncSession = Depends(get_session),
):
    """Get a specific product by ID."""
    service = ProductService(session)
    product = await service.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product niet gevonden")
    return product
