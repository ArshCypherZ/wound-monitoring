from ultralytics import YOLO
from PIL import Image
from io import BytesIO
from app.config import get_settings

settings = get_settings()
_model = None


def get_model() -> YOLO:
    global _model
    if _model is None:
        _model = YOLO(settings.yolo_model_path)
    return _model


def detect_wound(image_bytes: bytes) -> dict:
    """Returns: { detections: [BoundingBox], cropped_image_bytes: bytes|None, has_wound: bool }"""
    # TODO: convert bytes to PIL Image, run model inference
    # TODO: extract bounding boxes, crop highest-confidence detection with padding
    pass
