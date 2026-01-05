/**
 * Chapter Detail Page - Topics List
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, ChevronRight, CheckCircle, Play } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { contentApi } from '../services/api';
import './Learn.css';

export function ChapterDetail() {
  const { chapterId } = useParams();
  const { student } = useAuthStore();
  const [chapter, setChapter] = useState<any>(null);
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chapterId) {
      loadChapterData();
    }
  }, [chapterId]);

  const loadChapterData = async () => {
    if (!chapterId) return;

    setLoading(true);
    try {
      const chapterRes = await contentApi.chapters.getById(chapterId);
      if (chapterRes.success) {
        setChapter(chapterRes.data);
      }

      const topicsRes = await contentApi.topics.getByChapter(chapterId, student?.id);
      if (topicsRes.success) {
        setTopics(topicsRes.data);
      }
    } catch (error) {
      console.error('Failed to load chapter:', error);
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
    <div className="learn-page">
      <header className="learn-header">
        <Link to={`/learn/subject/${chapter?.book?.subjectId || ''}`} className="back-link">
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1>{chapter?.chapterTitle || 'Chapter'}</h1>
        <p>{topics.length} topics • {chapter?.estimatedHours || 1} hours</p>
      </header>

      <div className="topics-list">
        {topics.map((topic, index) => (
          <Link
            key={topic.id}
            to={`/learn/topic/${topic.id}`}
            className={`topic-item ${topic.isCompleted ? 'completed' : ''}`}
          >
            <div className="topic-status">
              {topic.isCompleted ? (
                <CheckCircle size={24} color="#22C55E" />
              ) : (
                <div className="topic-play">
                  <Play size={16} />
                </div>
              )}
            </div>
            <div className="topic-info">
              <h3>{topic.topicTitle}</h3>
              <div className="topic-meta">
                <span><Clock size={14} /> {topic.estimatedMinutes || 15} min</span>
                <span style={{ color: getDifficultyColor(topic.difficultyLevel) }}>
                  {topic.difficultyLevel}
                </span>
              </div>
            </div>
            <ChevronRight size={20} className="topic-arrow" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ChapterDetail;
