import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Phone, TrendingUp, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import type { Patient, AssessmentResult } from "../types";
// import { getPatient, getAssessments, triggerVoiceCall } from '../services/api';

// TODO: Replace with real patient ID from auth/context/localStorage
const DEMO_PATIENT_ID = "your-patient-uuid-here";
void DEMO_PATIENT_ID; // suppress unused warning until API calls are wired in

export default function PatientHome() {
  // TODO: replace with getPatient(DEMO_PATIENT_ID) API call
  const [patient] = useState<Patient | null>(null);
  // TODO: replace with getAssessments(DEMO_PATIENT_ID) — take index[0] as latest
  const [latest] = useState<AssessmentResult | null>(null);
  const [calling, setCalling] = useState(false);

  const handleRequestCall = async () => {
    setCalling(true);
    try {
      // const { data } = await triggerVoiceCall(DEMO_PATIENT_ID);
      // toast.success(data.status === 'initiated' ? 'Call placed! You will receive a call shortly.' : 'Simulated call (dev mode)');
      toast.success("Call feature coming soon");
    } catch {
      toast.error("Failed to place call");
    } finally {
      setCalling(false);
    }
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <p className="page-subtitle">Good morning 👋</p>
        <h1 className="page-title">{patient?.name ?? "Patient Name"}</h1>
      </div>
      {/* TODO: surgery info card — patient.surgery_type, patient.surgery_date, latest?.days_post_op */}
      {/* TODO: urgency badge — latest?.urgency_level (low=green, medium=yellow, high=red) */}
      {/* TODO: healing score card — latest?.healing_score out of 10 with trend indicator */}
      <div className="quick-actions">
        <Link to="/upload" className="btn btn-primary">
          <Camera size={18} /> Upload Photo
        </Link>
        <button
          className="btn btn-secondary"
          onClick={handleRequestCall}
          disabled={calling}
        >
          <Phone size={18} /> {calling ? "Calling…" : "Request Call"}
        </button>
      </div>
      {/* TODO: alerts section — map latest?.anomalies if non-empty */}
      {latest?.urgency_level === "high" && (
        <div className="alert alert-high">
          <AlertCircle size={16} />
          <span>High urgency — please contact your doctor.</span>
        </div>
      )}
      {/* TODO: quick stats — latest?.tissue_types as chips */}
      <Link to="/timeline" className="timeline-link">
        <TrendingUp size={16} /> View Healing Timeline
      </Link>
    </div>
  );
}
