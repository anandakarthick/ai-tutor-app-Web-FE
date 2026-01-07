/**
 * Analytics Dashboard Page
 */

import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  School,
  BookOpen,
  Clock,
  Target,
  Award,
  Calendar,
  Download,
  RefreshCw,
} from 'lucide-react';
import './AdminPages.css';

export function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState('30days');

  const overviewStats = [
    { title: 'Total Users', value: '12,456', change: 12.5, trend: 'up', icon: Users },
    { title: 'Active Learners', value: '8,934', change: 8.2, trend: 'up', icon: BookOpen },
    { title: 'Lessons Completed', value: '156,789', change: 23.1, trend: 'up', icon: Target },
    { title: 'Avg. Session Time', value: '24 min', change: -5.4, trend: 'down', icon: Clock },
  ];

  const engagementData = [
    { day: 'Mon', users: 1200, lessons: 3400, quizzes: 890 },
    { day: 'Tue', users: 1350, lessons: 3800, quizzes: 920 },
    { day: 'Wed', users: 1180, lessons: 3200, quizzes: 850 },
    { day: 'Thu', users: 1420, lessons: 4100, quizzes: 980 },
    { day: 'Fri', users: 1560, lessons: 4500, quizzes: 1050 },
    { day: 'Sat', users: 980, lessons: 2800, quizzes: 720 },
    { day: 'Sun', users: 850, lessons: 2400, quizzes: 650 },
  ];

  const topSubjects = [
    { name: 'Mathematics', learners: 4523, completion: 78, color: '#F97316' },
    { name: 'Science', learners: 3890, completion: 72, color: '#22C55E' },
    { name: 'English', learners: 3456, completion: 85, color: '#3B82F6' },
    { name: 'Social Science', learners: 2890, completion: 68, color: '#8B5CF6' },
    { name: 'Hindi', learners: 2345, completion: 75, color: '#EC4899' },
  ];

  const topClasses = [
    { name: 'Class 10', students: 2456, avgScore: 78 },
    { name: 'Class 12', students: 2123, avgScore: 75 },
    { name: 'Class 9', students: 1890, avgScore: 72 },
    { name: 'Class 11', students: 1678, avgScore: 70 },
    { name: 'Class 8', students: 1456, avgScore: 74 },
  ];

  const recentAchievements = [
    { student: 'Priya Sharma', achievement: 'Completed 100 Lessons', class: 'Class 10', time: '2 hours ago' },
    { student: 'Rahul Verma', achievement: 'Perfect Quiz Score', class: 'Class 9', time: '3 hours ago' },
    { student: 'Ananya Patel', achievement: '30-Day Streak', class: 'Class 12', time: '5 hours ago' },
    { student: 'Vikram Singh', achievement: 'Subject Mastery: Math', class: 'Class 11', time: '6 hours ago' },
  ];

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Analytics</h1>
          <p>Platform performance and user engagement insights</p>
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
            <RefreshCw size={18} />
            Refresh
          </button>
          <button className="btn btn-primary">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        {overviewStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
                <div className={`stat-change ${stat.trend === 'up' ? 'increase' : 'decrease'}`}>
                  <TrendIcon size={14} />
                  <span>{Math.abs(stat.change)}% from last period</span>
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
            <h3>User Engagement</h3>
            <div className="chart-legend">
              <span><span className="dot" style={{ background: '#F97316' }}></span> Active Users</span>
              <span><span className="dot" style={{ background: '#3B82F6' }}></span> Lessons</span>
              <span><span className="dot" style={{ background: '#22C55E' }}></span> Quizzes</span>
            </div>
          </div>
          <div className="chart-content">
            <div className="bar-chart">
              {engagementData.map((data, index) => (
                <div key={index} className="bar-group">
                  <div className="bars">
                    <div 
                      className="bar users" 
                      style={{ height: `${(data.users / 1600) * 100}%` }}
                      title={`Users: ${data.users}`}
                    ></div>
                    <div 
                      className="bar lessons" 
                      style={{ height: `${(data.lessons / 5000) * 100}%` }}
                      title={`Lessons: ${data.lessons}`}
                    ></div>
                    <div 
                      className="bar quizzes" 
                      style={{ height: `${(data.quizzes / 1200) * 100}%` }}
                      title={`Quizzes: ${data.quizzes}`}
                    ></div>
                  </div>
                  <span className="bar-label">{data.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="card-header">
            <h3>Top Subjects</h3>
          </div>
          <div className="subjects-list">
            {topSubjects.map((subject, index) => (
              <div key={index} className="subject-item">
                <div className="subject-info">
                  <span className="subject-rank" style={{ background: subject.color }}>{index + 1}</span>
                  <div>
                    <h4>{subject.name}</h4>
                    <span>{subject.learners.toLocaleString()} learners</span>
                  </div>
                </div>
                <div className="subject-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${subject.completion}%`, background: subject.color }}
                    ></div>
                  </div>
                  <span>{subject.completion}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="analytics-row">
        <div className="table-card">
          <div className="card-header">
            <h3>Top Performing Classes</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Students</th>
                <th>Avg. Score</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {topClasses.map((cls, index) => (
                <tr key={index}>
                  <td>
                    <div className="class-name">
                      <School size={16} />
                      {cls.name}
                    </div>
                  </td>
                  <td>{cls.students.toLocaleString()}</td>
                  <td>{cls.avgScore}%</td>
                  <td>
                    <div className="mini-progress">
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${cls.avgScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-card">
          <div className="card-header">
            <h3>Recent Achievements</h3>
            <Award size={20} className="header-icon" />
          </div>
          <div className="achievements-list">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="achievement-item">
                <div className="achievement-icon">
                  <Award size={18} />
                </div>
                <div className="achievement-info">
                  <h4>{achievement.student}</h4>
                  <p>{achievement.achievement}</p>
                  <span>{achievement.class} • {achievement.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-icon green">
            <TrendingUp size={24} />
          </div>
          <div className="insight-content">
            <h4>Peak Usage Time</h4>
            <p>Most users are active between <strong>4 PM - 8 PM</strong></p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon blue">
            <Target size={24} />
          </div>
          <div className="insight-content">
            <h4>Popular Feature</h4>
            <p><strong>AI Doubt Solving</strong> is the most used feature</p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon orange">
            <Award size={24} />
          </div>
          <div className="insight-content">
            <h4>Completion Rate</h4>
            <p><strong>67%</strong> of started lessons are completed</p>
          </div>
        </div>
        <div className="insight-card">
          <div className="insight-icon purple">
            <Users size={24} />
          </div>
          <div className="insight-content">
            <h4>Retention Rate</h4>
            <p><strong>78%</strong> users return within a week</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
