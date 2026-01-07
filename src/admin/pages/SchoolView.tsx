/**
 * View School Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Loader2, School, Users, MapPin, Mail, Phone,
  Calendar, AlertCircle, X, Clock, CheckCircle, XCircle, User,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSchoolById, deleteSchool } from '../../services/api/admin';
import './AdminPages.css';

interface SchoolData {
  id: string;
  schoolName: string;
  city: string;
  state: string;
  address?: string;
  pincode?: string;
  contactEmail?: string;
  contactPhone?: string;
  principalName?: string;
  studentCount?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function SchoolView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchSchool();
  }, [id]);

  const fetchSchool = async () => {
    setLoading(true);
    try {
      const response = await getSchoolById(id!);
      if (response.success && response.data) {
        setSchool(response.data);
      }
    } catch (error) {
      toast.error('Failed to load school details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!school) return;
    setDeleting(true);
    try {
      const response = await deleteSchool(school.id);
      if (response.success) {
        toast.success('School deleted successfully');
        navigate('/admin/schools');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete school');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading school details...</p>
        </div>
      </div>
    );
  }

  if (!school) {
    return (
      <div className="admin-page">
        <div className="not-found-container">
          <AlertCircle size={64} />
          <h2>School Not Found</h2>
          <p>The school you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/schools')}>
            <ArrowLeft size={16} /> Back to Schools
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/schools')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>School Details</h1>
            <p>View school information</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/admin/schools/${school.id}/edit`)}>
            <Edit2 size={16} /> Edit
          </button>
          <button className="btn btn-danger-outline" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      <div className="view-page-container">
        <div className="view-card view-card-main">
          <div className="view-card-hero">
            <div className="view-hero-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
              <School size={32} />
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{school.schoolName}</h2>
                <span className={`status-badge-lg ${school.isActive ? 'success' : 'inactive'}`}>
                  {school.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                </span>
              </div>
              <div className="view-hero-location">
                <MapPin size={14} />
                <span>{school.city}, {school.state}</span>
              </div>
            </div>
          </div>

          <div className="view-stats-row">
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
                <Users size={20} />
              </div>
              <div className="view-stat-content">
                <span className="view-stat-value">{school.studentCount || 0}</span>
                <span className="view-stat-label">Students</span>
              </div>
            </div>
          </div>

          {school.principalName && (
            <div className="view-section">
              <h3 className="view-section-title">Principal</h3>
              <div className="view-info-grid">
                <div className="view-info-item">
                  <span className="view-info-label">Name</span>
                  <span className="view-info-value">{school.principalName}</span>
                </div>
              </div>
            </div>
          )}

          {school.address && (
            <div className="view-section">
              <h3 className="view-section-title">Address</h3>
              <p className="view-description">
                {school.address}
                {school.pincode && <><br />Pincode: {school.pincode}</>}
              </p>
            </div>
          )}

          <div className="view-section">
            <h3 className="view-section-title">Contact</h3>
            <div className="view-info-grid">
              <div className="view-info-item">
                <span className="view-info-label">Email</span>
                <span className="view-info-value">{school.contactEmail || '-'}</span>
              </div>
              <div className="view-info-item">
                <span className="view-info-label">Phone</span>
                <span className="view-info-value">{school.contactPhone || '-'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Additional Information</h3>
          <div className="view-meta-list">
            <div className="view-meta-item">
              <span className="view-meta-label"><Calendar size={14} /> Created On</span>
              <span className="view-meta-value">{formatDate(school.createdAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label"><Clock size={14} /> Last Updated</span>
              <span className="view-meta-value">{formatDateTime(school.updatedAt)}</span>
            </div>
          </div>
          <div className="view-actions-section">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/admin/schools/${school.id}/edit`)}>
              <Edit2 size={16} /> Edit School
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete School</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>This will delete <strong>"{school.schoolName}"</strong> and all associated data.</p>
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

export default SchoolView;
