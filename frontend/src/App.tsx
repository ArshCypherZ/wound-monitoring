// App.tsx — Root component with React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PatientHome from "./pages/PatientHome";
import PhotoUpload from "./pages/PhotoUpload";
import HealingTimeline from "./pages/HealingTimeline";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
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
