from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "ap-south-1"

    s3_bucket_name: str = "photos"

    dynamodb_patients_table: str = "patients"
    dynamodb_assessments_table: str = "assessments"

    bedrock_model_id: str = "anthropic.claude-sonnet-4-5-20250929-v1:0"

    connect_instance_id: str = ""
    connect_contact_flow_id: str = ""
    connect_source_phone: str = ""

    polly_voice_id: str = "Kajal"
    polly_engine: str = "neural"
    polly_language_code: str = "hi-IN"

    lex_bot_id: str = ""
    lex_bot_alias_id: str = ""
    lex_locale_id: str = "hi_IN"

    yolo_model_path: str = "yolov8n.pt"

    debug: bool = True
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
