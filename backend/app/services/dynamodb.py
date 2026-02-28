import boto3
from app.config import get_settings

settings = get_settings()
dynamodb = boto3.resource("dynamodb", region_name=settings.aws_region, aws_access_key_id=settings.aws_access_key_id, aws_secret_access_key=settings.aws_secret_access_key)
patients_table = dynamodb.Table(settings.dynamodb_patients_table)
assessments_table = dynamodb.Table(settings.dynamodb_assessments_table)


def put_patient(patient: dict) -> dict:
    # TODO: put_item into patients_table, return patient
    pass


def get_patient(patient_id: str) -> dict | None:
    # TODO: get_item by patient_id, return Item or None
    pass


def get_all_patients() -> list[dict]:
    # TODO: scan patients_table, return Items
    pass


def update_patient(patient_id: str, updates: dict) -> dict:
    # TODO: build UpdateExpression from updates, call update_item
    pass


def put_assessment(assessment: dict) -> dict:
    # TODO: put_item into assessments_table, return assessment
    pass


def get_assessments_by_patient(patient_id: str) -> list[dict]:
    # TODO: query/scan by patient_id, sort by created_at desc
    pass


def get_assessment(assessment_id: str) -> dict | None:
    # TODO: get_item by assessment_id, return Item or None
    pass
