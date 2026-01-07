/**
 * View Plan Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Loader2, CreditCard, Users, Crown,
  Calendar, AlertCircle, X, Clock, CheckCircle, XCircle, Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPlanById, deletePlan } from '../../services/api/admin';
import './AdminPages.css';

export function PlanView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await getPlanById(id!);
      if (response.success) setPlan(response.data);
    } catch (error) {
      toast.error('Failed to load plan');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!plan) return;
    setDeleting(true);
    try {
      const response = await deletePlan(plan.id);
      if (response.success) {
        toast.success('Plan deleted');
        navigate('/admin/plans');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

  if (loading) return <div className="admin-page"><div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div></div>;
  if (!plan) return <div className="admin-page"><div className="not-found-container"><AlertCircle size={64} /><h2>Not Found</h2><button className="btn btn-primary" onClick={() => navigate('/admin/plans')}><ArrowLeft size={16} /> Back</button></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/plans')}><ArrowLeft size={20} /></button>
          <div><h1>Plan Details</h1><p>View plan information</p></div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}><Edit2 size={16} /> Edit</button>
          <button className="btn btn-danger-outline" onClick={() => setShowDeleteModal(true)}><Trash2 size={16} /> Delete</button>
        </div>
      </div>

      <div className="view-page-container">
        <div className="view-card view-card-main">
          <div className="view-card-hero">
            <div className="view-hero-icon" style={{ background: plan.isPopular ? 'linear-gradient(135deg, #F97316, #FB923C)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
              {plan.isPopular ? <Crown size={32} /> : <CreditCard size={32} />}
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{plan.planName}</h2>
                <span className={`status-badge-lg ${plan.isActive ? 'success' : 'inactive'}`}>
                  {plan.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                </span>
                {plan.isPopular && <span className="status-badge-lg" style={{ background: '#FEF3C7', color: '#92400E' }}><Crown size={14} /> Popular</span>}
              </div>
              <p className="view-hero-subtitle">{plan.displayName || plan.description || 'Subscription plan'}</p>
            </div>
          </div>

          <div className="view-stats-row">
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}><CreditCard size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value">{formatPrice(plan.price)}</span>
                <span className="view-stat-label">Price</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}><Calendar size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value">{plan.durationMonths}</span>
                <span className="view-stat-label">Months</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#F9731615', color: '#F97316' }}><Users size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value">{plan.subscriberCount || 0}</span>
                <span className="view-stat-label">Subscribers</span>
              </div>
            </div>
          </div>

          {plan.description && (
            <div className="view-section">
              <h3 className="view-section-title">Description</h3>
              <p className="view-description">{plan.description}</p>
            </div>
          )}

          {plan.features && plan.features.length > 0 && (
            <div className="view-section">
              <h3 className="view-section-title">Features</h3>
              <ul className="features-view-list">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index}><Check size={16} /><span>{feature}</span></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Information</h3>
          <div className="view-meta-list">
            {plan.originalPrice > plan.price && (
              <div className="view-meta-item">
                <span className="view-meta-label">Original Price</span>
                <span className="view-meta-value">{formatPrice(plan.originalPrice)}</span>
              </div>
            )}
            <div className="view-meta-item">
              <span className="view-meta-label">Display Order</span>
              <span className="view-meta-value">{plan.displayOrder}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label"><Calendar size={14} /> Created</span>
              <span className="view-meta-value">{formatDate(plan.createdAt)}</span>
            </div>
          </div>
          <div className="view-actions-section">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}>
              <Edit2 size={16} /> Edit Plan
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Plan</h2><button className="modal-close" onClick={() => setShowDeleteModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="delete-warning"><AlertCircle size={48} /><h3>Are you sure?</h3><p>Delete <strong>"{plan.planName}"</strong>?</p></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? <><Loader2 size={16} className="spinner" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanView;
