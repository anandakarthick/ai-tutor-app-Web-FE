/**
 * Dashboard Page
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Flame,
  Star,
  Target,
  Clock,
  BookOpen,
  FileText,
  HelpCircle,
  Calendar,
  Trophy,
  ChevronRight,
  TrendingUp,
  Calculator,
  FlaskConical,
  Languages,
  Atom,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { dashboardApi, contentApi, progressApi } from '../services/api';
import './Dashboard.css';

const subjectIcons: Record<string, any> = {
  mathematics: Calculator,
  math: Calculator,
  science: FlaskConical,
  english: BookOpen,
  hindi: Languages,
  physics: Atom,
  chemistry: FlaskConical,
  biology: FlaskConical,
  default: BookOpen,
};

const subjectColors: Record<string, string> = {
  mathematics: '#F97316',
  math: '#F97316',
  science: '#22C55E',
  english: '#8B5CF6',
  hindi: '#EC4899',
  physics: '#3B82F6',
  chemistry: '#14B8A6',
  biology: '#84CC16',
  default: '#6366F1',
};

export function Dashboard() {
  const { student } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [todayPlan, setTodayPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.id) {
      loadDashboardData();
    }
  }, [student?.id]);

  const loadDashboardData = async () => {
    if (!student?.id) return;

    setLoading(true);
    try {
      const [statsRes, todayRes] = await Promise.all([
        dashboardApi.getStats(student.id),
        dashboardApi.getToday(student.id),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (todayRes.success) setTodayPlan(todayRes.data);

      // Load subjects
      if (student.classId) {
        const subjectsRes = await contentApi.subjects.getByClass(student.classId);
        if (subjectsRes.success) {
          // Get progress for each subject
          const progressRes = await progressApi.getOverall(student.id, true);
          const subjectProgress = progressRes.data?.subjectProgress || [];
          
          const subjectsWithProgress = subjectsRes.data.map((subject: any) => {
            const progress = subjectProgress.find((p: any) => p.subjectId === subject.id);
            return {
              ...subject,
              progress: progress?.avgProgress || 0,
              completedTopics: progress?.completedTopics || 0,
              totalTopics: progress?.totalTopics || 0,
            };
          });
          setSubjects(subjectsWithProgress.slice(0, 4));
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getSubjectIcon = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '');
    return subjectIcons[key] || subjectIcons.default;
  };

  const getSubjectColor = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '');
    return subjectColors[key] || subjectColors.default;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="greeting">
          <p className="greeting-text">{getGreeting()} 👋</p>
          <h1 className="greeting-name">{student?.studentName || 'Student'}</h1>
        </div>
        <div className="header-stats">
          <div className="header-stat">
            <Flame size={20} className="stat-icon fire" />
            <span>{student?.streakDays || 0} days</span>
          </div>
          <div className="header-stat">
            <Star size={20} className="stat-icon star" />
            <span>{student?.xp?.toLocaleString() || 0} XP</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEE2E2' }}>
            <Flame size={24} color="#EF4444" />
          </div>
          <div className="stat-card-content">
            <h3>{stats?.student?.streakDays || student?.streakDays || 0}</h3>
            <p>Day Streak</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#FEF3C7' }}>
            <Star size={24} color="#F59E0B" />
          </div>
          <div className="stat-card-content">
            <h3>{stats?.student?.xp?.toLocaleString() || student?.xp?.toLocaleString() || 0}</h3>
            <p>Total XP</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#DCFCE7' }}>
            <Target size={24} color="#22C55E" />
          </div>
          <div className="stat-card-content">
            <h3>{stats?.overall?.completedTopics || 0}</h3>
            <p>Topics Done</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ background: '#DBEAFE' }}>
            <Clock size={24} color="#3B82F6" />
          </div>
          <div className="stat-card-content">
            <h3>{stats?.today?.studyTimeMinutes || 0}m</h3>
            <p>Today</p>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <Link to="/learn" className="continue-card">
        <div className="continue-content">
          <div className="continue-icon">
            <Play size={24} />
          </div>
          <div className="continue-text">
            <h3>Continue Learning</h3>
            <p>{todayPlan?.continueLearning?.topic?.topicTitle || 'Start your learning journey'}</p>
          </div>
        </div>
        <ChevronRight size={24} className="continue-arrow" />
      </Link>

      {/* Subjects */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Your Subjects</h2>
          <Link to="/learn" className="see-all">View All</Link>
        </div>
        <div className="subjects-grid">
          {subjects.map((subject) => {
            const Icon = getSubjectIcon(subject.subjectName);
            const color = getSubjectColor(subject.subjectName);
            return (
              <Link
                key={subject.id}
                to={`/learn/subject/${subject.id}`}
                className="subject-card"
              >
                <div className="subject-icon" style={{ background: `${color}15`, color }}>
                  <Icon size={24} />
                </div>
                <div className="subject-info">
                  <h4>{subject.displayName}</h4>
                  <p>{subject.completedTopics}/{subject.totalTopics} topics</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${subject.progress}%`, background: color }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/doubts" className="action-card">
            <div className="action-icon" style={{ background: '#FEE2E2', color: '#EF4444' }}>
              <HelpCircle size={24} />
            </div>
            <span>Ask Doubt</span>
          </Link>
          <Link to="/quizzes" className="action-card">
            <div className="action-icon" style={{ background: '#DBEAFE', color: '#3B82F6' }}>
              <FileText size={24} />
            </div>
            <span>Take Quiz</span>
          </Link>
          <Link to="/study-plan" className="action-card">
            <div className="action-icon" style={{ background: '#DCFCE7', color: '#22C55E' }}>
              <Calendar size={24} />
            </div>
            <span>Study Plan</span>
          </Link>
          <Link to="/progress" className="action-card">
            <div className="action-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
              <TrendingUp size={24} />
            </div>
            <span>Progress</span>
          </Link>
        </div>
      </section>

      {/* Today's Plan */}
      {todayPlan?.todayItems?.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <h2>Today's Plan</h2>
            <Link to="/study-plan" className="see-all">View All</Link>
          </div>
          <div className="today-items">
            {todayPlan.todayItems.slice(0, 3).map((item: any) => (
              <div key={item.id} className="today-item">
                <div className="today-item-status">
                  {item.status === 'completed' ? (
                    <div className="status-done">✓</div>
                  ) : (
                    <div className="status-pending" />
                  )}
                </div>
                <div className="today-item-content">
                  <h4>{item.topic?.topicTitle || 'Topic'}</h4>
                  <p>{item.topic?.chapter?.chapterTitle || 'Chapter'}</p>
                </div>
                <span className="today-item-time">{item.estimatedMinutes}m</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default Dashboard;
