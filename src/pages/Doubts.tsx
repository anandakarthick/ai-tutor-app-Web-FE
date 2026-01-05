/**
 * Doubts Page
 */

import { useEffect, useState } from 'react';
import { HelpCircle, Send, Loader2, MessageCircle, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { doubtsApi } from '../services/api';
import toast from 'react-hot-toast';
import './Pages.css';

export function Doubts() {
  const { student } = useAuthStore();
  const [doubts, setDoubts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedDoubt, setSelectedDoubt] = useState<any>(null);

  useEffect(() => {
    if (student?.id) {
      loadDoubts();
    }
  }, [student?.id]);

  const loadDoubts = async () => {
    if (!student?.id) return;
    try {
      const response = await doubtsApi.getAll({ studentId: student.id, limit: 20 });
      if (response.success) {
        setDoubts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load doubts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !student?.id) return;

    setSubmitting(true);
    try {
      const response = await doubtsApi.create({
        studentId: student.id,
        question: question.trim(),
      });
      
      if (response.success) {
        toast.success('Doubt submitted! AI is analyzing...');
        setQuestion('');
        setSelectedDoubt(response.data);
        loadDoubts();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit doubt');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="page-container doubts-page">
      <header className="page-header">
        <h1>Ask Doubt</h1>
        <p>Get instant AI-powered answers to your questions</p>
      </header>

      {/* Ask Form */}
      <form onSubmit={handleSubmit} className="doubt-form">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your doubt or question here..."
          rows={4}
        />
        <button type="submit" disabled={submitting || !question.trim()} className="submit-btn">
          {submitting ? <Loader2 size={20} className="spinner" /> : <Send size={20} />}
          Ask AI
        </button>
      </form>

      {/* Selected Doubt Answer */}
      {selectedDoubt && (
        <div className="doubt-answer-card">
          <div className="doubt-answer-header">
            <h3>Your Question</h3>
          </div>
          <p className="doubt-question">{selectedDoubt.question}</p>
          {selectedDoubt.aiAnswer && (
            <>
              <div className="doubt-answer-header">
                <h3>AI Answer</h3>
              </div>
              <div className="doubt-answer">{selectedDoubt.aiAnswer}</div>
            </>
          )}
          <button className="close-answer-btn" onClick={() => setSelectedDoubt(null)}>
            Close
          </button>
        </div>
      )}

      {/* Doubts History */}
      <div className="doubts-history">
        <h2>Recent Doubts</h2>
        {loading ? (
          <div className="page-loading"><div className="loading-spinner"></div></div>
        ) : doubts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><HelpCircle size={32} /></div>
            <h3>No Doubts Yet</h3>
            <p>Ask your first doubt and get instant AI answers!</p>
          </div>
        ) : (
          <div className="doubts-list">
            {doubts.map((doubt) => (
              <div
                key={doubt.id}
                className={`doubt-item ${doubt.aiAnswer ? 'answered' : ''}`}
                onClick={() => setSelectedDoubt(doubt)}
              >
                <div className="doubt-item-icon">
                  <MessageCircle size={20} />
                </div>
                <div className="doubt-item-content">
                  <p className="doubt-item-question">{doubt.question}</p>
                  <span className="doubt-item-time">
                    <Clock size={12} /> {formatDate(doubt.createdAt)}
                  </span>
                </div>
                <span className={`doubt-status ${doubt.status}`}>
                  {doubt.aiAnswer ? 'Answered' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Doubts;
