/**
 * View Subject Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Loader2, BookOpen, GraduationCap,
  Calendar, AlertCircle, X, Clock, CheckCircle, XCircle, Hash, Palette,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubjectById, deleteSubject } from '../../services/api/admin';
import './AdminPages.css';

export function SubjectView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchSubject();
  }, [id]);

  const fetchSubject = async () => {
    setLoading(true);
    try {
      const response = await getSubjectById(id!);
      if (response.success) setSubject(response.data);
    } catch (error) {
      toast.error('Failed to load subject');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!subject) return;
    setDeleting(true);
    try {
      const response = await deleteSubject(subject.id);
      if (response.success) {
        toast.success('Subject deleted');
        navigate('/admin/subjects');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) return <div className="admin-page"><div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div></div>;
  if (!subject) return <div className="admin-page"><div className="not-found-container"><AlertCircle size={64} /><h2>Not Found</h2><button className="btn btn-primary" onClick={() => navigate('/admin/subjects')}><ArrowLeft size={16} /> Back</button></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/subjects')}><ArrowLeft size={20} /></button>
          <div><h1>Subject Details</h1><p>View subject information</p></div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/admin/subjects/${subject.id}/edit`)}><Edit2 size={16} /> Edit</button>
          <button className="btn btn-danger-outline" onClick={() => setShowDeleteModal(true)}><Trash2 size={16} /> Delete</button>
        </div>
      </div>

      <div className="view-page-container">
        <div className="view-card view-card-main">
          <div className="view-card-hero">
            <div className="view-hero-icon" style={{ background: subject.color || '#F97316', fontSize: '32px' }}>
              {subject.icon || '📚'}
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{subject.subjectName}</h2>
                <span className={`status-badge-lg ${subject.isActive ? 'success' : 'inactive'}`}>
                  {subject.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                </span>
              </div>
              {subject.displayName && <p className="view-hero-subtitle">{subject.displayName}</p>}
              {subject.class && (
                <div className="view-hero-location"><GraduationCap size={14} /><span>{subject.class.className}</span></div>
              )}
            </div>
          </div>

          <div className="view-stats-row">
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}><Hash size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value">{subject.displayOrder}</span>
                <span className="view-stat-label">Order</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: `${subject.color}15`, color: subject.color || '#F97316' }}><Palette size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value" style={{ fontSize: '14px' }}>{subject.color}</span>
                <span className="view-stat-label">Color</span>
              </div>
            </div>
          </div>

          {subject.description && (
            <div className="view-section">
              <h3 className="view-section-title">Description</h3>
              <p className="view-description">{subject.description}</p>
            </div>
          )}
        </div>

        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Information</h3>
          <div className="view-meta-list">
            <div className="view-meta-item">
              <span className="view-meta-label"><Calendar size={14} /> Created</span>
              <span className="view-meta-value">{formatDate(subject.createdAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label"><Clock size={14} /> Updated</span>
              <span className="view-meta-value">{formatDateTime(subject.updatedAt)}</span>
            </div>
          </div>
          <div className="view-actions-section">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/admin/subjects/${subject.id}/edit`)}>
              <Edit2 size={16} /> Edit Subject
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Subject</h2><button className="modal-close" onClick={() => setShowDeleteModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="delete-warning"><AlertCircle size={48} /><h3>Are you sure?</h3><p>Delete <strong>"{subject.subjectName}"</strong>?</p></div>
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

export default SubjectView;
