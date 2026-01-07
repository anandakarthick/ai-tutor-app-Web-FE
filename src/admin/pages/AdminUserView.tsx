/**
 * View Admin User Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit2, Trash2, Loader2, Shield, Mail, Phone,
  Calendar, AlertCircle, X, Clock, CheckCircle, XCircle, Crown, UserCog,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminUserById, deleteAdminUser } from '../../services/api/admin';
import './AdminPages.css';

const roleColors: Record<string, string> = {
  super_admin: '#EF4444',
  admin: '#3B82F6',
  moderator: '#22C55E',
};

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  moderator: 'Moderator',
};

export function AdminUserView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchAdmin();
  }, [id]);

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const response = await getAdminUserById(id!);
      if (response.success) setAdmin(response.data);
    } catch (error) {
      toast.error('Failed to load admin details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!admin) return;
    setDeleting(true);
    try {
      const response = await deleteAdminUser(admin.id);
      if (response.success) {
        toast.success('Admin user deleted');
        navigate('/admin/admin-users');
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
  if (!admin) return <div className="admin-page"><div className="not-found-container"><AlertCircle size={64} /><h2>Not Found</h2><button className="btn btn-primary" onClick={() => navigate('/admin/admin-users')}><ArrowLeft size={16} /> Back</button></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/admin-users')}><ArrowLeft size={20} /></button>
          <div><h1>Admin Details</h1><p>View administrator information</p></div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/admin/admin-users/${admin.id}/edit`)}><Edit2 size={16} /> Edit</button>
          <button className="btn btn-danger-outline" onClick={() => setShowDeleteModal(true)}><Trash2 size={16} /> Delete</button>
        </div>
      </div>

      <div className="view-page-container">
        <div className="view-card view-card-main">
          <div className="view-card-hero">
            <div className="view-hero-icon" style={{ background: `linear-gradient(135deg, ${roleColors[admin.role]}, ${roleColors[admin.role]}99)` }}>
              {admin.role === 'super_admin' ? <Crown size={32} /> : <UserCog size={32} />}
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{admin.fullName}</h2>
                <span className={`status-badge-lg ${admin.isActive ? 'success' : 'inactive'}`}>
                  {admin.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                </span>
              </div>
              <p className="view-hero-subtitle">{admin.email}</p>
              <div className="view-hero-location">
                <span className="role-badge" style={{ background: `${roleColors[admin.role]}15`, color: roleColors[admin.role] }}>
                  {roleLabels[admin.role]}
                </span>
              </div>
            </div>
          </div>

          <div className="view-section">
            <h3 className="view-section-title">Contact Information</h3>
            <div className="view-info-grid">
              <div className="view-info-item">
                <span className="view-info-label">Email</span>
                <span className="view-info-value">{admin.email}</span>
              </div>
              <div className="view-info-item">
                <span className="view-info-label">Phone</span>
                <span className="view-info-value">{admin.phone || '-'}</span>
              </div>
            </div>
          </div>

          <div className="view-section">
            <h3 className="view-section-title">Role Permissions</h3>
            <div className="permissions-info">
              {admin.role === 'super_admin' && (
                <p>Full access to all features including admin user management, settings, and all data.</p>
              )}
              {admin.role === 'admin' && (
                <p>Access to students, schools, classes, subjects, reports, transactions, and plans management.</p>
              )}
              {admin.role === 'moderator' && (
                <p>Limited access to student management, reports viewing, and content moderation.</p>
              )}
            </div>
          </div>
        </div>

        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Account Information</h3>
          <div className="view-meta-list">
            <div className="view-meta-item">
              <span className="view-meta-label"><Clock size={14} /> Last Login</span>
              <span className="view-meta-value">{admin.lastLoginAt ? formatDateTime(admin.lastLoginAt) : 'Never'}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label"><Calendar size={14} /> Created</span>
              <span className="view-meta-value">{formatDate(admin.createdAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label"><Clock size={14} /> Updated</span>
              <span className="view-meta-value">{formatDateTime(admin.updatedAt)}</span>
            </div>
          </div>
          <div className="view-actions-section">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/admin/admin-users/${admin.id}/edit`)}>
              <Edit2 size={16} /> Edit Admin
            </button>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Admin</h2><button className="modal-close" onClick={() => setShowDeleteModal(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="delete-warning"><AlertCircle size={48} /><h3>Are you sure?</h3><p>Delete admin <strong>"{admin.fullName}"</strong>?</p></div>
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

export default AdminUserView;
