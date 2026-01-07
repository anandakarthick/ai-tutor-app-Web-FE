/**
 * Admin Dashboard Page
 */

import { useState } from 'react';
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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './AdminPages.css';

export function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  const stats = [
    { title: 'Total Students', value: '12,456', change: '+12.5%', isPositive: true, icon: Users, color: '#3B82F6' },
    { title: 'Active Subscriptions', value: '8,934', change: '+8.2%', isPositive: true, icon: CreditCard, color: '#22C55E' },
    { title: 'Total Schools', value: '156', change: '+5.1%', isPositive: true, icon: School, color: '#F97316' },
    { title: 'Monthly Revenue', value: '₹12.5L', change: '+18.3%', isPositive: true, icon: DollarSign, color: '#8B5CF6' },
  ];

  const recentActivities = [
    { id: 1, type: 'subscription', message: 'Priya Sharma subscribed to Yearly Plan', time: '2 mins ago' },
    { id: 2, type: 'registration', message: 'New student registration from Delhi Public School', time: '15 mins ago' },
    { id: 3, type: 'payment', message: 'Payment received ₹3,000 - Order #ORD1234', time: '32 mins ago' },
    { id: 4, type: 'school', message: 'New school added: Ryan International, Pune', time: '1 hour ago' },
    { id: 5, type: 'subscription', message: 'Rahul Verma renewed Monthly Plan', time: '2 hours ago' },
  ];

  const topSchools = [
    { name: 'Delhi Public School', students: 456, revenue: '₹13.6L' },
    { name: "St. Xavier's High School", students: 389, revenue: '₹11.7L' },
    { name: 'Kendriya Vidyalaya', students: 312, revenue: '₹9.4L' },
    { name: 'DAV Public School', students: 278, revenue: '₹8.3L' },
    { name: 'Ryan International', students: 245, revenue: '₹7.4L' },
  ];

  const recentTransactions = [
    { id: 'ORD001', student: 'Priya Sharma', plan: 'Yearly', amount: '₹3,000', status: 'success', date: 'Today, 10:30 AM' },
    { id: 'ORD002', student: 'Rahul Verma', plan: 'Monthly', amount: '₹299', status: 'success', date: 'Today, 09:15 AM' },
    { id: 'ORD003', student: 'Ananya Patel', plan: 'Yearly', amount: '₹3,000', status: 'pending', date: 'Yesterday' },
    { id: 'ORD004', student: 'Vikram Singh', plan: 'Monthly', amount: '₹299', status: 'failed', date: 'Yesterday' },
  ];

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
      case 'school': return <School size={16} />;
      default: return <Activity size={16} />;
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="header-actions">
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
        {stats.map((stat, index) => (
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
              <span>Monthly: 3,245 (36%)</span>
            </div>
            <div className="dist-item">
              <span className="dot yearly"></span>
              <span>Yearly: 5,689 (64%)</span>
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
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="table-card">
          <div className="card-header">
            <h3>Top Schools</h3>
            <Link to="/admin/schools" className="view-all">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Students</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topSchools.map((school, index) => (
                <tr key={index}>
                  <td>
                    <div className="school-name">
                      <School size={14} />
                      {school.name}
                    </div>
                  </td>
                  <td>{school.students}</td>
                  <td className="revenue">{school.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="data-grid" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3>Recent Transactions</h3>
          <Link to="/admin/transactions" className="view-all">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Student</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <span className="id-badge">{txn.id}</span>
                  </td>
                  <td>{txn.student}</td>
                  <td>
                    <span className={`plan-badge ${txn.plan.toLowerCase()}`}>
                      {txn.plan}
                    </span>
                  </td>
                  <td className="amount">{txn.amount}</td>
                  <td>
                    <span className={`status-badge ${txn.status}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="date">{txn.date}</td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <Link to="/admin/transactions" className="table-action-btn view">
                        <Eye size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
