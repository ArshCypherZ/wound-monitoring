import { NavLink, Outlet } from "react-router-dom";
import { Home, Camera, Activity, LayoutDashboard } from "lucide-react";
import { Toaster } from "react-hot-toast";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "active" : "";

export default function Layout() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: "var(--font-family)", fontSize: "14px" },
        }}
      />
      <Outlet />
      <nav className="bottom-nav">
        <NavLink to="/" end className={navLinkClass}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/upload" className={navLinkClass}>
          <Camera size={20} />
          <span>Upload</span>
        </NavLink>
        <NavLink to="/timeline" className={navLinkClass}>
          <Activity size={20} />
          <span>Timeline</span>
        </NavLink>
        <NavLink to="/dashboard" className={navLinkClass}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
      </nav>
    </>
  );
}
