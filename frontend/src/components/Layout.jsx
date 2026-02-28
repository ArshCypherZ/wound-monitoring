import { NavLink, Outlet } from 'react-router-dom';
import { Home, Camera, Activity, LayoutDashboard } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ style: { fontFamily: 'var(--font-family)', fontSize: '14px' } }} />
      <Outlet />
      <nav className="bottom-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          <Home size={20} /><span>Home</span>
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => isActive ? 'active' : ''}>
          <Camera size={20} /><span>Upload</span>
        </NavLink>
        <NavLink to="/timeline" className={({ isActive }) => isActive ? 'active' : ''}>
          <Activity size={20} /><span>Timeline</span>
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <LayoutDashboard size={20} /><span>Dashboard</span>
        </NavLink>
      </nav>
    </>
  );
}
