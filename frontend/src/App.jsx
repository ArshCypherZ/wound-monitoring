// App.jsx — Root component with React Router
// Routes: / (patient home), /upload, /timeline, /dashboard

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import PatientHome from './pages/PatientHome';
import PhotoUpload from './pages/PhotoUpload';
import HealingTimeline from './pages/HealingTimeline';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout wraps all routes with bottom nav bar */}
        <Route element={<Layout />}>
          <Route path="/" element={<PatientHome />} />
          <Route path="/upload" element={<PhotoUpload />} />
          <Route path="/timeline" element={<HealingTimeline />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
