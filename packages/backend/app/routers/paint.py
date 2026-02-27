import logging

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.database import get_session
from app.schemas.paint import (
    ColorSearchRequest,
    PaintColorSchema,
    PaintRequest,
    PaintResponse,
)
from app.services.image_pipeline import ImagePipeline
from app.services.paint_engine import apply_paint, estimate_paint_needed
from app.services.product_service import ProductService
from app.utils.image import encode_image_base64

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/apply", response_model=PaintResponse)
async def apply_paint_color(
    request: Request,
    body: PaintRequest,
    session: AsyncSession = Depends(get_session),
):
    """Apply a paint color to a segmented wall region."""
    # Decode and preprocess the image
    image = ImagePipeline.preprocess_base64(body.image_base64)

    # Get the mask for the specified region
    segmentation = request.app.state.segmentation
    mask_result = segmentation.segment_with_point(
        image,
        image.shape[1] // 2,  # center x as fallback
        image.shape[0] // 2,  # center y as fallback
    )

    if mask_result is None:
        raise HTTPException(status_code=404, detail="Kan de muur niet segmenteren")

    mask = mask_result["mask"]

    # Apply paint using LAB blending
    painted = apply_paint(
        image=image,
        mask=mask,
        target_hex=body.color_hex,
        brightness=body.brightness,
        warmth=body.warmth,
    )

    preview_b64 = encode_image_base64(painted)

    # Estimate paint needed
    area_pixels = int(mask.sum())
    image_total_pixels = image.shape[0] * image.shape[1]
    # Rough estimate: assume a 4m x 3m room photo, scale area
    estimated_area_m2 = (area_pixels / image_total_pixels) * 12.0
    estimated_liters = estimate_paint_needed(estimated_area_m2)

    # Get paint price for cost estimate
    product_service = ProductService(session)
    colors = await product_service.search_paint_colors(hex_code=body.color_hex, limit=1)
    estimated_cost = None
    if colors and colors[0].price_per_liter:
        estimated_cost = round(estimated_liters * colors[0].price_per_liter, 2)

    return PaintResponse(
        preview_image_base64=preview_b64,
        applied_color_hex=body.color_hex,
        estimated_area_m2=round(estimated_area_m2, 1),
        estimated_liters=estimated_liters,
        estimated_cost=estimated_cost,
    )


@router.post("/search-colors", response_model=list[PaintColorSchema])
async def search_colors(
    body: ColorSearchRequest,
    session: AsyncSession = Depends(get_session),
):
    """Search for paint colors by hex code similarity, brand, or finish."""
    product_service = ProductService(session)
    colors = await product_service.search_paint_colors(
        hex_code=body.hex_code,
        brand=body.brand,
        finish=body.finish,
        limit=body.limit,
    )
    return colors


@router.get("/colors", response_model=list[PaintColorSchema])
async def get_all_colors(
    brand: str | None = None,
    search: str | None = None,
    limit: int = 300,
    session: AsyncSession = Depends(get_session),
):
    """Get all paint colors, optionally filtered by brand or text search."""
    product_service = ProductService(session)
    colors = await product_service.get_all_colors(
        brand=brand,
        search=search,
        limit=limit,
    )
    return colors


@router.get("/brands", response_model=list[str])
async def get_brands(session: AsyncSession = Depends(get_session)):
    """Get all available paint brands."""
    from sqlalchemy import select, distinct
    from app.models.paint import PaintColor

    result = await session.execute(
        select(distinct(PaintColor.brand)).where(PaintColor.is_active == True)
    )
    return [row[0] for row in result.all()]
