/**
 * Admin Layout Component
 */

import { useState, useEffect, useCallback } from 'react';
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
  BarChart3,
  FileText,
  Wallet,
  Layers,
  UserCog,
  Moon,
  Sun,
  Loader2,
  CheckCheck,
  ClipboardList,
} from 'lucide-react';
import { useAdminStore } from '../store/adminStore';
import { isAdminAuthenticated, clearAdminAuth, getRecentActivity } from '../../services/api/admin';
import logoImage from '../../assets/images/logo.png';
import './AdminLayout.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

// LocalStorage key for read notifications
const READ_NOTIFICATIONS_KEY = 'admin_read_notifications';
const LAST_NOTIFICATION_CHECK_KEY = 'admin_last_notification_check';

// Helper functions for localStorage
const getReadNotificationIds = (): string[] => {
  try {
    const stored = localStorage.getItem(READ_NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveReadNotificationIds = (ids: string[]) => {
  localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(ids));
};

const getLastNotificationCheck = (): string | null => {
  return localStorage.getItem(LAST_NOTIFICATION_CHECK_KEY);
};

const saveLastNotificationCheck = (timestamp: string) => {
  localStorage.setItem(LAST_NOTIFICATION_CHECK_KEY, timestamp);
};

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
  },
  { 
    id: 'schools', 
    label: 'Schools', 
    icon: School, 
    path: '/admin/schools' 
  },
  { 
    id: 'boards', 
    label: 'Boards', 
    icon: ClipboardList, 
    path: '/admin/boards' 
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
  const { admin, logout, isAuthenticated, checkAuth, _hasHydrated } = useAdminStore();
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Generate unique notification ID based on activity data
  const generateNotificationId = useCallback((activity: any, index: number): string => {
    // Create a unique ID based on activity content and time
    const timeStr = new Date(activity.time).getTime().toString();
    const typeStr = activity.type || 'activity';
    return `${typeStr}-${timeStr}-${index}`;
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getRecentActivity(10);
        if (response.success && response.data) {
          const readIds = getReadNotificationIds();
          const lastCheck = getLastNotificationCheck();
          
          // Convert activities to notifications
          const notifs: Notification[] = response.data.map((activity: any, index: number) => {
            const notifId = generateNotificationId(activity, index);
            const activityTime = new Date(activity.time);
            
            // Mark as read if:
            // 1. It's in the read IDs list, OR
            // 2. It's older than the last check time (existing notifications before user started using the system)
            const isRead = readIds.includes(notifId) || 
                          (lastCheck && activityTime < new Date(lastCheck));
            
            return {
              id: notifId,
              title: activity.type === 'payment' ? 'Payment Received' : 
                     activity.type === 'payment_failed' ? 'Payment Failed' :
                     activity.type === 'registration' ? 'New Registration' : 'Activity',
              message: activity.message,
              time: activityTime,
              read: isRead,
              type: activity.type === 'payment' ? 'success' : 
                    activity.type === 'payment_failed' ? 'error' : 'info',
            };
          });
          
          setNotifications(notifs);
          
          // Set last check time if not set (first time user)
          if (!lastCheck) {
            saveLastNotificationCheck(new Date().toISOString());
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotifications([]);
      }
    };

    if (isAuthenticated || isAdminAuthenticated()) {
      fetchNotifications();
      
      // Refresh notifications every 2 minutes
      const interval = setInterval(fetchNotifications, 120000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, generateNotificationId]);

  // Check authentication on mount and when hydration completes
  useEffect(() => {
    const verifyAuth = () => {
      const hasToken = isAdminAuthenticated();
      
      if (hasToken) {
        checkAuth();
        setIsCheckingAuth(false);
      } else if (_hasHydrated) {
        if (!isAuthenticated) {
          navigate('/admin/login');
        }
        setIsCheckingAuth(false);
      }
    };

    const timer = setTimeout(verifyAuth, 100);
    return () => clearTimeout(timer);
  }, [_hasHydrated, isAuthenticated, checkAuth, navigate]);

  // Redirect if not authenticated after hydration
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated && !isAdminAuthenticated()) {
      navigate('/admin/login');
    }
  }, [isCheckingAuth, isAuthenticated, navigate]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-wrapper')) {
        setShowNotifications(false);
      }
      if (!target.closest('.profile-wrapper')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    // Clear notification data on logout
    localStorage.removeItem(READ_NOTIFICATIONS_KEY);
    localStorage.removeItem(LAST_NOTIFICATION_CHECK_KEY);
    logout();
    clearAdminAuth();
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    // Get all notification IDs and save to localStorage
    const allIds = notifications.map(n => n.id);
    const existingIds = getReadNotificationIds();
    const newIds = [...new Set([...existingIds, ...allIds])];
    saveReadNotificationIds(newIds);
    
    // Update last check time
    saveLastNotificationCheck(new Date().toISOString());
    
    // Update state
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    // Save to localStorage
    const existingIds = getReadNotificationIds();
    if (!existingIds.includes(id)) {
      saveReadNotificationIds([...existingIds, id]);
    }
    
    // Update state
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="admin-loading">
        <Loader2 size={40} className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated && !isAdminAuthenticated()) {
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
                      </>
                    )}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead}>
                        <CheckCheck size={14} />
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="notification-list">
                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        <Bell size={32} />
                        <p>No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                          onClick={() => markAsRead(notif.id)}
                        >
                          <div className="notification-content">
                            <p className="notification-title">{notif.title}</p>
                            <p className="notification-message">{notif.message}</p>
                            <span className="notification-time">{formatTimeAgo(notif.time)}</span>
                          </div>
                          {!notif.read && <span className="unread-dot" />}
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <button 
                      className="dropdown-footer"
                      onClick={() => {
                        setShowNotifications(false);
                        navigate('/admin');
                      }}
                    >
                      View Dashboard
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="profile-wrapper">
              <button 
                className="profile-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
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
                  <Link to="/admin/profile" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
                    <UserCog size={16} />
                    Profile Settings
                  </Link>
                  <Link to="/admin/settings" className="dropdown-item" onClick={() => setShowProfileMenu(false)}>
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
