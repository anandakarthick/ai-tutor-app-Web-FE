/**
 * Progress Page
 */

import { useEffect, useState } from 'react';
import { TrendingUp, Flame, Star, Target, Clock, BookOpen, FileText, Trophy } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { progressApi, dashboardApi } from '../services/api';
import './Pages.css';

export function Progress() {
  const { student } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [dailyProgress, setDailyProgress] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.id) {
      loadProgress();
    }
  }, [student?.id]);

  const loadProgress = async () => {
    if (!student?.id) return;
    
    try {
      const [statsRes, dailyRes] = await Promise.all([
        dashboardApi.getStats(student.id),
        progressApi.getDaily(student.id, 7),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (dailyRes.success) setDailyProgress(dailyRes.data || []);
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (loading) {
    return <div className="page-loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Progress</h1>
        <p>Track your learning journey</p>
      </header>

      {/* Overall Stats */}
      <div className="progress-stats-grid">
        <div className="progress-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#FEE2E2' }}>
            <Flame size={24} color="#EF4444" />
          </div>
          <div>
            <h3>{stats?.student?.streakDays || student?.streakDays || 0}</h3>
            <p>Day Streak</p>
          </div>
        </div>
        <div className="progress-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#FEF3C7' }}>
            <Star size={24} color="#F59E0B" />
          </div>
          <div>
            <h3>{stats?.student?.xp?.toLocaleString() || student?.xp?.toLocaleString() || 0}</h3>
            <p>Total XP</p>
          </div>
        </div>
        <div className="progress-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#DCFCE7' }}>
            <Target size={24} color="#22C55E" />
          </div>
          <div>
            <h3>{stats?.overall?.completedTopics || 0}</h3>
            <p>Topics Completed</p>
          </div>
        </div>
        <div className="progress-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#DBEAFE' }}>
            <FileText size={24} color="#3B82F6" />
          </div>
          <div>
            <h3>{stats?.overall?.avgQuizScore || 0}%</h3>
            <p>Avg Quiz Score</p>
          </div>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="progress-section">
        <h2>This Week</h2>
        <div className="weekly-chart">
          {dailyProgress.length > 0 ? (
            dailyProgress.slice(0, 7).reverse().map((day, index) => {
              const maxMinutes = Math.max(...dailyProgress.map(d => d.totalStudyTimeMinutes || 0), 60);
              const height = Math.max(((day.totalStudyTimeMinutes || 0) / maxMinutes) * 100, 5);
              
              return (
                <div key={index} className="chart-bar-container">
                  <div className="chart-bar" style={{ height: `${height}%` }}>
                    <span className="chart-value">{day.totalStudyTimeMinutes || 0}m</span>
                  </div>
                  <span className="chart-label">{getDayName(day.date)}</span>
                </div>
              );
            })
          ) : (
            <p className="no-data">No activity this week. Start learning!</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="progress-section">
        <h2>Today's Activity</h2>
        <div className="today-stats">
          <div className="today-stat">
            <Clock size={20} color="#F97316" />
            <span>{stats?.today?.studyTimeMinutes || 0} min studied</span>
          </div>
          <div className="today-stat">
            <BookOpen size={20} color="#22C55E" />
            <span>{stats?.today?.topicsCompleted || 0} topics completed</span>
          </div>
          <div className="today-stat">
            <Star size={20} color="#F59E0B" />
            <span>{stats?.today?.xpEarned || 0} XP earned</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Progress;
