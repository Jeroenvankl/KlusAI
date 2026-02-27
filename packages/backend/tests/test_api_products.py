"""
Tests for /api/v1/products endpoints — search, get by ID.
"""
import pytest


@pytest.mark.asyncio
class TestProductsSearch:
    async def test_search_all_products(self, client, seeded_db):
        resp = await client.get("/api/v1/products/")
        assert resp.status_code == 200
        data = resp.json()
        assert "products" in data
        assert "total" in data
        assert "page" in data
        assert data["total"] == 4  # Only in-stock products

    async def test_search_by_query(self, client, seeded_db):
        resp = await client.get("/api/v1/products/", params={"query": "KALLAX"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 1
        assert data["products"][0]["name"] == "KALLAX Stellingkast"

    async def test_search_by_store(self, client, seeded_db):
        resp = await client.get("/api/v1/products/", params={"store": "IKEA"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] >= 1
        for p in data["products"]:
            assert p["store"] == "IKEA"

    async def test_search_by_category(self, client, seeded_db):
        resp = await client.get("/api/v1/products/", params={"category": "Verf"})
        assert resp.status_code == 200
        data = resp.json()
        for p in data["products"]:
            assert p["category"] == "Verf"

    async def test_search_by_price_range(self, client, seeded_db):
        resp = await client.get("/api/v1/products/", params={"min_price": 10, "max_price": 30})
        assert resp.status_code == 200
        data = resp.json()
        for p in data["products"]:
            assert 10 <= p["price"] <= 30

    async def test_search_pagination(self, client, seeded_db):
        resp = await client.get("/api/v1/products/", params={"per_page": 2, "page": 1})
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["products"]) == 2
        assert data["page"] == 1

    async def test_search_pagination_page2(self, client, seeded_db):
        resp = await client.get("/api/v1/products/", params={"per_page": 2, "page": 2})
        assert resp.status_code == 200
        data = resp.json()
        assert len(data["products"]) == 2
        assert data["page"] == 2

    async def test_search_no_results(self, client, seeded_db):
        resp = await client.get("/api/v1/products/", params={"query": "nonexistent-product-xyz"})
        assert resp.status_code == 200
        data = resp.json()
        assert data["total"] == 0
        assert len(data["products"]) == 0


@pytest.mark.asyncio
class TestProductById:
    async def test_get_product_success(self, client, seeded_db):
        # First get list to find a valid ID
        list_resp = await client.get("/api/v1/products/")
        product_id = list_resp.json()["products"][0]["id"]

        resp = await client.get(f"/api/v1/products/{product_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == product_id
        assert "name" in data
        assert "store" in data
        assert "price" in data

    async def test_get_product_not_found(self, client, seeded_db):
        resp = await client.get("/api/v1/products/99999")
        assert resp.status_code == 404
        assert "niet gevonden" in resp.json()["detail"].lower()
