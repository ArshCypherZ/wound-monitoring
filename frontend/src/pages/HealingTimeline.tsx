import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AssessmentResult, UrgencyLevel } from "../types";
// import { getAssessments } from '../services/api';

// TODO: Replace with real patient ID from auth/context/localStorage
const DEMO_PATIENT_ID = "your-patient-uuid-here";
void DEMO_PATIENT_ID; // suppress unused warning until wired up

type TrendDirection = "up" | "down" | "flat";

function getTrend(
  current: number,
  previous: number | undefined,
): TrendDirection {
  if (previous === undefined) return "flat";
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "flat";
}

const URGENCY_COLOR: Record<UrgencyLevel, string> = {
  low: "var(--color-success)",
  medium: "var(--color-warning)",
  high: "var(--color-danger)",
};

export default function HealingTimeline() {
  // TODO: replace with getAssessments(DEMO_PATIENT_ID) — already sorted newest-first
  const [assessments] = useState<AssessmentResult[]>([]);

  const firstScore = assessments.at(-1)?.healing_score;
  const latestScore = assessments.at(0)?.healing_score;
  const improvement =
    firstScore !== undefined && latestScore !== undefined
      ? ((latestScore - firstScore) / Math.max(firstScore, 1)) * 100
      : null;

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Healing Timeline</h1>
        <p className="page-subtitle">Your wound recovery progress</p>
      </div>

      {/* Progress summary */}
      {assessments.length > 0 && improvement !== null && (
        <div className="summary-card">
          <div className="summary-item">
            <span className="summary-label">Day 1 Score</span>
            <span className="summary-value">{firstScore?.toFixed(1)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Latest Score</span>
            <span className="summary-value">{latestScore?.toFixed(1)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Change</span>
            <span
              className={`summary-value ${improvement >= 0 ? "positive" : "negative"}`}
            >
              {improvement >= 0 ? "+" : ""}
              {improvement.toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      {/* Vertical timeline */}
      {assessments.length === 0 ? (
        <div className="empty-state">
          <p>No assessments yet. Upload a wound photo to start tracking.</p>
        </div>
      ) : (
        <div className="timeline">
          {assessments.map((a, i) => {
            const prev = assessments[i + 1];
            const trend = getTrend(a.healing_score, prev?.healing_score);
            return (
              <div key={a.assessment_id} className="timeline-entry">
                <div
                  className="timeline-dot"
                  style={{ backgroundColor: URGENCY_COLOR[a.urgency_level] }}
                />
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-date">
                      Day {a.days_post_op ?? "?"} &middot;{" "}
                      {new Date(a.created_at).toLocaleDateString()}
                    </span>
                    <div className="timeline-score">
                      {trend === "up" && (
                        <TrendingUp size={14} className="trend-up" />
                      )}
                      {trend === "down" && (
                        <TrendingDown size={14} className="trend-down" />
                      )}
                      {trend === "flat" && (
                        <Minus size={14} className="trend-flat" />
                      )}
                      <strong>{a.healing_score.toFixed(1)}</strong>/10
                    </div>
                  </div>
                  <p className="timeline-summary">{a.summary}</p>
                  {a.tissue_types.length > 0 && (
                    <div className="tissue-chips">
                      {a.tissue_types.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  {a.image_url && (
                    <img
                      src={a.image_url}
                      alt="Wound photo"
                      className="timeline-thumb"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
