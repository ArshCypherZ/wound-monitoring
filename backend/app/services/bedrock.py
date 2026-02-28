import boto3
import json
import base64
from app.config import get_settings

settings = get_settings()
bedrock_client = boto3.client("bedrock-runtime", region_name=settings.aws_region, aws_access_key_id=settings.aws_access_key_id, aws_secret_access_key=settings.aws_secret_access_key)


def assess_wound(image_bytes: bytes, patient_context: dict) -> dict:
    """Returns: { healing_score, pwat_scores, infection_status, tissue_types, anomalies, urgency_level, summary, recommendations, voice_agent_script }"""
    # TODO: base64 encode image_bytes
    # TODO: build messages payload with system prompt constraining output to JSON
    # TODO: invoke_model with bedrock_model_id, parse response JSON
    pass
