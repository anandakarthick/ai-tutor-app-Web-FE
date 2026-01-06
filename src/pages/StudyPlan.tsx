/**
 * Study Plan Page - Dashboard Style with Create Feature
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  ChevronRight,
  Plus,
  Target,
  Zap,
  BookOpen,
  X,
  Loader2,
  CalendarDays,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { studyPlansApi, dashboardApi, contentApi } from '../services/api';
import toast from 'react-hot-toast';
import './StudyPlan.css';

interface StudyPlanItem {
  id: string;
  topicId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  scheduledDate: string;
  estimatedMinutes: number;
  topic?: {
    topicTitle: string;
    chapter?: {
      chapterTitle: string;
      book?: {
        subject?: {
          subjectName: string;
        };
      };
    };
  };
}

interface StudyPlan {
  id: string;
  planTitle?: string;
  status: string;
  startDate: string;
  endDate: string;
  dailyHours?: number;
  items?: StudyPlanItem[];
}

export function StudyPlan() {
  const navigate = useNavigate();
  const { student } = useAuthStore();
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [planItems, setPlanItems] = useState<StudyPlanItem[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);
  
  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dailyHours, setDailyHours] = useState('2');
  const [targetExam, setTargetExam] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (student?.id) {
      loadData();
    }
  }, [student?.id]);

  useEffect(() => {
    if (studyPlans.length > 0 && !selectedPlan) {
      const activePlan = studyPlans.find(p => p.status === 'active') || studyPlans[0];
      setSelectedPlan(activePlan);
    }
  }, [studyPlans, selectedPlan]);

  useEffect(() => {
    if (selectedPlan) {
      loadPlanItems(selectedPlan.id);
    }
  }, [selectedPlan]);

  const loadData = async () => {
    if (!student?.id) return;
    
    try {
      const [plansRes, subjectsRes] = await Promise.all([
        studyPlansApi.getAll(student.id),
        student.classId ? contentApi.subjects.getByClass(student.classId) : Promise.resolve({ success: false, data: [] }),
      ]);

      if (plansRes.success) {
        setStudyPlans(plansRes.data || []);
      }
      if (subjectsRes.success) {
        setSubjects(subjectsRes.data || []);
      }
    } catch (error) {
      console.error('Failed to load study plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPlanItems = async (planId: string) => {
    try {
      setLoadingItems(true);
      const response = await studyPlansApi.getById(planId);
      if (response.success && response.data?.items) {
        setPlanItems(response.data.items);
      }
    } catch (error) {
      console.error('Failed to load plan items:', error);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleCompleteItem = async (itemId: string) => {
    try {
      const response = await studyPlansApi.completeItem(itemId);
      if (response.success) {
        setPlanItems(prev =>
          prev.map(item =>
            item.id === itemId ? { ...item, status: 'completed' as const } : item
          )
        );
        toast.success('Topic marked as complete! 🎉');
      }
    } catch (error) {
      toast.error('Failed to mark complete');
    }
  };

  const handleCreatePlan = async () => {
    if (!endDate) {
      toast.error('Please select an end date');
      return;
    }

    if (!student?.id) {
      toast.error('Student information not found');
      return;
    }

    setCreating(true);
    try {
      const response = await studyPlansApi.generate({
        studentId: student.id,
        subjectIds: selectedSubjects.length > 0 ? selectedSubjects : subjects.map(s => s.id),
        dailyHours: parseInt(dailyHours),
        targetExam: targetExam || undefined,
        startDate,
        endDate,
      });

      if (response.success) {
        toast.success('Study plan created successfully! 🎉');
        setShowCreateModal(false);
        setSelectedPlan(response.data);
        loadData();
        
        // Reset form
        setDailyHours('2');
        setTargetExam('');
        setEndDate('');
        setSelectedSubjects([]);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create study plan');
    } finally {
      setCreating(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectId)
        ? prev.filter(id => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Unscheduled';
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return '📅 Today';
    if (date.toDateString() === tomorrow.toDateString()) return '📆 Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in_progress': return '📖';
      case 'skipped': return '⏭️';
      default: return '⏳';
    }
  };

  const calculateProgress = () => {
    if (planItems.length === 0) return 0;
    const completed = planItems.filter(i => i.status === 'completed').length;
    return Math.round((completed / planItems.length) * 100);
  };

  // Group items by date
  const groupedItems = planItems.reduce((acc, item) => {
    const date = item.scheduledDate?.split('T')[0] || 'Unscheduled';
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {} as Record<string, StudyPlanItem[]>);

  if (loading) {
    return (
      <div className="studyplan-loading">
        <div className="loading-spinner"></div>
        <p>Loading study plans...</p>
      </div>
    );
  }

  return (
    <div className="studyplan-dashboard">
      {/* Header */}
      <header className="studyplan-header">
        <div className="header-content">
          <h1>Study Plan</h1>
          <p>Organize your learning journey</p>
        </div>
        <div className="header-icon">
          <CalendarDays size={48} />
        </div>
      </header>

      {/* Stats Grid */}
      <div className="studyplan-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#DBEAFE' }}>
            <Calendar size={24} color="#3B82F6" />
          </div>
          <div className="stat-content">
            <h3>{studyPlans.length}</h3>
            <p>Total Plans</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#DCFCE7' }}>
            <CheckCircle size={24} color="#22C55E" />
          </div>
          <div className="stat-content">
            <h3>{planItems.filter(i => i.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEF3C7' }}>
            <Target size={24} color="#F59E0B" />
          </div>
          <div className="stat-content">
            <h3>{calculateProgress()}%</h3>
            <p>Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#FEE2E2' }}>
            <Clock size={24} color="#EF4444" />
          </div>
          <div className="stat-content">
            <h3>{(selectedPlan?.dailyHours || 1) * 60}m</h3>
            <p>Daily Goal</p>
          </div>
        </div>
      </div>

      {studyPlans.length === 0 ? (
        /* Empty State */
        <div className="empty-state-card">
          <div className="empty-icon">
            <CalendarDays size={64} />
          </div>
          <h2>No Study Plans Yet</h2>
          <p>
            Create an AI-powered study plan to organize your learning journey
            and achieve your academic goals!
          </p>
          <button className="create-plan-btn" onClick={() => setShowCreateModal(true)}>
            <Plus size={20} />
            <span>Create Study Plan</span>
          </button>

          <div className="tips-box">
            <h4>💡 Benefits of Study Plans:</h4>
            <ul>
              <li>Personalized daily learning schedule</li>
              <li>AI-optimized for better results</li>
              <li>Track your progress easily</li>
              <li>Stay consistent with your goals</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Plan Selector */}
          <div className="plan-selector">
            {studyPlans.map(plan => (
              <button
                key={plan.id}
                className={`plan-tab ${selectedPlan?.id === plan.id ? 'active' : ''}`}
                onClick={() => setSelectedPlan(plan)}
              >
                <span className="plan-name">{plan.planTitle || 'Study Plan'}</span>
                <span className="plan-status">{plan.status}</span>
              </button>
            ))}
            <button className="plan-tab add-new" onClick={() => setShowCreateModal(true)}>
              <Plus size={18} />
              <span>New Plan</span>
            </button>
          </div>

          {/* Progress Card */}
          {selectedPlan && (
            <div className="progress-card">
              <div className="progress-header">
                <div className="progress-info">
                  <TrendingUp size={24} />
                  <div>
                    <h3>Today's Progress</h3>
                    <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="progress-percent">{calculateProgress()}%</div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${calculateProgress()}%` }} />
              </div>
              <div className="progress-stats">
                <span>✅ {planItems.filter(i => i.status === 'completed').length} / {planItems.length} topics</span>
                <span>⏱️ {(selectedPlan.dailyHours || 1) * 60} min/day</span>
              </div>
            </div>
          )}

          {/* Plan Items */}
          <div className="plan-items-section">
            <h2>Scheduled Topics</h2>
            
            {loadingItems ? (
              <div className="loading-items">
                <Loader2 size={24} className="spinner" />
                <span>Loading topics...</span>
              </div>
            ) : Object.keys(groupedItems).length > 0 ? (
              Object.entries(groupedItems).map(([date, items]) => (
                <div key={date} className="date-group">
                  <h3 className="date-header">{formatDate(date)}</h3>
                  <div className="items-list">
                    {items.map(item => (
                      <div key={item.id} className={`plan-item ${item.status}`}>
                        <div className="item-status">
                          <span className="status-emoji">{getStatusIcon(item.status)}</span>
                        </div>
                        <div 
                          className="item-content"
                          onClick={() => item.topicId && navigate(`/learn/topic/${item.topicId}`)}
                        >
                          <h4>{item.topic?.topicTitle || 'Topic'}</h4>
                          <p>
                            {item.topic?.chapter?.book?.subject?.subjectName || 'Subject'} • {item.estimatedMinutes || 30} min
                          </p>
                        </div>
                        {item.status !== 'completed' && (
                          <button
                            className="complete-btn"
                            onClick={() => handleCompleteItem(item.id)}
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-items">
                <CalendarDays size={48} />
                <h3>No topics scheduled</h3>
                <p>Topics will appear here when you create a plan</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Floating Action Button */}
      <button className="fab" onClick={() => setShowCreateModal(true)}>
        <Plus size={28} />
      </button>

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <Sparkles size={24} />
                <h2>Create Study Plan</h2>
              </div>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Daily Hours */}
              <div className="form-group">
                <label>Daily Study Hours</label>
                <div className="hours-selector">
                  {['1', '2', '3', '4', '5'].map(hour => (
                    <button
                      key={hour}
                      className={`hour-chip ${dailyHours === hour ? 'active' : ''}`}
                      onClick={() => setDailyHours(hour)}
                    >
                      {hour}h
                    </button>
                  ))}
                </div>
              </div>

              {/* Subjects */}
              {subjects.length > 0 && (
                <div className="form-group">
                  <label>Select Subjects (optional)</label>
                  <div className="subjects-selector">
                    {subjects.map(subject => (
                      <button
                        key={subject.id}
                        className={`subject-chip ${selectedSubjects.includes(subject.id) ? 'active' : ''}`}
                        onClick={() => toggleSubject(subject.id)}
                      >
                        <BookOpen size={16} />
                        <span>{subject.displayName || subject.subjectName}</span>
                      </button>
                    ))}
                  </div>
                  <p className="helper-text">Leave empty to include all subjects</p>
                </div>
              )}

              {/* Target Exam */}
              <div className="form-group">
                <label>Target Exam (optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Board Exams, JEE, NEET"
                  value={targetExam}
                  onChange={e => setTargetExam(e.target.value)}
                />
              </div>

              {/* Date Range */}
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    min={startDate}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="cancel-btn"
                onClick={() => setShowCreateModal(false)}
                disabled={creating}
              >
                Cancel
              </button>
              <button 
                className="generate-btn"
                onClick={handleCreatePlan}
                disabled={creating || !endDate}
              >
                {creating ? (
                  <>
                    <Loader2 size={18} className="spinner" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    <span>Generate Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyPlan;
