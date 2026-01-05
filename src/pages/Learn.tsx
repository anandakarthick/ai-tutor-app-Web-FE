/**
 * Learn Page - Subjects List
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, FlaskConical, BookOpen, Languages, Atom, TestTube, Dna, Globe, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { contentApi, progressApi } from '../services/api';
import './Learn.css';

const subjectIcons: Record<string, any> = {
  mathematics: Calculator, math: Calculator,
  science: FlaskConical, english: BookOpen,
  hindi: Languages, physics: Atom,
  chemistry: TestTube, biology: Dna,
  socialscience: Globe, 'social science': Globe,
  default: BookOpen,
};

const subjectColors: Record<string, string> = {
  mathematics: '#F97316', math: '#F97316',
  science: '#22C55E', english: '#8B5CF6',
  hindi: '#EC4899', physics: '#3B82F6',
  chemistry: '#14B8A6', biology: '#84CC16',
  socialscience: '#6366F1', 'social science': '#6366F1',
  default: '#6366F1',
};

export function Learn() {
  const { student } = useAuthStore();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.classId) {
      loadSubjects();
    }
  }, [student?.classId]);

  const loadSubjects = async () => {
    if (!student?.classId) return;
    
    setLoading(true);
    try {
      const response = await contentApi.subjects.getByClass(student.classId);
      if (response.success) {
        // Get progress
        const progressRes = await progressApi.getOverall(student.id, true);
        const subjectProgress = progressRes.data?.subjectProgress || [];
        
        const subjectsWithProgress = response.data.map((subject: any) => {
          const progress = subjectProgress.find((p: any) => p.subjectId === subject.id);
          return {
            ...subject,
            progress: Math.round(progress?.avgProgress || 0),
            completedTopics: progress?.completedTopics || 0,
            totalTopics: progress?.totalTopics || 0,
          };
        });
        setSubjects(subjectsWithProgress);
      }
    } catch (error) {
      console.error('Failed to load subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '');
    return subjectIcons[key] || subjectIcons.default;
  };

  const getColor = (name: string) => {
    const key = name.toLowerCase().replace(/\s+/g, '');
    return subjectColors[key] || subjectColors.default;
  };

  if (loading) {
    return (
      <div className="learn-loading">
        <div className="loading-spinner"></div>
        <p>Loading subjects...</p>
      </div>
    );
  }

  return (
    <div className="learn-page">
      <header className="learn-header">
        <h1>Learn</h1>
        <p>Choose a subject to start learning</p>
      </header>

      <div className="subjects-list">
        {subjects.map((subject) => {
          const Icon = getIcon(subject.subjectName);
          const color = getColor(subject.subjectName);
          
          return (
            <Link key={subject.id} to={`/learn/subject/${subject.id}`} className="subject-item">
              <div className="subject-item-icon" style={{ background: `${color}15`, color }}>
                <Icon size={28} />
              </div>
              <div className="subject-item-info">
                <h3>{subject.displayName}</h3>
                <p>{subject.completedTopics}/{subject.totalTopics} topics completed</p>
                <div className="subject-progress-bar">
                  <div className="subject-progress-fill" style={{ width: `${subject.progress}%`, background: color }} />
                </div>
              </div>
              <div className="subject-item-meta">
                <span className="subject-progress-text" style={{ color }}>{subject.progress}%</span>
                <ChevronRight size={20} className="subject-arrow" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Learn;
