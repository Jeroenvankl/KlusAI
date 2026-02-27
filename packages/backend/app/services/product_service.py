import logging

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.paint import PaintColor
from app.models.product import Product
from app.utils.color import hex_to_lab, delta_e

logger = logging.getLogger(__name__)


class ProductService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def search_products(
        self,
        query: str | None = None,
        store: str | None = None,
        category: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        eco_score: str | None = None,
        page: int = 1,
        per_page: int = 20,
    ) -> dict:
        stmt = select(Product).where(Product.in_stock == True)

        if query:
            stmt = stmt.where(Product.name.ilike(f"%{query}%"))
        if store:
            stmt = stmt.where(Product.store == store)
        if category:
            stmt = stmt.where(Product.category == category)
        if min_price is not None:
            stmt = stmt.where(Product.price >= min_price)
        if max_price is not None:
            stmt = stmt.where(Product.price <= max_price)
        if eco_score:
            stmt = stmt.where(Product.eco_score == eco_score)

        # Count total
        count_stmt = select(func.count()).select_from(stmt.subquery())
        total = (await self.session.execute(count_stmt)).scalar()

        # Paginate
        stmt = stmt.offset((page - 1) * per_page).limit(per_page)
        result = await self.session.execute(stmt)
        products = result.scalars().all()

        return {
            "products": products,
            "total": total,
            "page": page,
            "per_page": per_page,
        }

    async def search_paint_colors(
        self,
        hex_code: str | None = None,
        brand: str | None = None,
        finish: str | None = None,
        limit: int = 20,
    ) -> list[PaintColor]:
        stmt = select(PaintColor).where(PaintColor.is_active == True)

        if brand:
            stmt = stmt.where(PaintColor.brand == brand)
        if finish:
            stmt = stmt.where(PaintColor.finish == finish)

        result = await self.session.execute(stmt.limit(100))
        colors = list(result.scalars().all())

        # If hex_code provided, sort by color similarity
        if hex_code:
            colors_with_distance = []
            for color in colors:
                dist = delta_e(hex_code, color.hex_code)
                colors_with_distance.append((dist, color))
            colors_with_distance.sort(key=lambda x: x[0])
            return [c for _, c in colors_with_distance[:limit]]

        return colors[:limit]

    async def get_all_colors(
        self,
        brand: str | None = None,
        search: str | None = None,
        limit: int = 300,
    ) -> list[PaintColor]:
        """Return all active paint colors with optional text search and brand filter."""
        stmt = select(PaintColor).where(PaintColor.is_active == True)

        if brand:
            stmt = stmt.where(PaintColor.brand == brand)
        if search:
            term = f"%{search}%"
            stmt = stmt.where(
                PaintColor.name.ilike(term)
                | PaintColor.brand.ilike(term)
                | PaintColor.collection.ilike(term)
                | PaintColor.hex_code.ilike(term)
            )

        stmt = stmt.order_by(PaintColor.brand, PaintColor.name).limit(limit)
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def get_paint_color(self, color_id: int) -> PaintColor | None:
        result = await self.session.execute(
            select(PaintColor).where(PaintColor.id == color_id)
        )
        return result.scalar_one_or_none()

    async def get_product(self, product_id: int) -> Product | None:
        result = await self.session.execute(
            select(Product).where(Product.id == product_id)
        )
        return result.scalar_one_or_none()
