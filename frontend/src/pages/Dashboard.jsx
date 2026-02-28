import { useState } from 'react';
import { Search, AlertTriangle, Phone, ChevronRight, Users } from 'lucide-react';
// import { getPatients } from '../services/api';

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  // TODO: replace with getPatients() API call
  const [patients] = useState([]);

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1 className="page-title">Hospital Dashboard</h1>
        <p className="page-subtitle">Post-surgical wound monitoring</p>
      </div>
      {/* TODO: summary cards — total, urgent, monitor counts */}
      {/* TODO: search input — filter by name or surgery type */}
      {/* TODO: patient list sorted by urgency — status dot, info, score, call button for urgent */}
      {/* TODO: empty state if no patients */}
    </div>
  );
}
