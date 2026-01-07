/**
 * Admin Dashboard Page
 */

import { useState, useEffect } from 'react';
import {
  Users,
  School,
  BookOpen,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Activity,
  DollarSign,
  UserPlus,
  GraduationCap,
  Clock,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './AdminPages.css';

interface StatCard {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: any;
  color: string;
}

interface RecentActivity {
  id: number;
  type: string;
  message: string;
  time: string;
  icon: any;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    {
      title: 'Total Students',
      value: '12,456',
      change: 12.5,
      changeType: 'increase',
      icon: Users,
      color: '#3B82F6',
    },
    {
      title: 'Active Schools',
      value: '245',
      change: 8.2,
      changeType: 'increase',
      icon: School,
      color: '#22C55E',
    },
    {
      title: 'Total Revenue',
      value: '₹45,67,890',
      change: 23.1,
      changeType: 'increase',
      icon: DollarSign,
      color: '#F97316',
    },
    {
      title: 'Active Subscriptions',
      value: '8,934',
      change: 5.4,
      changeType: 'increase',
      icon: CreditCard,
      color: '#8B5CF6',
    },
  ]);

  const [recentActivities] = useState<RecentActivity[]>([
    { id: 1, type: 'registration', message: 'New student registered: Priya Sharma', time: '2 min ago', icon: UserPlus },
    { id: 2, type: 'payment', message: 'Payment received: ₹3,000 (Yearly Plan)', time: '15 min ago', icon: CreditCard },
    { id: 3, type: 'school', message: 'New school added: Delhi Public School', time: '1 hour ago', icon: School },
    { id: 4, type: 'subscription', message: 'Subscription upgraded: Rahul Verma', time: '2 hours ago', icon: TrendingUp },
    { id: 5, type: 'registration', message: 'New student registered: Ananya Patel', time: '3 hours ago', icon: UserPlus },
  ]);

  const [topSchools] = useState([
    { name: 'Delhi Public School', students: 456, revenue: '₹4,56,000' },
    { name: 'St. Xavier\'s High School', students: 389, revenue: '₹3,89,000' },
    { name: 'Kendriya Vidyalaya', students: 312, revenue: '₹3,12,000' },
    { name: 'DAV Public School', students: 278, revenue: '₹2,78,000' },
    { name: 'Ryan International', students: 245, revenue: '₹2,45,000' },
  ]);

  const [recentTransactions] = useState([
    { id: 'TXN001', student: 'Priya Sharma', amount: '₹3,000', plan: 'Yearly', status: 'success', date: 'Today' },
    { id: 'TXN002', student: 'Rahul Verma', amount: '₹299', plan: 'Monthly', status: 'success', date: 'Today' },
    { id: 'TXN003', student: 'Ananya Patel', amount: '₹3,000', plan: 'Yearly', status: 'pending', date: 'Yesterday' },
    { id: 'TXN004', student: 'Vikram Singh', amount: '₹299', plan: 'Monthly', status: 'failed', date: 'Yesterday' },
    { id: 'TXN005', student: 'Neha Gupta', amount: '₹3,000', plan: 'Yearly', status: 'success', date: '2 days ago' },
  ]);

  return (
    <div className="admin-page dashboard">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Calendar size={18} />
            Last 30 Days
          </button>
          <button className="btn btn-primary">
            <BarChart3 size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.changeType === 'increase' ? TrendingUp : TrendingDown;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <div className={`stat-change ${stat.changeType}`}>
                  <TrendIcon size={14} />
                  <span>{stat.change}% from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="card-header">
            <h3>Revenue Overview</h3>
            <select className="chart-select">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <BarChart3 size={48} />
            <p>Revenue Chart</p>
            <span>Chart visualization will be added</span>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>User Growth</h3>
            <select className="chart-select">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
          <div className="chart-placeholder">
            <Activity size={48} />
            <p>Growth Chart</p>
            <span>Chart visualization will be added</span>
          </div>
        </div>

        <div className="chart-card small">
          <div className="card-header">
            <h3>Subscription Distribution</h3>
          </div>
          <div className="chart-placeholder">
            <PieChart size={48} />
            <p>Pie Chart</p>
          </div>
          <div className="distribution-stats">
            <div className="dist-item">
              <span className="dot monthly"></span>
              <span>Monthly: 35%</span>
            </div>
            <div className="dist-item">
              <span className="dot yearly"></span>
              <span>Yearly: 65%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="tables-row">
        {/* Recent Activities */}
        <div className="table-card">
          <div className="card-header">
            <h3>Recent Activities</h3>
            <Link to="/admin/activities" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    <Icon size={18} />
                  </div>
                  <div className="activity-content">
                    <p>{activity.message}</p>
                    <span>{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Schools */}
        <div className="table-card">
          <div className="card-header">
            <h3>Top Schools</h3>
            <Link to="/admin/schools" className="view-all">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>School Name</th>
                <th>Students</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topSchools.map((school, index) => (
                <tr key={index}>
                  <td>
                    <div className="school-name">
                      <School size={16} />
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
      <div className="table-card full-width">
        <div className="card-header">
          <h3>Recent Transactions</h3>
          <Link to="/admin/transactions" className="view-all">
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Student</th>
              <th>Amount</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((txn) => (
              <tr key={txn.id}>
                <td className="txn-id">{txn.id}</td>
                <td>{txn.student}</td>
                <td className="amount">{txn.amount}</td>
                <td>
                  <span className={`plan-badge ${txn.plan.toLowerCase()}`}>
                    {txn.plan}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${txn.status}`}>
                    {txn.status}
                  </span>
                </td>
                <td className="date">{txn.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="actions-grid">
          <Link to="/admin/students/add" className="action-card">
            <UserPlus size={24} />
            <span>Add Student</span>
          </Link>
          <Link to="/admin/schools/add" className="action-card">
            <School size={24} />
            <span>Add School</span>
          </Link>
          <Link to="/admin/classes/add" className="action-card">
            <GraduationCap size={24} />
            <span>Add Class</span>
          </Link>
          <Link to="/admin/subjects/add" className="action-card">
            <BookOpen size={24} />
            <span>Add Subject</span>
          </Link>
          <Link to="/admin/plans/add" className="action-card">
            <CreditCard size={24} />
            <span>Add Plan</span>
          </Link>
          <Link to="/admin/settings" className="action-card">
            <Activity size={24} />
            <span>Settings</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
