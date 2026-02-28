import logging
from fastapi import APIRouter, HTTPException
from botocore.exceptions import ClientError
from app.models.schemas import VoiceCallRequest, VoiceCallResponse
from app.services.dynamodb import get_patient, get_assessments_by_patient

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/call", response_model=VoiceCallResponse)
async def trigger_voice_call(data: VoiceCallRequest):
    """
    Trigger a voice call to the patient via ElevenLabs.
    Fetches the latest assessment and builds a conversational script.
    """
    try:
        patient = get_patient(data.patient_id)
    except ClientError:
        raise HTTPException(status_code=502, detail="Database error while fetching patient")
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Get latest assessment for context
    try:
        assessments = get_assessments_by_patient(data.patient_id)
    except ClientError:
        raise HTTPException(status_code=502, detail="Database error while fetching assessments")

    latest = assessments[0] if assessments else None

    # Build voice script from latest assessment
    if latest:
        script = (
            f"Hi {patient.get('name', 'there')}. "
            f"I've reviewed your wound photo from today. "
            f"Your healing score is {latest.get('healing_score', 'N/A')} out of 10. "
            f"{latest.get('summary', '')} "
        )
        if latest.get("urgency_level") == "high":
            script += "I'd recommend connecting you with your doctor. Let me transfer you now."
        else:
            script += "Keep following your care instructions, and I'll check in again tomorrow."
    else:
        script = (
            f"Hi {patient.get('name', 'there')}. "
            f"I don't have a recent wound assessment on file. "
            f"Please upload a photo through the app so I can review your progress."
        )

    # TODO: integrate ElevenLabs Conversational AI API here
    return VoiceCallResponse(
        conversation_id="pending_elevenlabs_integration",
        patient_id=data.patient_id,
        status="script_ready",
        message=script,
    )
