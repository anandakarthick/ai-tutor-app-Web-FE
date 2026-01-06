/**
 * Quizzes Page - Dashboard Style
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  Target,
  ChevronRight,
  Trophy,
  Award,
  CheckCircle,
  TrendingUp,
  Zap,
  Star,
  Play,
  BarChart3,
  Brain,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { quizzesApi, dashboardApi } from '../services/api';
import './Quizzes.css';

export function Quizzes() {
  const { student } = useAuthStore();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    loadData();
  }, [student?.id]);

  const loadData = async () => {
    try {
      const [quizzesRes, statsRes] = await Promise.all([
        quizzesApi.getAll(),
        student?.id ? dashboardApi.getStats(student.id) : Promise.resolve({ success: false }),
      ]);

      if (quizzesRes.success) {
        setQuizzes(quizzesRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (error) {
      console.error('Failed to load quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return '#22C55E';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      default: return '#6366F1';
    }
  };

  const getDifficultyBg = (level: string) => {
    switch (level) {
      case 'easy': return '#DCFCE7';
      case 'medium': return '#FEF3C7';
      case 'hard': return '#FEE2E2';
      default: return '#E0E7FF';
    }
  };

  const filteredQuizzes = filter === 'all' 
    ? quizzes 
    : quizzes.filter(q => q.difficultyLevel === filter);

  // Calculate quiz stats
  const totalQuizzes = quizzes.length;
  const completedQuizzes = stats?.quizzes?.completed || 0;
  const avgScore = stats?.quizzes?.avgScore || 0;
  const bestScore = stats?.quizzes?.bestScore || 0;

  if (loading) {
    return (
      <div className="quizzes-loading">
        <div className="loading-spinner"></div>
        <p>Loading quizzes...</p>
      </div>
    );
  }

  return (
    <div className="quizzes-dashboard">
      {/* Header */}
      <header className="quizzes-header">
        <div className="header-content">
          <h1>Quizzes</h1>
          <p>Test your knowledge and track your progress</p>
        </div>
        <div className="header-icon">
          <Brain size={48} />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="quizzes-stats">
        <div className="quiz-stat-card">
          <div className="stat-icon" style={{ background: '#DBEAFE' }}>
            <FileText size={24} color="#3B82F6" />
          </div>
          <div className="stat-content">
            <h3>{totalQuizzes}</h3>
            <p>Total Quizzes</p>
          </div>
        </div>
        <div className="quiz-stat-card">
          <div className="stat-icon" style={{ background: '#DCFCE7' }}>
            <CheckCircle size={24} color="#22C55E" />
          </div>
          <div className="stat-content">
            <h3>{completedQuizzes}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="quiz-stat-card">
          <div className="stat-icon" style={{ background: '#FEF3C7' }}>
            <TrendingUp size={24} color="#F59E0B" />
          </div>
          <div className="stat-content">
            <h3>{avgScore}%</h3>
            <p>Avg Score</p>
          </div>
        </div>
        <div className="quiz-stat-card">
          <div className="stat-icon" style={{ background: '#FEE2E2' }}>
            <Trophy size={24} color="#EF4444" />
          </div>
          <div className="stat-content">
            <h3>{bestScore}%</h3>
            <p>Best Score</p>
          </div>
        </div>
      </div>

      {/* Quick Start Card */}
      {quizzes.length > 0 && (
        <Link to={`/quizzes/${quizzes[0].id}`} className="quick-start-card">
          <div className="quick-start-content">
            <div className="quick-start-icon">
              <Play size={28} />
            </div>
            <div className="quick-start-text">
              <h3>Quick Start</h3>
              <p>Start {quizzes[0].quizTitle}</p>
            </div>
          </div>
          <div className="quick-start-meta">
            <span className="meta-item">
              <Target size={16} />
              {quizzes[0].totalQuestions} Questions
            </span>
            <ChevronRight size={24} className="arrow" />
          </div>
        </Link>
      )}

      {/* Filter Tabs */}
      <div className="filter-section">
        <h2>Available Quizzes</h2>
        <div className="filter-tabs">
          {(['all', 'easy', 'medium', 'hard'] as const).map((level) => (
            <button
              key={level}
              className={`filter-tab ${filter === level ? 'active' : ''}`}
              onClick={() => setFilter(level)}
              style={filter === level && level !== 'all' ? { 
                background: getDifficultyBg(level),
                color: getDifficultyColor(level),
                borderColor: getDifficultyColor(level),
              } : {}}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
              {level !== 'all' && (
                <span className="filter-count">
                  {quizzes.filter(q => q.difficultyLevel === level).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz List */}
      {filteredQuizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <FileText size={48} />
          </div>
          <h3>No Quizzes Found</h3>
          <p>
            {filter === 'all' 
              ? 'Quizzes will appear here as you progress through topics'
              : `No ${filter} quizzes available`}
          </p>
        </div>
      ) : (
        <div className="quiz-grid">
          {filteredQuizzes.map((quiz) => (
            <Link key={quiz.id} to={`/quizzes/${quiz.id}`} className="quiz-card">
              <div className="quiz-card-header">
                <div 
                  className="quiz-difficulty"
                  style={{ 
                    background: getDifficultyBg(quiz.difficultyLevel),
                    color: getDifficultyColor(quiz.difficultyLevel),
                  }}
                >
                  {quiz.difficultyLevel}
                </div>
                {quiz.completed && (
                  <div className="quiz-completed">
                    <CheckCircle size={18} />
                  </div>
                )}
              </div>
              
              <div className="quiz-card-icon">
                <FileText size={32} />
              </div>
              
              <h3 className="quiz-title">{quiz.quizTitle}</h3>
              
              <div className="quiz-card-meta">
                <span className="meta-item">
                  <Target size={14} />
                  {quiz.totalQuestions} Questions
                </span>
                <span className="meta-item">
                  <Clock size={14} />
                  {quiz.timeLimitMinutes || 15} min
                </span>
              </div>

              {quiz.lastScore !== undefined && (
                <div className="quiz-last-score">
                  <Star size={14} />
                  <span>Last: {quiz.lastScore}%</span>
                </div>
              )}

              <div className="quiz-card-action">
                <span>{quiz.completed ? 'Retake Quiz' : 'Start Quiz'}</span>
                <ChevronRight size={18} />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Achievement Section */}
      <section className="achievements-section">
        <h2>Quiz Achievements</h2>
        <div className="achievements-grid">
          <div className={`achievement-card ${completedQuizzes >= 1 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <Zap size={24} />
            </div>
            <h4>First Quiz</h4>
            <p>Complete your first quiz</p>
          </div>
          <div className={`achievement-card ${completedQuizzes >= 5 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <Award size={24} />
            </div>
            <h4>Quiz Master</h4>
            <p>Complete 5 quizzes</p>
          </div>
          <div className={`achievement-card ${bestScore >= 100 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <Trophy size={24} />
            </div>
            <h4>Perfect Score</h4>
            <p>Get 100% on any quiz</p>
          </div>
          <div className={`achievement-card ${avgScore >= 80 ? 'unlocked' : ''}`}>
            <div className="achievement-icon">
              <BarChart3 size={24} />
            </div>
            <h4>High Achiever</h4>
            <p>Maintain 80% average</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Quizzes;
