import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
// import { getAssessments } from '../services/api';

export default function HealingTimeline() {
  // TODO: replace with getAssessments(patientId) API call
  const [assessments] = useState([]);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Healing Timeline</h1>
        <p className="page-subtitle">Your wound recovery progress</p>
      </div>
      {/* TODO: progress summary — current score vs day 1 vs total improvement */}
      {/* TODO: vertical timeline — date, score, trend, notes, tissue tags per assessment */}
      {/* TODO: empty state if no assessments */}
    </div>
  );
}
