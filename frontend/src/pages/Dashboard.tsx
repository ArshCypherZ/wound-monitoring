import { useState } from "react";
import { Search, AlertTriangle, Phone, Users } from "lucide-react";
import toast from "react-hot-toast";
import type { Patient, UrgencyLevel } from "../types";
// import { getPatients, getAssessments, triggerVoiceCall } from '../services/api';

type EnrichedPatient = Patient & {
  latest_score: number | null;
  urgency: UrgencyLevel | "unknown";
  anomalies: string[];
  days_post_op: number | null;
};

// Used in the commented-out useEffect enrichment sort below
const URGENCY_ORDER: Record<EnrichedPatient["urgency"], number> = {
  high: 0,
  medium: 1,
  low: 2,
  unknown: 3,
};
void URGENCY_ORDER;

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [callingId, setCallingId] = useState<string | null>(null);

  // TODO: replace with API calls
  // useEffect(() => {
  //   getPatients().then(({ data: patients }) => {
  //     Promise.all(
  //       patients.map(async (p) => {
  //         try {
  //           const { data: assessments } = await getAssessments(p.patient_id);
  //           const latest: AssessmentResult | undefined = assessments[0];
  //           return {
  //             ...p,
  //             latest_score: latest?.healing_score ?? null,
  //             urgency: (latest?.urgency_level ?? 'unknown') as EnrichedPatient['urgency'],
  //             anomalies: latest?.anomalies ?? [],
  //             days_post_op: latest?.days_post_op ?? null,
  //           };
  //         } catch {
  //           return { ...p, latest_score: null, urgency: 'unknown' as const, anomalies: [], days_post_op: null };
  //         }
  //       })
  //     ).then((enriched) =>
  //       setPatients(enriched.sort((a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency]))
  //     );
  //   });
  // }, []);
  const [patients] = useState<EnrichedPatient[]>([]);

  const handleCall = async (patientId: string) => {
    setCallingId(patientId);
    try {
      // const { data } = await triggerVoiceCall(patientId);
      // toast.success(data.status === 'initiated' ? 'Call placed!' : 'Simulated (dev mode)');
      toast("Voice call — connect triggerVoiceCall() to activate", {
        icon: "⚙️",
      });
    } catch {
      toast.error("Failed to place call");
    } finally {
      setCallingId(null);
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.surgery_type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const urgentCount = patients.filter((p) => p.urgency === "high").length;
  const monitorCount = patients.filter((p) => p.urgency === "medium").length;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Hospital Dashboard</h1>
        <p className="page-subtitle">Post-surgical wound monitoring</p>
      </div>

      {/* Summary cards */}
      <div className="summary-row">
        <div className="stat-card">
          <Users size={20} />
          <span className="stat-value">{patients.length}</span>
          <span className="stat-label">Total</span>
        </div>
        <div className="stat-card stat-danger">
          <AlertTriangle size={20} />
          <span className="stat-value">{urgentCount}</span>
          <span className="stat-label">Urgent</span>
        </div>
        <div className="stat-card stat-warning">
          <span className="stat-value">{monitorCount}</span>
          <span className="stat-label">Monitor</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search name or surgery type…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Patient list */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <p>
            {patients.length === 0
              ? "No patients yet."
              : "No results for that search."}
          </p>
        </div>
      ) : (
        <div className="patient-list">
          {filtered.map((p) => (
            <div key={p.patient_id} className="patient-row">
              <span
                className="urgency-dot"
                style={{
                  backgroundColor:
                    p.urgency === "high"
                      ? "var(--color-danger)"
                      : p.urgency === "medium"
                        ? "var(--color-warning)"
                        : "var(--color-success)",
                }}
              />
              <div className="patient-info">
                <strong>{p.name}</strong>
                <span>
                  {p.surgery_type} · Day {p.days_post_op ?? "?"}
                </span>
              </div>
              {p.latest_score !== null && (
                <span className="patient-score">
                  {p.latest_score.toFixed(1)}/10
                </span>
              )}
              {p.urgency === "high" && (
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleCall(p.patient_id)}
                  disabled={callingId === p.patient_id}
                >
                  <Phone size={14} />
                  {callingId === p.patient_id ? "…" : "Call"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
