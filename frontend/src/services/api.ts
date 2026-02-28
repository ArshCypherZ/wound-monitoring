import axios from "axios";
import type {
  Patient,
  PatientCreate,
  PatientUpdate,
  AssessmentResult,
  VoiceCallResponse,
} from "../types";

const api = axios.create({
  baseURL: "/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ── Patients ──────────────────────────────────────────────────────────────────

export const createPatient = (data: PatientCreate) =>
  api.post<Patient>("/patients", data);

export const getPatients = () => api.get<Patient[]>("/patients");

export const getPatient = (id: string) => api.get<Patient>(`/patients/${id}`);

export const updatePatient = (id: string, data: PatientUpdate) =>
  api.put<Patient>(`/patients/${id}`, data);

export const deletePatient = (id: string) =>
  api.delete<void>(`/patients/${id}`);

// ── Assessments ───────────────────────────────────────────────────────────────

export const uploadWoundPhoto = (patientId: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("patient_id", patientId);
  return api.post<AssessmentResult>("/assessments/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAssessments = (patientId: string) =>
  api.get<AssessmentResult[]>(`/assessments/${patientId}`);

export const getAssessment = (assessmentId: string) =>
  api.get<AssessmentResult>(`/assessments/detail/${assessmentId}`);

export const deleteAssessment = (assessmentId: string) =>
  api.delete<void>(`/assessments/detail/${assessmentId}`);

// ── Voice ─────────────────────────────────────────────────────────────────────

export const triggerVoiceCall = (patientId: string) =>
  api.post<VoiceCallResponse>("/voice/call", { patient_id: patientId });

// ── Misc ──────────────────────────────────────────────────────────────────────

export const healthCheck = () =>
  api.get<{ status: string; service: string }>("/health");

export default api;
