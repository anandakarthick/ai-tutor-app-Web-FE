/**
 * Admin Dashboard Page
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  School,
  BookOpen,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Activity,
  DollarSign,
  UserPlus,
  GraduationCap,
  BarChart3,
  FileText,
  Settings,
  Eye,
  Layers,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getDashboardStats, getRecentActivity, getTransactions } from '../../services/api/admin';
import './AdminPages.css';

interface DashboardStats {
  totalStudents: number;
  totalUsers: number;
  totalSchools: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  studentGrowth: string;
}

interface Activity {
  type: string;
  message: string;
  user: string;
  time: string;
}

interface Transaction {
  id: string;
  user: { fullName: string };
  planName?: string;
  amount: number;
  status: string;
  createdAt: string;
}

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsResponse, activityResponse, transactionsResponse] = await Promise.all([
        getDashboardStats(),
        getRecentActivity(5),
        getTransactions({ limit: 5 }),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (activityResponse.success) {
        setActivities(activityResponse.data);
      }

      if (transactionsResponse.success) {
        setTransactions(transactionsResponse.data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const statCards = stats ? [
    { title: 'Total Students', value: stats.totalStudents.toLocaleString(), change: stats.studentGrowth, isPositive: !stats.studentGrowth.startsWith('-'), icon: Users, color: '#3B82F6' },
    { title: 'Active Subscriptions', value: stats.activeSubscriptions.toLocaleString(), change: '+8.2%', isPositive: true, icon: CreditCard, color: '#22C55E' },
    { title: 'Total Schools', value: stats.totalSchools.toLocaleString(), change: '+5.1%', isPositive: true, icon: School, color: '#F97316' },
    { title: 'Monthly Revenue', value: formatCurrency(stats.monthlyRevenue), change: '+18.3%', isPositive: true, icon: DollarSign, color: '#8B5CF6' },
  ] : [];

  const quickActions = [
    { title: 'Add Student', icon: UserPlus, link: '/admin/students' },
    { title: 'Add School', icon: School, link: '/admin/schools' },
    { title: 'View Reports', icon: FileText, link: '/admin/reports' },
    { title: 'Analytics', icon: BarChart3, link: '/admin/analytics' },
    { title: 'Settings', icon: Settings, link: '/admin/settings' },
    { title: 'Subject Mapping', icon: Layers, link: '/admin/subject-mapping' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'subscription': return <CreditCard size={16} />;
      case 'registration': return <UserPlus size={16} />;
      case 'payment': return <DollarSign size={16} />;
      case 'payment_failed': return <DollarSign size={16} />;
      case 'school': return <School size={16} />;
      default: return <Activity size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchDashboardData}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <select 
            className="date-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={22} />
            </div>
            <div className="stat-content">
              <p className="stat-title">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className={`stat-change ${stat.isPositive ? 'increase' : 'decrease'}`}>
                {stat.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="card-header">
            <h3>Revenue Overview</h3>
            <select className="chart-select">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Revenue Chart</p>
            <span>Integration pending</span>
          </div>
        </div>
        <div className="chart-card">
          <div className="card-header">
            <h3>User Growth</h3>
            <select className="chart-select">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <TrendingUp size={48} />
            <p>User Growth Chart</p>
            <span>Integration pending</span>
          </div>
        </div>
        <div className="chart-card small">
          <div className="card-header">
            <h3>Subscription Distribution</h3>
          </div>
          <div className="chart-placeholder" style={{ height: '100px' }}>
            <Activity size={32} />
            <p>Pie Chart</p>
          </div>
          <div className="distribution-stats">
            <div className="dist-item">
              <span className="dot monthly"></span>
              <span>Monthly: 36%</span>
            </div>
            <div className="dist-item">
              <span className="dot yearly"></span>
              <span>Yearly: 64%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="tables-row">
        <div className="table-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <Link to="/admin/analytics" className="view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span>{formatDate(activity.time)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                <Activity size={32} />
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </div>
        <div className="table-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <Link to="/admin/transactions" className="view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          {transactions.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((txn, index) => (
                  <tr key={index}>
                    <td>{txn.user?.fullName || 'Unknown'}</td>
                    <td className="revenue">₹{Number(txn.amount).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${txn.status}`}>
                        {txn.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <CreditCard size={32} />
              <p>No recent transactions</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link} className="action-card">
              <action.icon size={22} />
              <span>{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
