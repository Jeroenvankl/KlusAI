"""
Tests for /api/v1/build-plan endpoint — AI build plan generation.
"""
import pytest


@pytest.mark.asyncio
class TestBuildPlan:
    async def test_create_plan_success(self, client, seeded_db):
        resp = await client.post("/api/v1/build-plan/create", json={
            "project_id": 1,
            "description": "Ik wil de woonkamer muur schilderen in een lichte kleur",
            "skill_level": "beginner",
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "title" in data
        assert "difficulty" in data
        assert "steps" in data
        assert len(data["steps"]) > 0

    async def test_create_plan_step_structure(self, client, seeded_db):
        resp = await client.post("/api/v1/build-plan/create", json={
            "project_id": 1,
            "description": "Laminaat leggen in de slaapkamer",
            "skill_level": "gemiddeld",
        })
        assert resp.status_code == 200
        data = resp.json()
        for step in data["steps"]:
            assert "order" in step
            assert "title" in step
            assert "description" in step

    async def test_create_plan_missing_description(self, client, seeded_db):
        resp = await client.post("/api/v1/build-plan/create", json={
            "project_id": 1,
        })
        assert resp.status_code == 422
