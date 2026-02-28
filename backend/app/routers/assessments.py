from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from datetime import datetime
import uuid
from app.models.schemas import AssessmentResult, YoloResult, PWATScores
from app.services.s3 import upload_image, get_presigned_url
from app.services.yolo import detect_wound
from app.services.bedrock import assess_wound
from app.services.dynamodb import put_assessment, get_assessments_by_patient, get_assessment, get_patient

router = APIRouter()


@router.post("/upload", response_model=AssessmentResult)
async def upload_and_assess(
    file: UploadFile = File(...),
    patient_id: str = Form(...),
):
    # TODO: validate patient, read file, upload to S3
    # TODO: run YOLO detection, send cropped image + patient context to Bedrock
    # TODO: store in DynamoDB, return AssessmentResult
    pass


@router.get("/{patient_id}")
async def get_patient_assessments(patient_id: str):
    # TODO: return get_assessments_by_patient(patient_id)
    pass


@router.get("/detail/{assessment_id}", response_model=AssessmentResult)
async def get_assessment_detail(assessment_id: str):
    # TODO: get_assessment(), raise 404 if None
    pass
