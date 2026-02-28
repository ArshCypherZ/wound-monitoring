import boto3
from app.config import get_settings

settings = get_settings()
connect_client = boto3.client("connect", region_name=settings.aws_region, aws_access_key_id=settings.aws_access_key_id, aws_secret_access_key=settings.aws_secret_access_key)


def start_outbound_call(patient_phone: str, patient_name: str, assessment_summary: str) -> dict:
    """Returns: { contact_id, status }"""
    # TODO: call start_outbound_voice_contact with InstanceId, ContactFlowId, DestinationPhoneNumber
    # TODO: pass patient_name and assessment_summary as Attributes for Connect contact flow
    pass
