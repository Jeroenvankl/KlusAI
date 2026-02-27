"""
Shared test fixtures for KlusAI backend tests.
Uses an in-memory SQLite database for isolation.
"""
import asyncio
import base64
import io
import json
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import numpy as np
import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from PIL import Image
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.models.database import Base, get_session
from app.models.paint import PaintColor
from app.models.product import Product
from app.models.project import Project
from app.models.room import Room
from app.utils.color import hex_to_lab


# ---------------------------------------------------------------------------
# Event loop
# ---------------------------------------------------------------------------
@pytest.fixture(scope="session")
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


# ---------------------------------------------------------------------------
# Test database (in-memory SQLite)
# ---------------------------------------------------------------------------
TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

@pytest_asyncio.fixture()
async def db_engine():
    engine = create_async_engine(TEST_DB_URL, echo=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest_asyncio.fixture()
async def db_session(db_engine):
    session_factory = async_sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)
    async with session_factory() as session:
        yield session


# ---------------------------------------------------------------------------
# Seed helpers
# ---------------------------------------------------------------------------
@pytest_asyncio.fixture()
async def seeded_db(db_session):
    """Insert a small set of paint colors and products for testing."""
    # Paint colors
    colors_data = [
        {"brand": "Flexa", "collection": "Creations", "name": "Sandy Beach", "hex_code": "#D4B896", "price_per_liter": 8.99, "coverage_m2": 12.0, "eco_score": "B", "finish": "mat"},
        {"brand": "Flexa", "collection": "Creations", "name": "Early Dew", "hex_code": "#97B59B", "price_per_liter": 8.99, "coverage_m2": 12.0, "eco_score": "A", "finish": "mat"},
        {"brand": "Sikkens", "collection": "Alphacryl", "name": "Warm Wit", "hex_code": "#F5F0E8", "price_per_liter": 12.50, "coverage_m2": 14.0, "eco_score": "A", "finish": "zijdeglans"},
        {"brand": "Histor", "collection": "Perfect Finish", "name": "Nachtblauw", "hex_code": "#2C3E50", "price_per_liter": 7.50, "coverage_m2": 11.0, "eco_score": "B", "finish": "mat"},
        {"brand": "Gamma Huismerk", "collection": None, "name": "Antraciet", "hex_code": "#333333", "price_per_liter": 5.99, "coverage_m2": 10.0, "eco_score": "C", "finish": "mat"},
    ]
    for cd in colors_data:
        lab_l, lab_a, lab_b = hex_to_lab(cd["hex_code"])
        db_session.add(PaintColor(
            brand=cd["brand"], collection=cd.get("collection"), name=cd["name"],
            hex_code=cd["hex_code"], lab_l=lab_l, lab_a=lab_a, lab_b=lab_b,
            price_per_liter=cd.get("price_per_liter"), coverage_m2=cd.get("coverage_m2"),
            eco_score=cd.get("eco_score"), finish=cd.get("finish"), is_active=True,
        ))

    # Products
    products_data = [
        {"store": "Gamma", "category": "Verf", "name": "Muurverf Wit 5L", "price": 29.99, "unit": "stuk", "brand": "Flexa", "eco_score": "A", "in_stock": True, "tags": ["verf", "wit"]},
        {"store": "Praxis", "category": "Gereedschap", "name": "Verfroller Set", "price": 12.99, "unit": "set", "brand": "Praxis Huismerk", "eco_score": "B", "in_stock": True, "tags": ["roller", "verf"]},
        {"store": "IKEA", "category": "Meubels", "name": "KALLAX Stellingkast", "price": 79.00, "unit": "stuk", "brand": "IKEA", "eco_score": "A", "in_stock": True, "tags": ["kast", "opbergen"]},
        {"store": "Gamma", "category": "Verf", "name": "Grondverf 2.5L", "price": 19.99, "unit": "stuk", "brand": "Flexa", "eco_score": "B", "in_stock": False, "tags": ["grondverf"]},
        {"store": "Karwei", "category": "Vloeren", "name": "Laminaat Eiken", "price": 24.99, "unit": "m2", "brand": "Karwei Huismerk", "eco_score": "B", "in_stock": True, "tags": ["laminaat", "vloer"]},
    ]
    for pd in products_data:
        db_session.add(Product(
            store=pd["store"], category=pd["category"], name=pd["name"],
            price=pd.get("price"), unit=pd.get("unit"), brand=pd.get("brand"),
            eco_score=pd.get("eco_score"), in_stock=pd.get("in_stock", True),
            tags=pd.get("tags"),
        ))

    # Default project
    project = Project(
        name="Test Project", description="Testproject", budget_min=0,
        budget_max=5000, style="scandinavisch", status="actief",
    )
    db_session.add(project)
    await db_session.flush()  # Get project.id

    # Room with analysis data (needed for design/build-plan tests)
    room = Room(
        project_id=project.id,
        name="Woonkamer",
        original_image="/test/room.jpg",
        room_type="woonkamer",
        dimensions={"width_m": 4.0, "length_m": 5.0, "height_m": 2.7},
        analysis_data={
            "room_type": "woonkamer",
            "walls": [{"position": "noord", "color": "#F5F0E8", "condition": "goed", "area_m2": 12.0}],
            "windows": [{"type": "draairaam", "wall_position": "oost", "estimated_size": "120x150cm"}],
            "doors": [{"type": "binnendeur", "wall_position": "west"}],
            "floor": {"type": "laminaat", "condition": "goed", "color": "licht eiken"},
            "ceiling": {"type": "stucwerk", "color": "wit", "height": "2.7m"},
            "furniture": [{"name": "bank", "type": "zitmeubel", "size": "groot"}],
            "lighting": {"natural": "goed", "artificial": ["plafondlamp"], "overall_brightness": "helder"},
            "estimated_dimensions": {"width_m": 4.0, "length_m": 5.0, "height_m": 2.7},
            "style_assessment": "Modern Scandinavisch met warme houtaccenten",
        },
    )
    db_session.add(room)

    await db_session.commit()
    return db_session


