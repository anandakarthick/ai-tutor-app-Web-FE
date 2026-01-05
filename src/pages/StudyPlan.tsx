/**
 * Study Plan Page
 */

import { useEffect, useState } from 'react';
import { Calendar, Clock, CheckCircle, Circle, ChevronRight, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { studyPlansApi, dashboardApi } from '../services/api';
import toast from 'react-hot-toast';
import './Pages.css';

export function StudyPlan() {
  const { student } = useAuthStore();
  const [todayPlan, setTodayPlan] = useState<any>(null);
  const [studyPlans, setStudyPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (student?.id) {
      loadStudyPlans();
    }
  }, [student?.id]);

  const loadStudyPlans = async () => {
    if (!student?.id) return;
    
    try {
      const [todayRes, plansRes] = await Promise.all([
        dashboardApi.getToday(student.id),
        studyPlansApi.getAll(student.id),
      ]);

      if (todayRes.success) setTodayPlan(todayRes.data);
      if (plansRes.success) setStudyPlans(plansRes.data || []);
    } catch (error) {
      console.error('Failed to load study plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteItem = async (itemId: string) => {
    try {
      const response = await studyPlansApi.completeItem(itemId);
      if (response.success) {
        toast.success('Topic marked as complete!');
        loadStudyPlans();
      }
    } catch (error) {
      toast.error('Failed to mark complete');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  if (loading) {
    return <div className="page-loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Study Plan</h1>
        <p>Your personalized learning schedule</p>
      </header>

      {/* Today's Plan */}
      <section className="plan-section">
        <h2>Today's Plan</h2>
        {todayPlan?.todayItems?.length > 0 ? (
          <div className="plan-items">
            {todayPlan.todayItems.map((item: any) => (
              <div key={item.id} className={`plan-item ${item.status}`}>
                <button
                  className="plan-item-check"
                  onClick={() => item.status !== 'completed' && handleCompleteItem(item.id)}
                  disabled={item.status === 'completed'}
                >
                  {item.status === 'completed' ? (
                    <CheckCircle size={24} color="#22C55E" />
                  ) : (
                    <Circle size={24} color="#D6D3D1" />
                  )}
                </button>
                <div className="plan-item-info">
                  <h4>{item.topic?.topicTitle || 'Topic'}</h4>
                  <p>{item.topic?.chapter?.chapterTitle}</p>
                </div>
                <div className="plan-item-meta">
                  <span className="plan-time">
                    <Clock size={14} /> {item.estimatedMinutes}m
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={32} /></div>
            <h3>No Plan for Today</h3>
            <p>Create a study plan to organize your learning</p>
          </div>
        )}
      </section>

      {/* All Study Plans */}
      <section className="plan-section">
        <h2>Your Study Plans</h2>
        {studyPlans.length > 0 ? (
          <div className="study-plans-list">
            {studyPlans.map((plan) => (
              <div key={plan.id} className="study-plan-card">
                <div className="study-plan-header">
                  <h3>{plan.planTitle}</h3>
                  <span className={`plan-status ${plan.status}`}>{plan.status}</span>
                </div>
                <div className="study-plan-dates">
                  <span>{formatDate(plan.startDate)} - {formatDate(plan.endDate)}</span>
                </div>
                <div className="study-plan-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((plan.items?.filter((i: any) => i.status === 'completed').length || 0) / (plan.items?.length || 1)) * 100}%`,
                      }}
                    />
                  </div>
                  <span>{plan.items?.filter((i: any) => i.status === 'completed').length || 0}/{plan.items?.length || 0} completed</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"><Calendar size={32} /></div>
            <h3>No Study Plans</h3>
            <p>Create your first study plan to stay organized</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default StudyPlan;
