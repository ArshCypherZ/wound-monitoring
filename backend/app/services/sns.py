import logging
import json
import boto3
from botocore.exceptions import ClientError
from app.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

_sns_client = None


def _get_client():
    global _sns_client
    if _sns_client is None:
        _sns_client = boto3.client(
            "sns",
            region_name=settings.aws_region,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
        )
    return _sns_client


def publish_urgency_alert(patient: dict, assessment: dict) -> None:
    """
    Publish an SNS notification when a wound assessment has high urgency.
    The message is structured so clinicians get actionable context immediately.
    """
    topic_arn = settings.sns_alert_topic_arn
    if not topic_arn:
        logger.warning("SNS_ALERT_TOPIC_ARN not configured — skipping clinician alert")
        return

    subject = f"⚠️ High Urgency — {patient.get('name', 'Unknown')} (Post-Op Day {assessment.get('days_post_op', '?')})"

    message = {
        "patient_id": assessment.get("patient_id"),
        "patient_name": patient.get("name"),
        "phone": patient.get("phone"),
        "surgery_type": patient.get("surgery_type"),
        "wound_location": patient.get("wound_location"),
        "days_post_op": assessment.get("days_post_op"),
        "healing_score": assessment.get("healing_score"),
        "urgency_level": assessment.get("urgency_level"),
        "anomalies": assessment.get("anomalies", []),
        "summary": assessment.get("summary"),
        "assessment_id": assessment.get("assessment_id"),
    }

    try:
        _get_client().publish(
            TopicArn=topic_arn,
            Subject=subject[:100],  # SNS subject max 100 chars
            Message=json.dumps(message, indent=2, default=str),
        )
        logger.info(
            "Clinician alert published for patient %s (assessment %s)",
            assessment.get("patient_id"),
            assessment.get("assessment_id"),
        )
    except ClientError as e:
        # Alert failure should not block the assessment pipeline — log and continue
        logger.error(
            "Failed to publish SNS alert for patient %s: %s",
            assessment.get("patient_id"),
            e.response["Error"]["Message"],
        )
