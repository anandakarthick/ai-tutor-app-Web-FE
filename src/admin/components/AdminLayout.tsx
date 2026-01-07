/**
 * Admin Layout Component
 */

import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  School,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Shield,
  Database,
  BarChart3,
  FileText,
  Key,
  Wallet,
  Building,
  Layers,
  UserCog,
  HelpCircle,
  Moon,
  Sun,
} from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import logoImage from '../../assets/images/logo.png';
import './AdminLayout.css';

const menuItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/admin' 
  },
  { 
    id: 'students', 
    label: 'Students', 
    icon: Users, 
    path: '/admin/students',
    badge: 'New'
  },
  { 
    id: 'schools', 
    label: 'Schools', 
    icon: School, 
    path: '/admin/schools' 
  },
  { 
    id: 'classes', 
    label: 'Classes', 
    icon: GraduationCap, 
    path: '/admin/classes' 
  },
  { 
    id: 'subjects', 
    label: 'Subjects', 
    icon: BookOpen, 
    path: '/admin/subjects' 
  },
  { 
    id: 'subject-mapping', 
    label: 'Subject Mapping', 
    icon: Layers, 
    path: '/admin/subject-mapping' 
  },
  { 
    id: 'plans', 
    label: 'Subscription Plans', 
    icon: CreditCard, 
    path: '/admin/plans' 
  },
  { 
    id: 'transactions', 
    label: 'Transactions', 
    icon: Wallet, 
    path: '/admin/transactions' 
  },
  { 
    id: 'analytics', 
    label: 'Analytics', 
    icon: BarChart3, 
    path: '/admin/analytics' 
  },
  { 
    id: 'reports', 
    label: 'Reports', 
    icon: FileText, 
    path: '/admin/reports' 
  },
  { 
    id: 'admins', 
    label: 'Admin Users', 
    icon: UserCog, 
    path: '/admin/admins' 
  },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings, 
    path: '/admin/settings',
    submenu: [
      { id: 'general', label: 'General Settings', path: '/admin/settings' },
      { id: 'payment', label: 'Payment Gateway', path: '/admin/settings/payment' },
      { id: 'api-keys', label: 'API Keys', path: '/admin/settings/api-keys' },
      { id: 'app-config', label: 'App Configuration', path: '/admin/settings/app-config' },
      { id: 'notifications', label: 'Notifications', path: '/admin/settings/notifications' },
    ]
  },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, logout, isAuthenticated } = useAdminStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications] = useState([
    { id: 1, title: 'New student registered', time: '5 min ago' },
    { id: 2, title: 'Payment received', time: '1 hour ago' },
    { id: 3, title: 'Server alert', time: '2 hours ago' },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isActiveRoute = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`admin-layout ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? '' : 'collapsed'} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/admin" className="admin-logo">
            <img src={logoImage} alt="AI Tutor" />
            {sidebarOpen && <span>AI Tutor Admin</span>}
          </Link>
          <button className="sidebar-toggle desktop" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          <button className="sidebar-toggle mobile" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.path);
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isExpanded = expandedMenu === item.id;

            return (
              <div key={item.id} className="nav-item-wrapper">
                {hasSubmenu ? (
                  <>
                    <button
                      className={`nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => toggleSubmenu(item.id)}
                    >
                      <Icon size={20} />
                      {sidebarOpen && (
                        <>
                          <span>{item.label}</span>
                          <ChevronDown 
                            size={16} 
                            className={`submenu-arrow ${isExpanded ? 'expanded' : ''}`} 
                          />
                        </>
                      )}
                    </button>
                    {sidebarOpen && isExpanded && (
                      <div className="submenu">
                        {item.submenu.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.path}
                            className={`submenu-item ${location.pathname === sub.path ? 'active' : ''}`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon size={20} />
                    {sidebarOpen && (
                      <>
                        <span>{item.label}</span>
                        {item.badge && <span className="nav-badge">{item.badge}</span>}
                      </>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link to="/admin/help" className="nav-item">
            <HelpCircle size={20} />
            {sidebarOpen && <span>Help & Support</span>}
          </Link>
          <button className="nav-item logout" onClick={handleLogout}>
            <LogOut size={20} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className={`admin-main ${sidebarOpen ? '' : 'expanded'}`}>
        {/* Top Header */}
        <header className="admin-header">
          <div className="header-left">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="search-box">
              <Search size={18} />
              <input type="text" placeholder="Search..." />
            </div>
          </div>

          <div className="header-right">
            <button 
              className="header-btn theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <div className="notification-wrapper">
              <button 
                className="header-btn notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell size={20} />
                <span className="notification-badge">3</span>
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button>Mark all read</button>
                  </div>
                  <div className="notification-list">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="notification-item">
                        <p>{notif.title}</p>
                        <span>{notif.time}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/admin/notifications" className="dropdown-footer">
                    View all notifications
                  </Link>
                </div>
              )}
            </div>

            <div className="profile-wrapper">
              <button 
                className="profile-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="profile-avatar">
                  <Shield size={18} />
                </div>
                <div className="profile-info">
                  <span className="profile-name">{admin?.name || 'Admin'}</span>
                  <span className="profile-role">{admin?.role || 'Super Admin'}</span>
                </div>
                <ChevronDown size={16} />
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <Link to="/admin/profile" className="dropdown-item">
                    <UserCog size={16} />
                    Profile Settings
                  </Link>
                  <Link to="/admin/settings" className="dropdown-item">
                    <Settings size={16} />
                    System Settings
                  </Link>
                  <hr />
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;
