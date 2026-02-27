from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, LargeBinary, String, func
from sqlalchemy.dialects.sqlite import JSON
from sqlalchemy.orm import relationship
from app.models.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    name = Column(String(100), nullable=False)
    original_image = Column(String(500), nullable=False)
    room_type = Column(String(50), nullable=True)
    dimensions = Column(JSON, nullable=True)
    analysis_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    segments = relationship("RoomSegment", backref="room", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Room {self.name} ({self.room_type})>"


class RoomSegment(Base):
    __tablename__ = "room_segments"

    id = Column(Integer, primary_key=True, autoincrement=True)
    room_id = Column(Integer, ForeignKey("rooms.id"), nullable=False)
    segment_type = Column(String(50), nullable=False)
    mask_data = Column(LargeBinary, nullable=False)
    polygon = Column(JSON, nullable=False)
    area_pixels = Column(Integer, nullable=True)
    area_m2 = Column(Float, nullable=True)
    current_color = Column(String(7), nullable=True)
    label = Column(String(100), nullable=True)

    def __repr__(self):
        return f"<RoomSegment {self.segment_type} - {self.label}>"
