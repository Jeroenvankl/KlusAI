from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String, func
from app.models.database import Base


class PaintColor(Base):
    __tablename__ = "paint_colors"

    id = Column(Integer, primary_key=True, autoincrement=True)
    brand = Column(String(50), nullable=False, index=True)
    collection = Column(String(100), nullable=True)
    name = Column(String(100), nullable=False)
    hex_code = Column(String(7), nullable=False, index=True)
    lab_l = Column(Float, nullable=False)
    lab_a = Column(Float, nullable=False)
    lab_b = Column(Float, nullable=False)
    price_per_liter = Column(Float, nullable=True)
    coverage_m2 = Column(Float, nullable=True)
    eco_score = Column(String(1), nullable=True)
    product_url = Column(String(500), nullable=True)
    image_url = Column(String(500), nullable=True)
    finish = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    def __repr__(self):
        return f"<PaintColor {self.brand} - {self.name} ({self.hex_code})>"
