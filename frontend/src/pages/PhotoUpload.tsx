import { useState, useRef } from "react";
import {
  Upload,
  Camera,
  Loader,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import type { AssessmentResult } from "../types";
// import { uploadWoundPhoto } from '../services/api';

// TODO: Replace with real patient ID from auth/context/localStorage
const DEMO_PATIENT_ID = "your-patient-uuid-here";
void DEMO_PATIENT_ID; // suppress unused warning until API calls are wired in

export default function PhotoUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke previous blob URL to avoid memory leaks
    if (preview) URL.revokeObjectURL(preview);
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      // const { data } = await uploadWoundPhoto(DEMO_PATIENT_ID, selectedFile);
      // setResult(data);
      // toast.success(`Healing score: ${data.healing_score}/10`);
      toast("Upload wired — connect uploadWoundPhoto() to activate", {
        icon: "⚙️",
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { detail?: string } } })?.response?.data
          ?.detail ?? "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Upload Wound Photo</h1>
        <p className="page-subtitle">
          Take a clear photo of your surgical wound
        </p>
      </div>

      {/* Photo tips */}
      <div className="tips-card">
        <p>📸 Good lighting · wound centered · 20–30 cm distance</p>
      </div>

      {/* Upload area */}
      <div
        className="upload-area"
        onClick={() => fileInputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Wound preview" className="upload-preview" />
        ) : (
          <>
            <Camera size={40} />
            <p>Tap to select or capture photo</p>
          </>
        )}
        {/* capture="environment" opens rear camera on mobile */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {selectedFile && !uploading && (
        <button className="btn btn-primary" onClick={handleUpload}>
          <Upload size={18} /> Analyze Wound
        </button>
      )}

      {uploading && (
        <div className="loading-state">
          <Loader size={24} className="spin" />
          <p>Analyzing wound… this may take a few seconds</p>
        </div>
      )}

      {/* Assessment result card */}
      {result && (
        <div className="result-card fade-in">
          <div className="result-header">
            <CheckCircle2 size={20} className="success-icon" />
            <h2>Assessment Complete</h2>
          </div>

          {/* Healing score */}
          <div className="score-row">
            <span className="score-label">Healing Score</span>
            <span className="score-value">
              {result.healing_score.toFixed(1)} / 10
            </span>
          </div>

          {/* Urgency badge */}
          <div className={`urgency-badge urgency-${result.urgency_level}`}>
            {result.urgency_level.toUpperCase()}
          </div>

          {/* Infection alert */}
          {result.infection_status !== "none" && (
            <div className="alert alert-high">
              <AlertTriangle size={16} />
              <span>Infection status: {result.infection_status}</span>
            </div>
          )}

          {/* Summary */}
          <p className="result-summary">{result.summary}</p>

          {/* Tissue types */}
          {result.tissue_types.length > 0 && (
            <div className="tissue-chips">
              {result.tissue_types.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          )}

          {/* Anomalies */}
          {result.anomalies.length > 0 && (
            <div className="anomalies">
              <h3>Anomalies Detected</h3>
              <ul>
                {result.anomalies.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="recommendations">
              <h3>Care Instructions</h3>
              <ul>
                {result.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}

          {/* PWAT breakdown */}
          {result.pwat_scores && (
            <details className="pwat-details">
              <summary>
                PWAT Score Breakdown ({result.pwat_scores.total_score ?? "?"}
                /32)
              </summary>
              <div className="pwat-grid">
                {Object.entries(result.pwat_scores)
                  .filter(([k]) => k !== "total_score")
                  .map(([k, v]) => (
                    <div key={k} className="pwat-item">
                      <span className="pwat-label">{k.replace(/_/g, " ")}</span>
                      <span className="pwat-score">{v}</span>
                    </div>
                  ))}
              </div>
            </details>
          )}
        </div>
      )}
    </div>
  );
}
