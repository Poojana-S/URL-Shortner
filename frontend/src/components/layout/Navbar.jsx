import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link2, LayoutDashboard, BarChart2, Plus, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
      isActive
        ? "bg-brand-600/20 text-brand-400"
        : "text-white/60 hover:text-white hover:bg-white/5"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-surface/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-lg shadow-brand-900/40 group-hover:bg-brand-500 transition-colors">
              <Link2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gradient">Shrink</span>
          </Link>

          {isAuthenticated ? (
            <>
              {/* Desktop nav */}
              <div className="hidden md:flex items-center gap-1">
                <NavLink to="/dashboard" className={navLinkClass}>
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </NavLink>
                <NavLink to="/analytics" className={navLinkClass}>
                  <BarChart2 className="w-4 h-4" />
                  Analytics
                </NavLink>
              </div>

              {/* Desktop right side */}
              <div className="hidden md:flex items-center gap-3">
                <NavLink to="/create" className="btn-primary text-xs px-4 py-2">
                  <Plus className="w-3.5 h-3.5" />
                  New URL
                </NavLink>
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <div className="w-8 h-8 rounded-full bg-brand-600/30 border border-brand-500/40 flex items-center justify-center text-sm font-semibold text-brand-300">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-white/70 max-w-[120px] truncate">{user?.name}</span>
                  <button onClick={handleLogout} className="btn-ghost text-red-400/70 hover:text-red-400 ml-1">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden btn-ghost"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="btn-secondary text-sm py-2">Sign in</Link>
              <Link to="/register" className="btn-primary text-sm py-2">Get started</Link>
            </div>
          )}
        </div>

        {/* Mobile menu */}
        {mobileOpen && isAuthenticated && (
          <div className="md:hidden border-t border-white/10 py-3 space-y-1 animate-fade-in">
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </NavLink>
            <NavLink to="/analytics" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <BarChart2 className="w-4 h-4" /> Analytics
            </NavLink>
            <NavLink to="/create" className={navLinkClass} onClick={() => setMobileOpen(false)}>
              <Plus className="w-4 h-4" /> New URL
            </NavLink>
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-white/5 transition-colors">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
