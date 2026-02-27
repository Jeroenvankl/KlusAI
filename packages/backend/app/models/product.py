from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, Text, func
from sqlalchemy.dialects.sqlite import JSON
from app.models.database import Base


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    store = Column(String(50), nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    subcategory = Column(String(100), nullable=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    unit = Column(String(50), nullable=True)
    product_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    brand = Column(String(100), nullable=True)
    eco_score = Column(String(1), nullable=True)
    in_stock = Column(Boolean, default=True)
    tags = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<Product {self.store} - {self.name}>"
