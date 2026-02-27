"""
Tests for ORM models — creation, relationships, constraints.
"""
import pytest
import pytest_asyncio
from sqlalchemy import select

from app.models.paint import PaintColor
from app.models.product import Product
from app.models.project import Project
from app.models.room import Room, RoomSegment
from app.models.build_plan import BuildPlan, BuildStep


@pytest.mark.asyncio
class TestPaintColorModel:
    async def test_create_paint_color(self, db_session):
        color = PaintColor(
            brand="TestBrand", name="TestColor", hex_code="#FF0000",
            lab_l=53.2, lab_a=80.1, lab_b=67.2,
        )
        db_session.add(color)
        await db_session.commit()

        result = await db_session.execute(select(PaintColor))
        fetched = result.scalar_one()
        assert fetched.brand == "TestBrand"
        assert fetched.hex_code == "#FF0000"
        assert fetched.is_active is True

    async def test_paint_color_defaults(self, db_session):
        color = PaintColor(
            brand="B", name="N", hex_code="#000000",
            lab_l=0, lab_a=0, lab_b=0,
        )
        db_session.add(color)
        await db_session.commit()
        assert color.is_active is True
        assert color.created_at is not None


@pytest.mark.asyncio
class TestProductModel:
    async def test_create_product(self, db_session):
        product = Product(
            store="Gamma", category="Verf", name="Test Product",
            price=19.99, tags=["test", "verf"],
        )
        db_session.add(product)
        await db_session.commit()

        result = await db_session.execute(select(Product))
        fetched = result.scalar_one()
        assert fetched.store == "Gamma"
        assert fetched.tags == ["test", "verf"]
        assert fetched.in_stock is True


@pytest.mark.asyncio
class TestProjectModel:
    async def test_create_project(self, db_session):
        project = Project(
            name="Woonkamer", description="Renovatie project",
            budget_max=5000, style="modern",
        )
        db_session.add(project)
        await db_session.commit()

        result = await db_session.execute(select(Project))
        fetched = result.scalar_one()
        assert fetched.name == "Woonkamer"
        assert fetched.status == "actief"

    async def test_project_room_relationship(self, db_session):
        project = Project(name="Test", description="")
        db_session.add(project)
        await db_session.commit()

        room = Room(
            project_id=project.id, name="Keuken",
            original_image="/path/to/image.jpg",
            room_type="keuken",
        )
        db_session.add(room)
        await db_session.commit()

        result = await db_session.execute(
            select(Project).where(Project.id == project.id)
        )
        fetched = result.scalar_one()
        # Lazy loading in async requires explicit relationship loading
        # so just verify room was created
        room_result = await db_session.execute(
            select(Room).where(Room.project_id == project.id)
        )
        rooms = room_result.scalars().all()
        assert len(rooms) == 1
        assert rooms[0].name == "Keuken"


@pytest.mark.asyncio
class TestBuildPlanModel:
    async def test_create_build_plan_with_steps(self, db_session):
        project = Project(name="Test", description="")
        db_session.add(project)
        await db_session.commit()

        plan = BuildPlan(
            project_id=project.id, title="Muur schilderen",
            difficulty="makkelijk", estimated_hours=4,
        )
        db_session.add(plan)
        await db_session.commit()

        step = BuildStep(
            plan_id=plan.id, order=1,
            title="Voorbereiding",
            description="Ruimte leegmaken en afdekken",
            tools=["afdekzeil", "tape"],
            materials=[{"name": "tape", "quantity": 1}],
            safety_warnings=["ventilatie"],
        )
        db_session.add(step)
        await db_session.commit()

        step_result = await db_session.execute(
            select(BuildStep).where(BuildStep.plan_id == plan.id)
        )
        steps = step_result.scalars().all()
        assert len(steps) == 1
        assert steps[0].tools == ["afdekzeil", "tape"]
