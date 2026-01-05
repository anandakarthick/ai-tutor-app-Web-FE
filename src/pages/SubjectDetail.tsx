/**
 * Subject Detail Page - Chapters List
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { contentApi } from '../services/api';
import './Learn.css';

export function SubjectDetail() {
  const { subjectId } = useParams();
  const { student } = useAuthStore();
  const [subject, setSubject] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subjectId) {
      loadSubjectData();
    }
  }, [subjectId]);

  const loadSubjectData = async () => {
    if (!subjectId) return;

    setLoading(true);
    try {
      // Get subject
      const subjectRes = await contentApi.subjects.getById(subjectId);
      if (subjectRes.success) {
        setSubject(subjectRes.data);
      }

      // Get books
      const booksRes = await contentApi.books.getBySubject(subjectId);
      if (booksRes.success && booksRes.data.length > 0) {
        setBooks(booksRes.data);
        
        // Get chapters from first book
        const chaptersRes = await contentApi.chapters.getByBook(booksRes.data[0].id, student?.id);
        if (chaptersRes.success) {
          setChapters(chaptersRes.data);
        }
      }
    } catch (error) {
      console.error('Failed to load subject:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="learn-page">
      <header className="learn-header">
        <Link to="/learn" className="back-link">
          <ArrowLeft size={20} />
          Back
        </Link>
        <h1>{subject?.displayName || 'Subject'}</h1>
        <p>{chapters.length} chapters available</p>
      </header>

      <div className="chapters-list">
        {chapters.map((chapter, index) => {
          const progress = chapter.progress || 0;
          const isCompleted = progress >= 100;
          
          return (
            <Link
              key={chapter.id}
              to={`/learn/chapter/${chapter.id}`}
              className={`chapter-item ${isCompleted ? 'completed' : ''}`}
            >
              <div className="chapter-number">
                {isCompleted ? <CheckCircle size={28} /> : index + 1}
              </div>
              <div className="chapter-info">
                <h3>{chapter.chapterTitle}</h3>
                <div className="chapter-meta">
                  <span><BookOpen size={15} /> {chapter.totalTopics || 3} topics</span>
                  <span><Clock size={15} /> {chapter.estimatedHours || 1}h</span>
                </div>
                <div className="chapter-progress-bar">
                  <div className="chapter-progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="chapter-arrow">
                <span className="chapter-progress-text">{Math.round(progress)}%</span>
                <ChevronRight size={22} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default SubjectDetail;
