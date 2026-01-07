/**
 * Admin Users List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Search, Plus, Edit2, Trash2, Eye, X, AlertCircle,
  UserCog, Loader2, RefreshCw, CheckCircle, Crown, Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminUsers, deleteAdminUser } from '../../services/api/admin';
import './AdminPages.css';

interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

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

export function AdminUsersManagement() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, [roleFilter]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await getAdminUsers({ search: searchQuery, role: roleFilter || undefined });
      if (response.success) setAdmins(response.data);
    } catch (error) {
      toast.error('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAdmins();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await deleteAdminUser(id);
      if (response.success) {
        toast.success('Admin user deleted');
        setShowDeleteConfirm(null);
        fetchAdmins();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Admin Users</h1>
          <p>Manage administrator accounts</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchAdmins}><RefreshCw size={16} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/admin-users/add')}><Plus size={16} /> Add Admin</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}><Users size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Total Admins</p>
            <h3 className="stat-value">{admins.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EF444415', color: '#EF4444' }}><Crown size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Super Admins</p>
            <h3 className="stat-value">{admins.filter(a => a.role === 'super_admin').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}><CheckCircle size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{admins.filter(a => a.isActive).length}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); fetchAdmins(); }}><X size={16} /></button>}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="filter-row">
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-container">
        {loading ? (
          <div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div>
        ) : admins.length === 0 ? (
          <div className="empty-state">
            <Shield size={64} />
            <h3>No admin users found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/admin/admin-users/add')} style={{ marginTop: '16px' }}><Plus size={16} /> Add Admin</button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: roleColors[admin.role] }}>
                        {admin.role === 'super_admin' ? <Crown size={16} /> : <UserCog size={16} />}
                      </div>
                      <span className="user-name">{admin.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span>{admin.email}</span>
                      {admin.phone && <small>{admin.phone}</small>}
                    </div>
                  </td>
                  <td>
                    <span className="role-badge" style={{ background: `${roleColors[admin.role]}15`, color: roleColors[admin.role] }}>
                      {roleLabels[admin.role]}
                    </span>
                  </td>
                  <td>{admin.lastLoginAt ? formatDate(admin.lastLoginAt) : 'Never'}</td>
                  <td>
                    <span className={`status-badge ${admin.isActive ? 'success' : 'inactive'}`}>
                      {admin.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" onClick={() => navigate(`/admin/admin-users/${admin.id}`)}><Eye size={16} /></button>
                      <button className="action-btn edit" onClick={() => navigate(`/admin/admin-users/${admin.id}/edit`)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => setShowDeleteConfirm(admin.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Admin</h2><button className="modal-close" onClick={() => setShowDeleteConfirm(null)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="delete-warning"><AlertCircle size={48} /><h3>Are you sure?</h3><p>This will delete the admin account.</p></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)} disabled={deleting}>
                {deleting ? <><Loader2 size={16} className="spinner" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersManagement;
