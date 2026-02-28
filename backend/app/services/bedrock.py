import logging
import boto3
import json
import base64
from botocore.exceptions import ClientError
from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()
bedrock_client = boto3.client(
    "bedrock-runtime",
    region_name=settings.aws_region,
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
)

SYSTEM_PROMPT = """You are a medical wound assessment AI. Analyze the wound image provided along with patient context.

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "healing_score": <float 0-10>,
  "pwat_scores": {
    "size": <int 0-4>,
    "depth": <int 0-4>,
    "necrotic_tissue_type": <int 0-4>,
    "necrotic_tissue_amount": <int 0-4>,
    "granulation_tissue_type": <int 0-4>,
    "granulation_tissue_amount": <int 0-4>,
    "edges": <int 0-4>,
    "periulcer_skin_viability": <int 0-2>,
    "total_score": <int 0-32>
  },
  "infection_status": "<none|infection|ischemia|both>",
  "tissue_types": ["<granulation|epithelialization|slough|necrosis|fibrin>"],
  "anomalies": ["<string descriptions of any abnormalities>"],
  "urgency_level": "<low|medium|high>",
  "summary": "<2-3 sentence clinical summary>",
  "recommendations": ["<actionable care recommendations>"],
  "voice_agent_script": "<conversational script the voice agent should read to the patient>"
}"""


def assess_wound(image_bytes: bytes, patient_context: dict, previous_scores: list[dict] | None = None) -> dict:
    """
    Send wound image + patient context to Bedrock Claude for assessment.
    Returns parsed JSON with healing_score, pwat_scores, tissue_types, etc.

    Args:
        image_bytes: Raw image bytes (cropped wound or full photo).
        patient_context: Dict with patient metadata (name, age, surgery_type, days_post_op, etc.).
        previous_scores: Optional list of past assessments, each containing
                         {"date", "healing_score", "days_post_op"}, newest first.
    """
    image_b64 = base64.b64encode(image_bytes).decode("utf-8")

    user_message = f"""Patient context:
- Name: {patient_context.get('name', 'Unknown')}
- Age: {patient_context.get('age', 'Unknown')}
- Surgery type: {patient_context.get('surgery_type', 'Unknown')}
- Days post-op: {patient_context.get('days_post_op', 'Unknown')}
- Wound location: {patient_context.get('wound_location', 'Unknown')}
- Risk factors: {', '.join(patient_context.get('risk_factors', [])) or 'None'}"""

    if previous_scores:
        history_lines = []
        for entry in previous_scores[:5]:  # Limit to 5 most recent for token efficiency
            history_lines.append(
                f"  Day {entry.get('days_post_op', '?')}: "
                f"score {entry.get('healing_score', '?')}/10 "
                f"({entry.get('date', 'unknown date')})"
            )
        user_message += "\n\nPrevious healing scores (newest first):\n" + "\n".join(history_lines)

    user_message += "\n\nPlease analyze the attached wound photograph and provide your assessment."

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2048,
        "system": SYSTEM_PROMPT,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_b64,
                        },
                    },
                    {
                        "type": "text",
                        "text": user_message,
                    },
                ],
            }
        ],
    })

    try:
        response = bedrock_client.invoke_model(
            modelId=settings.bedrock_model_id,
            contentType="application/json",
            accept="application/json",
            body=body,
        )
    except ClientError as e:
        logger.error("Bedrock invocation failed: %s", e.response["Error"]["Message"])
        raise
    except Exception as e:
        logger.error("Unexpected error calling Bedrock: %s", str(e))
        raise

    try:
        response_body = json.loads(response["body"].read())
        assistant_text = response_body["content"][0]["text"]
    except (KeyError, IndexError, json.JSONDecodeError) as e:
        logger.error("Failed to extract text from Bedrock response: %s", str(e))
        raise ValueError(f"Invalid Bedrock response structure: {e}")

    # Parse the JSON response (strip any accidental markdown fencing)
    cleaned = assistant_text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("\n", 1)[1]
        cleaned = cleaned.rsplit("```", 1)[0]

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error("Bedrock returned invalid JSON: %s | Raw: %.200s", str(e), assistant_text)
        raise ValueError(f"Bedrock model returned unparseable JSON: {e}")
