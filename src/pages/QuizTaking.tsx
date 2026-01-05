/**
 * Quiz Taking Page
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { quizzesApi } from '../services/api';
import toast from 'react-hot-toast';
import './Quiz.css';

export function QuizTaking() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { student } = useAuthStore();

  const [quiz, setQuiz] = useState<any>(null);
  const [attempt, setAttempt] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (quizId && student?.id) {
      loadQuizAndStart();
    }
  }, [quizId, student?.id]);

  useEffect(() => {
    if (timeLeft > 0 && !result) {
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft, result]);

  const loadQuizAndStart = async () => {
    if (!quizId || !student?.id) return;

    setLoading(true);
    try {
      // Load quiz
      const quizRes = await quizzesApi.getById(quizId);
      if (quizRes.success) {
        setQuiz(quizRes.data);
        setTimeLeft((quizRes.data.timeLimitMinutes || 15) * 60);
      }

      // Start attempt
      const attemptRes = await quizzesApi.startAttempt(quizId, student.id);
      if (attemptRes.success) {
        setAttempt(attemptRes.data);
      }
    } catch (error: any) {
      console.error('Failed to load quiz:', error);
      toast.error(error.response?.data?.message || 'Failed to load quiz');
      navigate('/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = async () => {
    if (!selectedAnswer || !attempt?.id) return;

    try {
      await quizzesApi.submitAnswer(attempt.id, currentQuestion.id, selectedAnswer, 0);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    }

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(answers[quiz.questions[currentIndex + 1]?.id] || null);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[quiz.questions[currentIndex - 1]?.id] || null);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!attempt?.id) return;

    setSubmitting(true);
    try {
      // Submit remaining answer if any
      if (selectedAnswer && currentQuestion) {
        await quizzesApi.submitAnswer(attempt.id, currentQuestion.id, selectedAnswer, 0);
      }

      // Submit quiz
      const response = await quizzesApi.submit(attempt.id);
      if (response.success) {
        setResult(response.data);
        toast.success(`Quiz completed! Score: ${response.data.percentage}%`);
      }
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="quiz-loading">
        <div className="loading-spinner"></div>
        <p>Loading quiz...</p>
      </div>
    );
  }

  // Show result
  if (result) {
    return (
      <div className="quiz-result-page">
        <div className="result-card">
          <div className={`result-icon ${result.isPassed ? 'passed' : 'failed'}`}>
            {result.isPassed ? <Trophy size={48} /> : <XCircle size={48} />}
          </div>
          <h1>{result.isPassed ? 'Congratulations!' : 'Keep Practicing!'}</h1>
          <p className="result-message">
            {result.isPassed
              ? 'You passed the quiz!'
              : 'You can do better next time!'}
          </p>

          <div className="result-stats">
            <div className="result-stat">
              <span className="stat-value">{result.percentage}%</span>
              <span className="stat-label">Score</span>
            </div>
            <div className="result-stat">
              <span className="stat-value">{result.correctAnswers}/{result.totalQuestions}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="result-stat">
              <span className="stat-value">+{result.xpEarned}</span>
              <span className="stat-label">XP Earned</span>
            </div>
          </div>

          <div className="result-actions">
            <button className="btn-primary" onClick={() => navigate('/quizzes')}>
              Back to Quizzes
            </button>
            <button className="btn-outline" onClick={() => navigate('/learn')}>
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz?.questions?.[currentIndex];
  if (!currentQuestion) return null;

  return (
    <div className="quiz-taking-page">
      {/* Header */}
      <header className="quiz-header">
        <button className="back-btn" onClick={() => navigate('/quizzes')}>
          <ArrowLeft size={20} />
        </button>
        <div className="quiz-info">
          <h1>{quiz?.quizTitle}</h1>
          <p>Question {currentIndex + 1} of {quiz?.questions?.length}</p>
        </div>
        <div className={`quiz-timer ${timeLeft < 60 ? 'warning' : ''}`}>
          <Clock size={18} />
          {formatTime(timeLeft)}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="quiz-progress">
        <div
          className="quiz-progress-fill"
          style={{ width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="question-container">
        <div className="question-text">
          <span className="question-number">Q{currentIndex + 1}.</span>
          {currentQuestion.questionText}
        </div>

        <div className="options-list">
          {currentQuestion.options?.map((option: string, index: number) => (
            <button
              key={index}
              className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
              onClick={() => handleSelectAnswer(option)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {selectedAnswer === option && <CheckCircle size={20} className="option-check" />}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="quiz-navigation">
        <button
          className="nav-btn prev"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        {currentIndex === quiz.questions.length - 1 ? (
          <button
            className="nav-btn submit"
            onClick={handleSubmitQuiz}
            disabled={submitting || !selectedAnswer}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button
            className="nav-btn next"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            Next
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      {/* Question Navigation Dots */}
      <div className="question-dots">
        {quiz.questions.map((_: any, idx: number) => (
          <button
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''} ${answers[quiz.questions[idx].id] ? 'answered' : ''}`}
            onClick={() => {
              setCurrentIndex(idx);
              setSelectedAnswer(answers[quiz.questions[idx].id] || null);
            }}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuizTaking;
