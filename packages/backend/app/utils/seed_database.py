"""
Database seeder for KlusAI.
Loads paint colors and products from JSON seed files.
"""
import asyncio
import json
import sys
from pathlib import Path

from sqlalchemy import select

# Add parent to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.config import settings
from app.models.database import Base, engine, async_session
from app.models.paint import PaintColor
from app.models.product import Product
from app.utils.color import hex_to_lab


SEED_DIR = Path(__file__).parent.parent.parent / "data" / "seed"


async def seed_paint_colors():
    """Load paint colors from JSON and insert into database."""
    json_path = SEED_DIR / "paint_colors.json"
    if not json_path.exists():
        print(f"[SKIP] {json_path} not found")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        colors = json.load(f)

    async with async_session() as session:
        # Check if already seeded
        result = await session.execute(select(PaintColor).limit(1))
        if result.scalar_one_or_none() is not None:
            print(f"[SKIP] paint_colors already seeded")
            return

        count = 0
        for color_data in colors:
            # Pre-compute LAB values
            try:
                lab_l, lab_a, lab_b = hex_to_lab(color_data["hex_code"])
            except Exception as e:
                print(f"[WARN] Could not convert {color_data['hex_code']}: {e}")
                continue

            paint = PaintColor(
                brand=color_data["brand"],
                collection=color_data.get("collection"),
                name=color_data["name"],
                hex_code=color_data["hex_code"],
                lab_l=lab_l,
                lab_a=lab_a,
                lab_b=lab_b,
                price_per_liter=color_data.get("price_per_liter"),
                coverage_m2=color_data.get("coverage_m2"),
                eco_score=color_data.get("eco_score"),
                product_url=color_data.get("product_url"),
                image_url=color_data.get("image_url"),
                finish=color_data.get("finish"),
                is_active=True,
            )
            session.add(paint)
            count += 1

        await session.commit()
        print(f"[OK] Seeded {count} paint colors")


async def seed_products():
    """Load products from JSON and insert into database."""
    json_path = SEED_DIR / "products.json"
    if not json_path.exists():
        print(f"[SKIP] {json_path} not found")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        products = json.load(f)

    async with async_session() as session:
        # Check if already seeded
        result = await session.execute(select(Product).limit(1))
        if result.scalar_one_or_none() is not None:
            print(f"[SKIP] products already seeded")
            return

        count = 0
        for product_data in products:
            product = Product(
                store=product_data["store"],
                category=product_data["category"],
                subcategory=product_data.get("subcategory"),
                name=product_data["name"],
                description=product_data.get("description"),
                price=product_data.get("price"),
                unit=product_data.get("unit"),
                product_url=product_data.get("product_url"),
                image_url=product_data.get("image_url"),
                brand=product_data.get("brand"),
                eco_score=product_data.get("eco_score"),
                in_stock=product_data.get("in_stock", True),
                tags=product_data.get("tags"),
            )
            session.add(product)
            count += 1

        await session.commit()
        print(f"[OK] Seeded {count} products")


async def seed_default_project():
    """Create a default project for quick testing."""
    from app.models.project import Project

    async with async_session() as session:
        result = await session.execute(select(Project).limit(1))
        if result.scalar_one_or_none() is not None:
            print(f"[SKIP] default project already exists")
            return

        project = Project(
            name="Mijn Eerste Project",
            description="Standaard project om mee te beginnen",
            budget_min=0,
            budget_max=5000,
            style="scandinavisch",
            status="actief",
        )
        session.add(project)
        await session.commit()
        print(f"[OK] Created default project")


async def main():
    print("=" * 50)
    print("KlusAI Database Seeder")
    print("=" * 50)

    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[OK] Database tables created")

    # Seed data
    await seed_paint_colors()
    await seed_products()
    await seed_default_project()

    print("=" * 50)
    print("Seeding complete!")
    print("=" * 50)


if __name__ == "__main__":
    asyncio.run(main())
