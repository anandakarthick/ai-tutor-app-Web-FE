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
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  getAnalyticsOverview, 
  getDashboardStats, 
  getTopSubjects, 
  getTopClasses, 
  getRecentUserActivity 
} from '../../services/api/admin';
import './AdminPages.css';
import './AdminPagesExtra.css';

interface Stats {
  totalStudents: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  studentGrowth: string;
  totalUsers?: number;
}

interface DailyData {
  date: string;
  count?: string;
  total?: string;
}

interface SubjectStat {
  subjectName: string;
  color: string;
  sessions: string;
  interactions: string;
}

interface ClassStat {
  className: string;
  students: string;
}

interface UserActivity {
  id: string;
  student?: {
    studentName: string;
  };
  quiz?: {
    quizTitle: string;
    subject?: {
      subjectName: string;
    };
  };
  score?: number;
  totalQuestions?: number;
  createdAt: string;
}

export function Analytics() {
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dailyRegistrations, setDailyRegistrations] = useState<DailyData[]>([]);
  const [dailyRevenue, setDailyRevenue] = useState<DailyData[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<any[]>([]);
  const [topSubjects, setTopSubjects] = useState<SubjectStat[]>([]);
  const [topClasses, setTopClasses] = useState<ClassStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<UserActivity[]>([]);
  const [activityPagination, setActivityPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [totalInteractions, setTotalInteractions] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  useEffect(() => {
    fetchRecentActivity();
  }, [activityPagination.page]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [statsResponse, analyticsResponse, subjectsResponse, classesResponse] = await Promise.all([
        getDashboardStats(),
        getAnalyticsOverview(dateRange),
        getTopSubjects(),
        getTopClasses(),
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      if (analyticsResponse.success) {
        setDailyRegistrations(analyticsResponse.data.dailyRegistrations || []);
        setDailyRevenue(analyticsResponse.data.dailyRevenue || []);
        setMonthlyRevenue(analyticsResponse.data.monthlyRevenue || []);
        setSubscriptionStats(analyticsResponse.data.subscriptionStats || []);
        setTotalInteractions(analyticsResponse.data.summary?.totalInteractions || 0);
      }

      if (subjectsResponse.success) {
        setTopSubjects(subjectsResponse.data || []);
      }

      if (classesResponse.success) {
        setTopClasses(classesResponse.data || []);
      }

      // Fetch initial recent activity
      await fetchRecentActivity();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const response = await getRecentUserActivity(activityPagination.page, activityPagination.limit);
      if (response.success) {
        setRecentActivity(response.data.activities || []);
        setActivityPagination(prev => ({
          ...prev,
          total: response.data.pagination?.total || 0,
          totalPages: response.data.pagination?.totalPages || 0,
        }));
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  // Calculate stats from data
  const totalUsers = stats?.totalStudents || 0;
  const activeUsers = stats?.activeSubscriptions || 0;

  // Calculate total registrations from daily data
  const totalNewRegistrations = dailyRegistrations.reduce((sum, d) => sum + parseInt(d.count || '0'), 0);

  // Calculate average session time (mock for now as we don't have this data)
  const avgSessionTime = '24 min';

  const statCards = [
    { title: 'Total Users', value: totalUsers.toLocaleString(), change: stats?.studentGrowth || '+0%', isPositive: true, icon: Users, color: '#3B82F6' },
    { title: 'Active Learners', value: activeUsers.toLocaleString(), change: '+8.2%', isPositive: true, icon: Target, color: '#22C55E' },
    { title: 'AI Interactions', value: totalInteractions > 0 ? totalInteractions.toLocaleString() : '0', change: '+15.3%', isPositive: true, icon: HelpCircle, color: '#F97316' },
    { title: 'New Registrations', value: totalNewRegistrations > 0 ? totalNewRegistrations.toString() : '0', change: `Last ${dateRange} days`, isPositive: true, icon: Clock, color: '#8B5CF6' },
  ];

  // Process monthly revenue data for chart
  const chartData = monthlyRevenue.length > 0 
    ? monthlyRevenue.map(d => ({
        month: d.month,
        revenue: parseInt(d.total || '0'),
      }))
    : dailyRevenue.length > 0 
      ? (() => {
          // Group daily revenue by month
          const grouped: { [key: string]: number } = {};
          dailyRevenue.forEach(d => {
            const month = new Date(d.date).toLocaleDateString('en-US', { month: 'short' });
            grouped[month] = (grouped[month] || 0) + parseInt(d.total || '0');
          });
          return Object.entries(grouped).slice(-6).map(([month, revenue]) => ({ month, revenue }));
        })()
      : [];

  const maxRevenue = Math.max(...chartData.map(m => m.revenue), 1);
  const totalRevenue = chartData.reduce((a, b) => a + b.revenue, 0);

  // Process top subjects data
  const processedSubjects = topSubjects.length > 0
    ? topSubjects.map((subject, index) => {
        const colors = ['#F97316', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899'];
        const totalSessions = topSubjects.reduce((sum, s) => sum + parseInt(s.sessions || '0'), 0);
        const sessions = parseInt(subject.sessions || '0');
        const percentage = totalSessions > 0 ? Math.round((sessions / totalSessions) * 100) : 0;
        return {
          name: subject.subjectName || 'Unknown',
          percentage,
          color: subject.color || colors[index % colors.length],
          students: sessions,
          interactions: parseInt(subject.interactions || '0'),
        };
      })
    : [];

  // Process top classes data
  const processedClasses = topClasses.length > 0
    ? topClasses.map((cls, index) => {
        const totalStudents = topClasses.reduce((sum, c) => sum + parseInt(c.students || '0'), 0);
        const students = parseInt(cls.students || '0');
        const percentage = totalStudents > 0 ? ((students / totalStudents) * 100).toFixed(1) : '0';
        return {
          rank: index + 1,
          name: cls.className || 'Unknown',
          students,
          percentage,
        };
      })
    : [];

  // Generate insights based on real data
  const generateInsights = () => {
    const insights = [];

    // User growth insight
    if (stats?.studentGrowth) {
      const growth = parseFloat(stats.studentGrowth.replace('%', ''));
      insights.push({
        type: growth > 0 ? 'positive' : 'warning',
        title: 'User Growth',
        description: growth > 0 
          ? `User registrations increased by ${stats.studentGrowth} compared to last period`
          : `User registrations decreased. Consider marketing campaigns.`,
        icon: TrendingUp,
      });
    }

    // Active users insight
    if (activeUsers > 0 && totalUsers > 0) {
      const activePercentage = ((activeUsers / totalUsers) * 100).toFixed(1);
      insights.push({
        type: parseFloat(activePercentage) > 50 ? 'positive' : 'warning',
        title: 'Active Subscriptions',
        description: `${activePercentage}% of users have active subscriptions`,
        icon: Zap,
      });
    }

    // Top subject insight
    if (processedSubjects.length > 0) {
      insights.push({
        type: 'info',
        title: 'Top Subject',
        description: `${processedSubjects[0].name} is the most popular subject with ${processedSubjects[0].percentage}% usage`,
        icon: Award,
      });
    }

    // Revenue insight
    if (totalRevenue > 0) {
      insights.push({
        type: 'positive',
        title: 'Revenue',
        description: `Total revenue of ₹${(totalRevenue / 1000).toFixed(1)}K in the selected period`,
        icon: Activity,
      });
    }

    // Add default insight if no data
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        title: 'Getting Started',
        description: 'Analytics data will appear as users start using the platform',
        icon: Activity,
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // Format time ago
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

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
              <span className={`stat-change ${stat.isPositive ? 'increase' : 'decrease'}`}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="data-grid">
        <div className="card-header">
          <h3>Revenue Trend</h3>
          <span className="card-header-subtitle">
            {totalRevenue > 0 ? `Total: ₹${(totalRevenue / 1000).toFixed(1)}K` : 'No revenue data'}
          </span>
        </div>
        <div className="chart-container">
          {chartData.length > 0 ? (
            <div className="bar-chart">
              {chartData.map((item, index) => (
                <div key={index} className="bar-item">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(item.revenue / maxRevenue) * 100}%`,
                      background: 'linear-gradient(180deg, #F97316, #FB923C)',
                      minHeight: item.revenue > 0 ? '40px' : '10px'
                    }}
                  >
                    {item.revenue > 0 && (
                      <span className="bar-value">₹{(item.revenue / 1000).toFixed(0)}K</span>
                    )}
                  </div>
                  <span className="bar-label">{item.month}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <BarChart3 size={48} />
              <p>No revenue data available for the selected period</p>
            </div>
          )}
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
            {processedSubjects.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Sessions</th>
                    <th>Usage</th>
                    <th style={{ width: '120px' }}>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {processedSubjects.map((subject, index) => (
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
            ) : (
              <div className="empty-state small">
                <BookOpen size={32} />
                <p>No subject data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Classes */}
        <div className="data-grid">
          <div className="card-header">
            <h3>Students by Class</h3>
          </div>
          <div className="table-responsive">
            {processedClasses.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>Rank</th>
                    <th>Class</th>
                    <th>Students</th>
                    <th>Share</th>
                  </tr>
                </thead>
                <tbody>
                  {processedClasses.map((cls) => (
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
                        <span className="plan-badge yearly">{cls.percentage}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state small">
                <GraduationCap size={32} />
                <p>No class data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="data-grid">
        <div className="card-header">
          <h3>Recent User Activity</h3>
          <span className="card-header-subtitle">Quiz attempts and learning sessions</span>
        </div>
        <div className="table-responsive">
          {recentActivity.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Quiz</th>
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
                          {(activity.student?.studentName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="user-name">{activity.student?.studentName || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-cell">{activity.quiz?.quizTitle || 'Quiz Attempt'}</span>
                    </td>
                    <td>
                      <span className="text-cell">{activity.quiz?.subject?.subjectName || '-'}</span>
                    </td>
                    <td>
                      {activity.score !== undefined && activity.totalQuestions ? (
                        <span className={`number-cell ${(activity.score / activity.totalQuestions) >= 0.7 ? 'success' : 'warning'}`}>
                          {Math.round((activity.score / activity.totalQuestions) * 100)}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--admin-text-muted)' }}>-</span>
                      )}
                    </td>
                    <td>
                      <span className="date-cell">{formatTimeAgo(activity.createdAt)}</span>
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
          ) : (
            <div className="empty-state">
              <Activity size={48} />
              <p>No recent activity found</p>
              <span>Quiz attempts and learning sessions will appear here</span>
            </div>
          )}
        </div>
        {activityPagination.totalPages > 1 && (
          <div className="pagination">
            <span className="pagination-info">
              Showing {((activityPagination.page - 1) * activityPagination.limit) + 1}-
              {Math.min(activityPagination.page * activityPagination.limit, activityPagination.total)} of {activityPagination.total} activities
            </span>
            <div className="pagination-buttons">
              <button 
                className="pagination-btn" 
                disabled={activityPagination.page === 1}
                onClick={() => setActivityPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, activityPagination.totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button 
                    key={pageNum}
                    className={`pagination-btn ${activityPagination.page === pageNum ? 'active' : ''}`}
                    onClick={() => setActivityPagination(prev => ({ ...prev, page: pageNum }))}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                className="pagination-btn"
                disabled={activityPagination.page === activityPagination.totalPages}
                onClick={() => setActivityPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Insights Section */}
      <div className="data-grid insights-section">
        <div className="card-header">
          <div className="card-header-main">
            <h3>Performance Insights</h3>
            <span className="card-header-subtitle">Key metrics and recommendations based on your data</span>
          </div>
          <div className="insights-legend">
            <span className="legend-item positive"><span className="legend-dot"></span>Positive</span>
            <span className="legend-item warning"><span className="legend-dot"></span>Attention</span>
            <span className="legend-item info"><span className="legend-dot"></span>Info</span>
          </div>
        </div>
        <div className="insights-container">
          {insights.map((insight, index) => (
            <div key={index} className={`insight-card ${insight.type}`}>
              <div className="insight-icon">
                <insight.icon size={22} />
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
