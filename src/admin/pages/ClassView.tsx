/**
 * View Class Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Loader2, GraduationCap, Users, BookOpen,
  Calendar, AlertCircle, X, Clock, CheckCircle, XCircle, Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getClassById, deleteClass } from '../../services/api/admin';
import './AdminPages.css';

export function ClassView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [classData, setClassData] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchClass();
  }, [id]);

  const fetchClass = async () => {
    setLoading(true);
    try {
      const response = await getClassById(id!);
      if (response.success) setClassData(response.data);
    } catch (error) {
      toast.error('Failed to load class details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!classData) return;
    setDeleting(true);
    try {
      const response = await deleteClass(classData.id);
      if (response.success) {
        toast.success('Class deleted successfully');
        navigate('/admin/classes');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete class');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return <div className="admin-page"><div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div></div>;
  }

  if (!classData) {
    return (
      <div className="admin-page">
        <div className="not-found-container">
          <AlertCircle size={64} />
          <h2>Class Not Found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/admin/classes')}><ArrowLeft size={16} /> Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/classes')}><ArrowLeft size={20} /></button>
          <div>
            <h1>Class Details</h1>
            <p>View class information</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/admin/classes/${classData.id}/edit`)}><Edit2 size={16} /> Edit</button>
          <button className="btn btn-danger-outline" onClick={() => setShowDeleteModal(true)}><Trash2 size={16} /> Delete</button>
        </div>
      </div>

      <div className="view-page-container">
        <div className="view-card view-card-main">
          <div className="view-card-hero">
            <div className="view-hero-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
              <GraduationCap size={32} />
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{classData.className}</h2>
                <span className={`status-badge-lg ${classData.isActive ? 'success' : 'inactive'}`}>
                  {classData.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                </span>
              </div>
              {classData.displayName && <p className="view-hero-subtitle">{classData.displayName}</p>}
              {classData.board && (
                <div className="view-hero-location">
                  <BookOpen size={14} />
                  <span>{classData.board.name} - {classData.board.fullName}</span>
                </div>
              )}
            </div>
          </div>

          <div className="view-stats-row">
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}><Users size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value">{classData.studentCount || 0}</span>
                <span className="view-stat-label">Students</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#F9731615', color: '#F97316' }}><BookOpen size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value">{classData.subjectCount || 0}</span>
                <span className="view-stat-label">Subjects</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}><Hash size={20} /></div>
              <div className="view-stat-content">
                <span className="view-stat-value">{classData.displayOrder}</span>
                <span className="view-stat-label">Order</span>
              </div>
            </div>
          </div>

          {classData.description && (
            <div className="view-section">
              <h3 className="view-section-title">Description</h3>
              <p className="view-description">{classData.description}</p>
            </div>
          )}
        </div>

        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Information</h3>
          <div className="view-meta-list">
            <div className="view-meta-item">
              <span className="view-meta-label"><Calendar size={14} /> Created</span>
              <span className="view-meta-value">{formatDate(classData.createdAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label"><Clock size={14} /> Updated</span>
              <span className="view-meta-value">{formatDateTime(classData.updatedAt)}</span>
            </div>
          </div>
          <div className="view-actions-section">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/admin/classes/${classData.id}/edit`)}>
              <Edit2 size={16} /> Edit Class
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Class</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>Delete <strong>"{classData.className}"</strong>?</p>
              </div>
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

export default ClassView;
