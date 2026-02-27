from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship
from app.models.database import Base


class BuildPlan(Base):
    __tablename__ = "build_plans"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    title = Column(String(200), nullable=False)
    difficulty = Column(String(20), nullable=False)
    estimated_hours = Column(Float, nullable=True)
    total_cost_est = Column(Float, nullable=True)
    safety_level = Column(String(20), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    steps = relationship("BuildStep", backref="plan", cascade="all, delete-orphan",
                         order_by="BuildStep.order")

    def __repr__(self):
        return f"<BuildPlan {self.title} ({self.difficulty})>"


class BuildStep(Base):
    __tablename__ = "build_steps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    plan_id = Column(Integer, ForeignKey("build_plans.id"), nullable=False)
    order = Column(Integer, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    tools = Column(JSON, nullable=True)
    materials = Column(JSON, nullable=True)
    safety_warnings = Column(JSON, nullable=True)
    estimated_mins = Column(Integer, nullable=True)
    image_url = Column(String(500), nullable=True)
    video_url = Column(String(500), nullable=True)

    def __repr__(self):
        return f"<BuildStep {self.order}. {self.title}>"
