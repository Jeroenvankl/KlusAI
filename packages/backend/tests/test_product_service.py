"""
Tests for app.services.product_service — product & paint color search.
"""
import pytest
import pytest_asyncio

from app.services.product_service import ProductService


# ---------------------------------------------------------------------------
# Product search
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
class TestProductSearch:
    async def test_search_all(self, seeded_db):
        svc = ProductService(seeded_db)
        result = await svc.search_products()
        # Should return only in-stock products (4 out of 5)
        assert result["total"] == 4
        assert len(result["products"]) == 4

    async def test_search_by_query(self, seeded_db):
        svc = ProductService(seeded_db)
        result = await svc.search_products(query="Muurverf")
        assert result["total"] == 1
        assert result["products"][0].name == "Muurverf Wit 5L"

    async def test_search_by_store(self, seeded_db):
        svc = ProductService(seeded_db)
        result = await svc.search_products(store="Gamma")
        # Gamma has 2 products but 1 is out of stock
        assert result["total"] == 1

    async def test_search_by_category(self, seeded_db):
        svc = ProductService(seeded_db)
        result = await svc.search_products(category="Meubels")
        assert result["total"] == 1
        assert result["products"][0].name == "KALLAX Stellingkast"

    async def test_search_by_price_range(self, seeded_db):
        svc = ProductService(seeded_db)
        result = await svc.search_products(min_price=20, max_price=50)
        for p in result["products"]:
            assert 20 <= p.price <= 50

    async def test_search_pagination(self, seeded_db):
        svc = ProductService(seeded_db)
        page1 = await svc.search_products(per_page=2, page=1)
        page2 = await svc.search_products(per_page=2, page=2)
        assert len(page1["products"]) == 2
        assert len(page2["products"]) == 2
        # Different products on different pages
        ids1 = {p.id for p in page1["products"]}
        ids2 = {p.id for p in page2["products"]}
        assert ids1.isdisjoint(ids2)

    async def test_get_product_by_id(self, seeded_db):
        svc = ProductService(seeded_db)
        result = await svc.search_products()
        first_id = result["products"][0].id
        product = await svc.get_product(first_id)
        assert product is not None
        assert product.id == first_id

    async def test_get_product_not_found(self, seeded_db):
        svc = ProductService(seeded_db)
        product = await svc.get_product(99999)
        assert product is None


# ---------------------------------------------------------------------------
# Paint color search
# ---------------------------------------------------------------------------
@pytest.mark.asyncio
class TestPaintColorSearch:
    async def test_search_all_colors(self, seeded_db):
        svc = ProductService(seeded_db)
        colors = await svc.search_paint_colors()
        assert len(colors) == 5

    async def test_search_by_brand(self, seeded_db):
        svc = ProductService(seeded_db)
        colors = await svc.search_paint_colors(brand="Flexa")
        assert len(colors) == 2
        for c in colors:
            assert c.brand == "Flexa"

    async def test_search_by_finish(self, seeded_db):
        svc = ProductService(seeded_db)
        colors = await svc.search_paint_colors(finish="zijdeglans")
        assert len(colors) == 1
        assert colors[0].name == "Warm Wit"

    async def test_search_by_hex_code_similarity(self, seeded_db):
        svc = ProductService(seeded_db)
        # Search for a warm beige — should return Sandy Beach first
        colors = await svc.search_paint_colors(hex_code="#D5B999")
        assert len(colors) > 0
        # First result should be closest to the query color
        assert colors[0].name == "Sandy Beach"

    async def test_search_with_limit(self, seeded_db):
        svc = ProductService(seeded_db)
        colors = await svc.search_paint_colors(limit=2)
        assert len(colors) == 2

    async def test_get_paint_color_by_id(self, seeded_db):
        svc = ProductService(seeded_db)
        colors = await svc.search_paint_colors()
        first_id = colors[0].id
        color = await svc.get_paint_color(first_id)
        assert color is not None
        assert color.id == first_id

    async def test_get_paint_color_not_found(self, seeded_db):
        svc = ProductService(seeded_db)
        color = await svc.get_paint_color(99999)
        assert color is None
