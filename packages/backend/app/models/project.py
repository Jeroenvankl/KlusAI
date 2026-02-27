from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship
from app.models.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    description = Column(String(1000), nullable=True)
    budget_min = Column(Float, nullable=True)
    budget_max = Column(Float, nullable=True)
    style = Column(String(50), nullable=True)
    status = Column(String(20), default="actief")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    rooms = relationship("Room", backref="project", cascade="all, delete-orphan")
    build_plans = relationship("BuildPlan", backref="project", cascade="all, delete-orphan")
    cart_items = relationship("CartItem", backref="project", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Project {self.name} ({self.status})>"


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    paint_color_id = Column(Integer, ForeignKey("paint_colors.id"), nullable=True)
    quantity = Column(Float, default=1)
    unit = Column(String(50), nullable=True)
    notes = Column(String(500), nullable=True)
    added_at = Column(DateTime, server_default=func.now())

    def __repr__(self):
        return f"<CartItem project={self.project_id} qty={self.quantity}>"
