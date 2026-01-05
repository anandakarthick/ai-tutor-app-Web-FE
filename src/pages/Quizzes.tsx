/**
 * Quizzes Page
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Target, ChevronRight, Trophy } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { quizzesApi } from '../services/api';
import './Pages.css';

export function Quizzes() {
  const { student } = useAuthStore();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      const response = await quizzesApi.getAll();
      if (response.success) {
        setQuizzes(response.data);
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

  if (loading) {
    return <div className="page-loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Quizzes</h1>
        <p>Test your knowledge with interactive quizzes</p>
      </header>

      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FileText size={32} /></div>
          <h3>No Quizzes Available</h3>
          <p>Quizzes will appear here as you progress through topics</p>
        </div>
      ) : (
        <div className="quiz-list">
          {quizzes.map((quiz) => (
            <Link key={quiz.id} to={`/quizzes/${quiz.id}`} className="quiz-item">
              <div className="quiz-icon">
                <FileText size={24} />
              </div>
              <div className="quiz-info">
                <h3>{quiz.quizTitle}</h3>
                <div className="quiz-meta">
                  <span><Target size={14} /> {quiz.totalQuestions} Questions</span>
                  <span><Clock size={14} /> {quiz.timeLimitMinutes || 15} min</span>
                  <span style={{ color: getDifficultyColor(quiz.difficultyLevel) }}>
                    {quiz.difficultyLevel}
                  </span>
                </div>
              </div>
              <ChevronRight size={20} className="quiz-arrow" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Quizzes;
