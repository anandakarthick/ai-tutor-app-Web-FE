/**
 * Analytics Dashboard Page
 */

import { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Award,
  BookOpen,
  HelpCircle,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ChevronLeft,
  ChevronRight,
  Activity,
  Zap,
  GraduationCap,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAnalyticsOverview, getDashboardStats } from '../../services/api/admin';
import './AdminPages.css';
import './AdminPagesExtra.css';

interface Stats {
  totalStudents: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  studentGrowth: string;
}

interface DailyData {
  date: string;
  count?: string;
  total?: string;
}

export function Analytics() {
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailyRegistrations, setDailyRegistrations] = useState<DailyData[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyData[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<any[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsResponse, analyticsResponse] = await Promise.all([
        getDashboardStats(),
        getAnalyticsOverview(dateRange),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (analyticsResponse.success) {
        setDailyRegistrations(analyticsResponse.data.dailyRegistrations || []);
        setDailyRevenue(analyticsResponse.data.dailyRevenue || []);
        setSubscriptionStats(analyticsResponse.data.subscriptionStats || []);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from data
  const totalUsers = stats?.totalStudents || 0;
  const activeUsers = stats?.activeSubscriptions || 0;

  const statCards = [
    { title: 'Total Users', value: totalUsers.toLocaleString(), change: stats?.studentGrowth || '+0%', isPositive: true, icon: Users, color: '#3B82F6' },
    { title: 'Active Learners', value: activeUsers.toLocaleString(), change: '+8.2%', isPositive: true, icon: Target, color: '#22C55E' },
    { title: 'Questions Asked', value: '-', change: '-', isPositive: true, icon: HelpCircle, color: '#F97316' },
    { title: 'Avg. Session Time', value: '-', change: '-', isPositive: true, icon: Clock, color: '#8B5CF6' },
  ];

  // Process revenue data for chart
  const monthlyData = dailyRevenue.length > 0 
    ? dailyRevenue.slice(-6).map(d => ({
        month: new Date(d.date).toLocaleDateString('en-US', { month: 'short' }),
        revenue: parseInt(d.total || '0'),
      }))
    : [
        { month: 'Jul', revenue: 125000 },
        { month: 'Aug', revenue: 145000 },
        { month: 'Sep', revenue: 160000 },
        { month: 'Oct', revenue: 180000 },
        { month: 'Nov', revenue: 195000 },
        { month: 'Dec', revenue: 220000 },
      ];

  const maxRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);
  const totalRevenue = monthlyData.reduce((a, b) => a + b.revenue, 0);

  const topSubjects = [
    { name: 'Mathematics', percentage: 35, color: '#F97316', students: 4360 },
    { name: 'Science', percentage: 28, color: '#22C55E', students: 3488 },
    { name: 'English', percentage: 18, color: '#3B82F6', students: 2242 },
    { name: 'Social Science', percentage: 12, color: '#8B5CF6', students: 1495 },
    { name: 'Hindi', percentage: 7, color: '#EC4899', students: 872 },
  ];

  const topClasses = [
    { rank: 1, name: 'Class 10', students: 1678, percentage: 13.5, quizzes: 456 },
    { rank: 2, name: 'Class 12', students: 1567, percentage: 12.6, quizzes: 423 },
    { rank: 3, name: 'Class 9', students: 1456, percentage: 11.7, quizzes: 398 },
    { rank: 4, name: 'Class 11', students: 1234, percentage: 9.9, quizzes: 367 },
    { rank: 5, name: 'Class 8', students: 1289, percentage: 10.3, quizzes: 345 },
  ];

  const recentActivity = [
    { id: 1, user: 'Priya Sharma', action: 'Completed Quiz', subject: 'Mathematics', score: '92%', time: '2 mins ago' },
    { id: 2, user: 'Rahul Verma', action: 'Asked Question', subject: 'Physics', score: '-', time: '5 mins ago' },
    { id: 3, user: 'Ananya Patel', action: 'Completed Lesson', subject: 'English', score: '-', time: '12 mins ago' },
    { id: 4, user: 'Vikram Singh', action: 'Completed Quiz', subject: 'Chemistry', score: '78%', time: '18 mins ago' },
    { id: 5, user: 'Neha Gupta', action: 'Asked Question', subject: 'Biology', score: '-', time: '25 mins ago' },
  ];

  const insights = [
    { type: 'positive', title: 'User Growth', description: 'User registrations increased by 12.5% compared to last month', icon: TrendingUp },
    { type: 'positive', title: 'Engagement Up', description: 'Average session time improved by 5.4% this week', icon: Zap },
    { type: 'warning', title: 'Class 6 Engagement', description: 'Class 6 students show lower engagement - consider more content', icon: Activity },
    { type: 'info', title: 'Top Performer', description: 'Mathematics remains the most popular subject with 35% usage', icon: Award },
  ];

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Analytics Dashboard</h1>
          <p>Monitor platform performance and user engagement</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchAnalytics}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <select 
            className="date-select"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">This Year</option>
          </select>
          <button className="btn btn-outline">
            <Download size={16} />
            Export Report
          </button>
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
              {stat.change !== '-' && (
                <span className={`stat-change ${stat.isPositive ? 'increase' : 'decrease'}`}>
                  {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="data-grid">
        <div className="card-header">
          <h3>Revenue Trend (Last 6 Months)</h3>
          <span className="card-header-subtitle">Total: ₹{(totalRevenue / 100000).toFixed(1)}L</span>
        </div>
        <div className="chart-container">
          <div className="bar-chart">
            {monthlyData.map((item, index) => (
              <div key={index} className="bar-item">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(item.revenue / maxRevenue) * 100}%`,
                    background: 'linear-gradient(180deg, #F97316, #FB923C)',
                    minHeight: '40px'
                  }}
                >
                  <span className="bar-value">₹{(item.revenue / 1000).toFixed(0)}K</span>
                </div>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject & Class Distribution */}
      <div className="tables-row">
        {/* Top Subjects */}
        <div className="data-grid">
          <div className="card-header">
            <h3>Top Subjects by Usage</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Students</th>
                  <th>Usage</th>
                  <th style={{ width: '120px' }}>Progress</th>
                </tr>
              </thead>
              <tbody>
                {topSubjects.map((subject, index) => (
                  <tr key={index}>
                    <td>
                      <div className="user-cell">
                        <div 
                          className="user-avatar" 
                          style={{ background: `${subject.color}20`, color: subject.color }}
                        >
                          <BookOpen size={16} />
                        </div>
                        <span className="user-name">{subject.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="number-cell">{subject.students.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="number-cell success">{subject.percentage}%</span>
                    </td>
                    <td>
                      <div className="progress-bar-container">
                        <div 
                          className="progress-bar-fill" 
                          style={{ 
                            width: `${subject.percentage}%`,
                            background: subject.color
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Classes */}
        <div className="data-grid">
          <div className="card-header">
            <h3>Students by Class</h3>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Rank</th>
                  <th>Class</th>
                  <th>Students</th>
                  <th>Quizzes</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {topClasses.map((cls) => (
                  <tr key={cls.rank}>
                    <td>
                      <span className="rank-badge">#{cls.rank}</span>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                          <GraduationCap size={16} />
                        </div>
                        <span className="user-name">{cls.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="number-cell">{cls.students.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="number-cell">{cls.quizzes}</span>
                    </td>
                    <td>
                      <span className="plan-badge yearly">{cls.percentage}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="data-grid">
        <div className="card-header">
          <h3>Recent User Activity</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Action</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Time</th>
                <th style={{ width: '80px', textAlign: 'center' }}>View</th>
              </tr>
            </thead>
            <tbody>
              {recentActivity.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="user-name">{activity.user}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${activity.action.includes('Quiz') ? 'success' : activity.action.includes('Question') ? 'pending' : 'active'}`}>
                      {activity.action}
                    </span>
                  </td>
                  <td>{activity.subject}</td>
                  <td>
                    {activity.score !== '-' ? (
                      <span className="number-cell success">{activity.score}</span>
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    <span className="date-cell">{activity.time}</span>
                  </td>
                  <td>
                    <div className="table-actions" style={{ justifyContent: 'center' }}>
                      <button className="table-action-btn view" title="View Details">
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span className="pagination-info">Showing 1-5 of 100 activities</span>
          <div className="pagination-buttons">
            <button className="pagination-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Insights Section */}
      <div className="data-grid">
        <div className="card-header">
          <h3>Performance Insights</h3>
        </div>
        <div className="insights-container">
          {insights.map((insight, index) => (
            <div key={index} className={`insight-card ${insight.type}`}>
              <div className="insight-icon">
                <insight.icon size={20} />
              </div>
              <div className="insight-content">
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
