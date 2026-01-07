/**
 * Analytics Page
 */

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  CreditCard,
  Calendar,
  Download,
  Activity,
  Target,
  Clock,
  Award,
} from 'lucide-react';
import './AdminPages.css';

export function Analytics() {
  const [dateRange, setDateRange] = useState('30days');

  const metrics = [
    { label: 'Total Users', value: '12,456', change: '+12.5%', trend: 'up', icon: Users, color: '#3B82F6' },
    { label: 'Active Learners', value: '8,934', change: '+8.2%', trend: 'up', icon: Activity, color: '#22C55E' },
    { label: 'Questions Asked', value: '45,678', change: '+23.1%', trend: 'up', icon: BookOpen, color: '#F97316' },
    { label: 'Avg. Session Time', value: '24 min', change: '+5.4%', trend: 'up', icon: Clock, color: '#8B5CF6' },
  ];

  const topSubjects = [
    { name: 'Mathematics', usage: 35, color: '#F97316' },
    { name: 'Science', usage: 28, color: '#22C55E' },
    { name: 'English', usage: 18, color: '#3B82F6' },
    { name: 'Social Science', usage: 12, color: '#8B5CF6' },
    { name: 'Hindi', usage: 7, color: '#EC4899' },
  ];

  const topClasses = [
    { name: 'Class 10', students: 2456, percentage: 20 },
    { name: 'Class 9', students: 2123, percentage: 17 },
    { name: 'Class 12', students: 1876, percentage: 15 },
    { name: 'Class 11', students: 1654, percentage: 13 },
    { name: 'Class 8', students: 1432, percentage: 12 },
  ];

  const revenueData = [
    { month: 'Jul', revenue: 320000 },
    { month: 'Aug', revenue: 380000 },
    { month: 'Sep', revenue: 420000 },
    { month: 'Oct', revenue: 480000 },
    { month: 'Nov', revenue: 520000 },
    { month: 'Dec', revenue: 567890 },
  ];

  const userGrowthData = [
    { month: 'Jul', users: 8500 },
    { month: 'Aug', users: 9200 },
    { month: 'Sep', users: 9800 },
    { month: 'Oct', users: 10500 },
    { month: 'Nov', users: 11200 },
    { month: 'Dec', users: 12456 },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Platform performance and user insights</p>
        </div>
        <div className="header-actions">
          <select 
            className="date-select" 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-outline">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="stats-grid">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: `${metric.color}15`, color: metric.color }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">{metric.label}</p>
                <h3 className="stat-value">{metric.value}</h3>
                <div className={`stat-change ${metric.trend === 'up' ? 'increase' : 'decrease'}`}>
                  {metric.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span>{metric.change} from last period</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="analytics-charts">
        <div className="chart-card large">
          <div className="card-header">
            <h3>Revenue Trend</h3>
            <span className="chart-total">Total: ₹26,87,890</span>
          </div>
          <div className="bar-chart">
            {revenueData.map((item, index) => (
              <div key={index} className="bar-item">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(item.revenue / 600000) * 100}%`,
                    background: 'linear-gradient(180deg, #F97316, #FB923C)'
                  }}
                >
                  <span className="bar-value">₹{(item.revenue / 1000).toFixed(0)}K</span>
                </div>
                <span className="bar-label">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>User Growth</h3>
          </div>
          <div className="line-chart-placeholder">
            <div className="growth-numbers">
              {userGrowthData.map((item, index) => (
                <div key={index} className="growth-item">
                  <span className="growth-month">{item.month}</span>
                  <span className="growth-value">{item.users.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Distribution Row */}
      <div className="analytics-distribution">
        <div className="distribution-card">
          <div className="card-header">
            <h3>Top Subjects by Usage</h3>
          </div>
          <div className="subject-list">
            {topSubjects.map((subject, index) => (
              <div key={index} className="subject-item">
                <div className="subject-info">
                  <span className="subject-name">{subject.name}</span>
                  <span className="subject-percentage">{subject.usage}%</span>
                </div>
                <div className="subject-bar">
                  <div 
                    className="subject-progress" 
                    style={{ width: `${subject.usage}%`, background: subject.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="distribution-card">
          <div className="card-header">
            <h3>Students by Class</h3>
          </div>
          <div className="class-list">
            {topClasses.map((cls, index) => (
              <div key={index} className="class-item">
                <div className="class-rank">{index + 1}</div>
                <div className="class-info">
                  <span className="class-name">{cls.name}</span>
                  <span className="class-students">{cls.students.toLocaleString()} students</span>
                </div>
                <div className="class-percentage">{cls.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="distribution-card">
          <div className="card-header">
            <h3>Engagement Metrics</h3>
          </div>
          <div className="engagement-metrics">
            <div className="engagement-item">
              <div className="engagement-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
                <Target size={20} />
              </div>
              <div className="engagement-info">
                <span className="engagement-label">Quiz Completion Rate</span>
                <span className="engagement-value">78%</span>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
                <Award size={20} />
              </div>
              <div className="engagement-info">
                <span className="engagement-label">Average Quiz Score</span>
                <span className="engagement-value">72%</span>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-icon" style={{ background: '#F9731615', color: '#F97316' }}>
                <BookOpen size={20} />
              </div>
              <div className="engagement-info">
                <span className="engagement-label">Lessons Completed</span>
                <span className="engagement-value">45,678</span>
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
                <Activity size={20} />
              </div>
              <div className="engagement-info">
                <span className="engagement-label">Daily Active Users</span>
                <span className="engagement-value">3,456</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="insights-section">
        <h3>Performance Insights</h3>
        <div className="insights-grid">
          <div className="insight-card positive">
            <TrendingUp size={20} />
            <div>
              <h4>User Engagement Up</h4>
              <p>Daily active users increased by 15% compared to last month</p>
            </div>
          </div>
          <div className="insight-card positive">
            <TrendingUp size={20} />
            <div>
              <h4>Revenue Growth</h4>
              <p>Monthly revenue grew by 23% with yearly plans leading</p>
            </div>
          </div>
          <div className="insight-card warning">
            <Activity size={20} />
            <div>
              <h4>Class 11 Engagement Low</h4>
              <p>Consider adding more content for Class 11 students</p>
            </div>
          </div>
          <div className="insight-card info">
            <Target size={20} />
            <div>
              <h4>Peak Usage Hours</h4>
              <p>Most users are active between 6 PM - 10 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
