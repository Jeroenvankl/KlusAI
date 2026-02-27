from pydantic import BaseModel


class SegmentMask(BaseModel):
    id: int
    polygon: list[list[float]]
    area: int
    label: str
    segment_type: str


class SegmentResponse(BaseModel):
    masks: list[SegmentMask]
    image_width: int
    image_height: int


class PointSegmentRequest(BaseModel):
    image_base64: str
    point_x: int
    point_y: int
