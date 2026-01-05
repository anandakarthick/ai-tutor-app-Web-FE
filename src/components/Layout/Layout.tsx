/**
 * Main Layout with Sidebar
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  BookOpen,
  FileText,
  HelpCircle,
  TrendingUp,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Flame,
  Star,
  GraduationCap,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import logoImage from '../../assets/images/logo.png';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/learn', label: 'Learn', icon: BookOpen },
  { path: '/quizzes', label: 'Quizzes', icon: FileText },
  { path: '/doubts', label: 'Ask Doubt', icon: HelpCircle },
  { path: '/progress', label: 'Progress', icon: TrendingUp },
  { path: '/study-plan', label: 'Study Plan', icon: Calendar },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, student, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
        <Link to="/dashboard" className="mobile-logo">
          <img src={logoImage} alt="AI Tutor" />
          <span>AI Tutor</span>
        </Link>
        <Link to="/profile" className="mobile-avatar">
          {student?.studentName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
        </Link>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <img src={logoImage} alt="AI Tutor" />
            <span>AI Tutor</span>
          </Link>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* User Card */}
        <div className="user-card">
          <div className="user-avatar">
            {student?.studentName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="user-info">
            <h3>{student?.studentName || user?.fullName || 'Student'}</h3>
            <p>{student?.class?.displayName || 'Class'} • {student?.board?.name || 'Board'}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="sidebar-stats">
          <div className="stat-item">
            <Flame size={16} className="stat-icon fire" />
            <span>{student?.streakDays || 0}</span>
          </div>
          <div className="stat-item">
            <Star size={16} className="stat-icon star" />
            <span>{student?.xp?.toLocaleString() || 0}</span>
          </div>
          <div className="stat-item">
            <GraduationCap size={16} className="stat-icon level" />
            <span>Lv {student?.level || 1}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
                {isActive && <ChevronRight size={16} className="nav-arrow" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
