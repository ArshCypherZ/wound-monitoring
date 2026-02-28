from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from app.models.schemas import PatientCreate, Patient, PatientUpdate
from app.services.dynamodb import put_patient, get_patient, get_all_patients, update_patient

router = APIRouter()


@router.post("", response_model=Patient)
async def create_patient(data: PatientCreate):
    # TODO: build patient dict with uuid + data fields + created_at, put_patient(), return it
    pass


@router.get("")
async def list_patients():
    # TODO: return get_all_patients()
    pass


@router.get("/{patient_id}", response_model=Patient)
async def get_patient_by_id(patient_id: str):
    # TODO: get_patient(), raise 404 if None
    pass


@router.put("/{patient_id}", response_model=Patient)
async def update_patient_by_id(patient_id: str, data: PatientUpdate):
    # TODO: verify exists, update_patient() with non-None fields
    pass
