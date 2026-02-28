// Shared API types — mirrors the Pydantic schemas in backend/app/models/schemas.py

// ── Patients ─────────────────────────────────────────────────────────────────

export interface PatientCreate {
  name: string;
  age: number;
  phone: string;
  surgery_type: string;
  surgery_date: string; // ISO date: YYYY-MM-DD
  gender?: string;
  wound_location?: string;
  risk_factors?: string[];
  language_preference?: string; // e.g. "hi-IN", "ta-IN", "en-IN"
}

export interface Patient extends PatientCreate {
  patient_id: string;
  created_at: string;
}

export type PatientUpdate = Partial<Omit<Patient, "patient_id" | "created_at">>;

// ── Assessments ──────────────────────────────────────────────────────────────

export interface BoundingBox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  label: string;
}

/** Pressure Wound Assessment Tool scores. Each sub-score 0-4, except periulcer_skin_viability (0-2). Total max 32. Lower is better. */
export interface PWATScores {
  size: number;
  depth: number;
  necrotic_tissue_type: number;
  necrotic_tissue_amount: number;
  granulation_tissue_type: number;
  granulation_tissue_amount: number;
  edges: number;
  periulcer_skin_viability: number;
  total_score: number | null;
}

export type InfectionStatus = "none" | "infection" | "ischemia" | "both";
export type UrgencyLevel = "low" | "medium" | "high";
export type TissueType =
  | "granulation"
  | "epithelialization"
  | "slough"
  | "necrosis"
  | "fibrin";

export interface AssessmentResult {
  assessment_id: string;
  patient_id: string;
  image_url: string; // S3 presigned URL — expires in 1 hour

  yolo_detections: BoundingBox[] | null;

  healing_score: number; // 0-10, higher = better
  pwat_scores: PWATScores | null;
  infection_status: InfectionStatus | null;
  tissue_types: TissueType[];
  anomalies: string[];
  urgency_level: UrgencyLevel;
  summary: string;
  recommendations: string[];
  voice_agent_script: string | null; // Bedrock-generated script for voice agent

  days_post_op: number | null;
  created_at: string; // ISO datetime
}

// ── Voice ─────────────────────────────────────────────────────────────────────

export interface VoiceCallRequest {
  patient_id: string;
}

export interface VoiceCallResponse {
  conversation_id: string;
  patient_id: string;
  status: "initiated" | "simulated"; // "simulated" in dev when ElevenLabs not configured
  message: string; // The voice script that will be read to the patient
}

// ── API error shape ───────────────────────────────────────────────────────────

export interface ApiError {
  detail: string;
}
