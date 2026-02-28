import boto3
from io import BytesIO
from app.config import get_settings

settings = get_settings()
s3_client = boto3.client("s3", region_name=settings.aws_region, aws_access_key_id=settings.aws_access_key_id, aws_secret_access_key=settings.aws_secret_access_key)


def upload_image(file_bytes: bytes, patient_id: str, filename: str) -> str:
    # TODO: upload to s3://{bucket}/wounds/{patient_id}/{filename}, return key
    pass


def get_presigned_url(key: str, expires_in: int = 3600) -> str:
    # TODO: generate and return presigned GET URL
    pass


def download_image(key: str) -> bytes:
    # TODO: download and return image bytes from S3
    pass
