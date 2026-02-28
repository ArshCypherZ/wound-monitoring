import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Phone, TrendingUp, AlertCircle } from 'lucide-react';
// import { getPatient } from '../services/api';

export default function PatientHome() {
  // TODO: replace with getPatient(patientId) API call
  const [patient] = useState({ name: 'Patient Name', surgery: 'Surgery Type', daysPostOp: 0, latestScore: 0, urgency: 'low' });

  return (
    <div className="page fade-in">
      <div className="page-header">
        <p className="page-subtitle">Good morning 👋</p>
        <h1 className="page-title">{patient.name}</h1>
      </div>
      {/* TODO: surgery info card with urgency badge */}
      {/* TODO: healing score card with trend indicator */}
      {/* TODO: quick action grid — upload photo + request call */}
      {/* TODO: alerts section from latest assessment anomalies */}
    </div>
  );
}