# ---------------------------------------------------------------------------
# Image helpers
# ---------------------------------------------------------------------------
def make_test_image(width: int = 100, height: int = 100, color: tuple = (200, 180, 160)) -> np.ndarray:
    """Create a simple test image (numpy RGB array)."""
    img = np.full((height, width, 3), color, dtype=np.uint8)
    return img


def make_test_image_bytes(width: int = 100, height: int = 100, fmt: str = "JPEG") -> bytes:
    """Create a test image and return raw bytes."""
    img = Image.new("RGB", (width, height), (200, 180, 160))
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()


def make_test_image_base64(width: int = 100, height: int = 100) -> str:
    """Create a base64-encoded test image string."""
    raw = make_test_image_bytes(width, height)
    return base64.b64encode(raw).decode()


def make_test_mask(width: int = 100, height: int = 100) -> np.ndarray:
    """Create a binary mask with the center area True."""
    mask = np.zeros((height, width), dtype=bool)
    mask[25:75, 25:75] = True
    return mask


# ---------------------------------------------------------------------------
# FastAPI test client
# ---------------------------------------------------------------------------
@pytest_asyncio.fixture()
async def app(db_engine):
    """Create a FastAPI test app with mocked services."""
    from app.main import create_app

    application = create_app()

    # Override the DB session dependency
    session_factory = async_sessionmaker(db_engine, class_=AsyncSession, expire_on_commit=False)

    async def override_get_session():
        async with session_factory() as session:
            yield session

    application.dependency_overrides[get_session] = override_get_session

    # Mock segmentation service
    mock_seg = MagicMock()
    mock_seg.segment_auto.return_value = [
        {"id": 0, "polygon": [[10, 10], [90, 10], [90, 90], [10, 90]], "area": 6400, "label": "muur", "segment_type": "wall", "mask": make_test_mask()},
    ]
    mock_seg.segment_with_point.return_value = {
        "id": 0, "polygon": [[10, 10], [90, 10], [90, 90], [10, 90]],
        "area": 2500, "label": "muur", "segment_type": "wall",
        "mask": make_test_mask(),
    }
    application.state.segmentation = mock_seg

    # Mock Claude client (no real API calls in tests)
    mock_claude = MagicMock()
    mock_claude.analyze_room.return_value = {
        "room_type": "woonkamer",
        "walls": [{"position": "noord", "color": "#F5F0E8", "condition": "goed", "area_m2": 12.0}],
        "windows": [{"type": "draairaam", "wall_position": "oost", "estimated_size": "120x150cm"}],
        "doors": [{"type": "binnendeur", "wall_position": "west"}],
        "floor": {"type": "laminaat", "condition": "goed", "color": "licht eiken"},
        "ceiling": {"type": "stucwerk", "color": "wit", "height": "2.7m"},
        "furniture": [{"name": "bank", "type": "zitmeubel", "size": "groot", "position": "midden", "style": "modern"}],
        "lighting": {"natural": "goed", "artificial": ["plafondlamp"], "overall_brightness": "helder"},
        "estimated_dimensions": {"width_m": 4.0, "length_m": 5.0, "height_m": 2.7},
        "style_assessment": "Modern Scandinavisch met warme houtaccenten",
    }
    mock_claude.suggest_design.return_value = {
        "style": "japandi",
        "description": "Een rustige mix van Japans en Scandinavisch design",
        "color_palette": [{"hex": "#F5F0E8", "name": "Warm Wit", "role": "basis"}],
        "furniture_changes": [{"item": "salontafel", "suggestion": "ronde eiken tafel", "price": 249}],
        "lighting_suggestions": ["Voeg dimbare vloerlamp toe"],
        "accessories": [{"item": "vaas", "suggestion": "keramiek in aardetinten"}],
        "budget_breakdown": [{"category": "meubels", "amount": 500}],
        "total_estimated_cost": 1200,
        "mood_keywords": ["rustig", "warm", "naturel"],
    }
    mock_claude.create_build_plan.return_value = {
        "title": "Muur schilderen",
        "difficulty": "makkelijk",
        "estimated_hours": 4,
        "total_cost_est": 120,
        "safety_level": "laag",
        "steps": [
            {"order": 1, "title": "Voorbereiding", "description": "Ruimte leegmaken", "tools": ["afdekzeil"], "materials": [{"name": "tape", "quantity": 1, "unit": "rol", "estimated_price": 5}], "safety_warnings": ["ventilatie"], "estimated_mins": 30},
        ],
    }
    mock_claude.reverse_engineer.return_value = {
        "style_name": "Scandinavisch Modern",
        "description": "Lichte, functionele inrichting",
        "color_palette": [{"role": "basis", "hex_code": "#F5F0E8", "name": "Warm Wit"}],
        "furniture": [{"item": "bank", "material": "linnen", "estimated_product": "KIVIK", "store": "IKEA", "estimated_price": 599}],
        "materials": [{"type": "verf", "description": "Watergedragen muurverf"}],
        "lighting": {"type": "warm", "description": "Dimbare verlichting"},
        "how_to_recreate": ["Begin met een lichte basiskleur op de muren"],
        "total_estimated_cost": 1500,
    }
    mock_claude.live_help.return_value = "Ga 2cm naar links en gebruik een waterpas"
    application.state.claude = mock_claude

    yield application


@pytest_asyncio.fixture()
async def client(app):
    """Async HTTP test client."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c
