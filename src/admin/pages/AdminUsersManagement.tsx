/**
 * Admin Users Management Page
 */

import { useState } from 'react';
import {
  Shield,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  UserCog,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Key,
  Calendar,
} from 'lucide-react';
import './AdminPages.css';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

const rolePermissions = {
  super_admin: ['all'],
  admin: ['students', 'schools', 'classes', 'subjects', 'reports', 'transactions', 'plans', 'settings'],
  moderator: ['students', 'reports', 'content'],
};

export function AdminUsersManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: 'ADM001', name: 'Super Admin', email: 'admin@aitutor.com', phone: '+91 98765 43210', role: 'super_admin', permissions: ['all'], status: 'active', lastLogin: '2024-12-01 10:30:00', createdAt: '2024-01-01' },
    { id: 'ADM002', name: 'Rahul Sharma', email: 'rahul.admin@aitutor.com', phone: '+91 98765 43211', role: 'admin', permissions: rolePermissions.admin, status: 'active', lastLogin: '2024-12-01 09:15:00', createdAt: '2024-02-15' },
    { id: 'ADM003', name: 'Priya Gupta', email: 'priya.admin@aitutor.com', phone: '+91 98765 43212', role: 'admin', permissions: rolePermissions.admin, status: 'active', lastLogin: '2024-11-30 16:45:00', createdAt: '2024-03-20' },
    { id: 'ADM004', name: 'Amit Kumar', email: 'amit.mod@aitutor.com', phone: '+91 98765 43213', role: 'moderator', permissions: rolePermissions.moderator, status: 'inactive', lastLogin: '2024-11-25 11:20:00', createdAt: '2024-04-10' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [viewingAdmin, setViewingAdmin] = useState<AdminUser | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin' as 'super_admin' | 'admin' | 'moderator',
    status: 'active',
  });

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         admin.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddAdmin = () => {
    setEditingAdmin(null);
    setFormData({ name: '', email: '', phone: '', password: '', role: 'admin', status: 'active' });
    setShowModal(true);
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      password: '',
      role: admin.role,
      status: admin.status,
    });
    setShowModal(true);
  };

  const handleViewAdmin = (admin: AdminUser) => {
    setViewingAdmin(admin);
    setShowViewModal(true);
  };

  const handleSaveAdmin = () => {
    if (editingAdmin) {
      setAdmins(admins.map(a => 
        a.id === editingAdmin.id 
          ? { ...a, ...formData, permissions: rolePermissions[formData.role] } 
          : a
      ));
    } else {
      const newAdmin: AdminUser = {
        id: `ADM${String(admins.length + 1).padStart(3, '0')}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        permissions: rolePermissions[formData.role],
        status: formData.status as 'active' | 'inactive',
        lastLogin: '-',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAdmins([...admins, newAdmin]);
    }
    setShowModal(false);
  };

  const handleDeleteAdmin = (id: string) => {
    const admin = admins.find(a => a.id === id);
    if (admin?.role === 'super_admin') {
      return; // Cannot delete super admin
    }
    setAdmins(admins.filter(a => a.id !== id));
    setShowDeleteConfirm(null);
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super_admin': return 'role-super';
      case 'admin': return 'role-admin';
      case 'moderator': return 'role-moderator';
      default: return '';
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Admin Users</h1>
          <p>Manage admin accounts and permissions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddAdmin}>
            <Plus size={16} />
            Add Admin
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <UserCog size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Admins</p>
            <h3 className="stat-value">{admins.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{admins.filter(a => a.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EF444415', color: '#EF4444' }}>
            <Shield size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Super Admins</p>
            <h3 className="stat-value">{admins.filter(a => a.role === 'super_admin').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <Key size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Moderators</p>
            <h3 className="stat-value">{admins.filter(a => a.role === 'moderator').length}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search admins..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
      </div>

      {/* Admins Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Admins ({filteredAdmins.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Admin</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Last Login</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    <span className="id-badge">{admin.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: admin.role === 'super_admin' ? 'linear-gradient(135deg, #EF4444, #F87171)' : admin.role === 'admin' ? 'linear-gradient(135deg, #3B82F6, #60A5FA)' : 'linear-gradient(135deg, #22C55E, #4ADE80)' }}>
                        <Shield size={16} />
                      </div>
                      <span className="user-name">{admin.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span><Mail size={12} /> {admin.email}</span>
                      <span><Phone size={12} /> {admin.phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(admin.role)}`}>
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="date-cell">{admin.lastLogin}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${admin.status}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="table-action-btn view" 
                        title="View Details"
                        onClick={() => handleViewAdmin(admin)}
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        className="table-action-btn edit" 
                        title="Edit"
                        onClick={() => handleEditAdmin(admin)}
                      >
                        <Edit2 size={15} />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <button 
                          className="table-action-btn delete" 
                          title="Delete"
                          onClick={() => setShowDeleteConfirm(admin.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAdmins.length === 0 && (
          <div className="empty-state">
            <UserCog size={48} />
            <h3>No admins found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredAdmins.length} of {admins.length} admins</span>
          <div className="pagination-buttons">
            <button className="pagination-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Admin Modal */}
      {showViewModal && viewingAdmin && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Admin Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large" style={{ background: viewingAdmin.role === 'super_admin' ? 'linear-gradient(135deg, #EF4444, #F87171)' : viewingAdmin.role === 'admin' ? 'linear-gradient(135deg, #3B82F6, #60A5FA)' : 'linear-gradient(135deg, #22C55E, #4ADE80)' }}>
                  <Shield size={28} />
                </div>
                <h3>{viewingAdmin.name}</h3>
                <span className={`role-badge ${getRoleBadgeClass(viewingAdmin.role)}`}>
                  {viewingAdmin.role.replace('_', ' ')}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Admin ID</label>
                  <span>{viewingAdmin.id}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{viewingAdmin.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{viewingAdmin.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className={`status-badge ${viewingAdmin.status}`}>{viewingAdmin.status}</span>
                </div>
                <div className="detail-item">
                  <label>Last Login</label>
                  <span>{viewingAdmin.lastLogin}</span>
                </div>
                <div className="detail-item">
                  <label>Created</label>
                  <span>{viewingAdmin.createdAt}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Permissions ({viewingAdmin.permissions.length})</label>
                  <div className="features-list" style={{ marginTop: '8px' }}>
                    {viewingAdmin.permissions.map((perm, index) => (
                      <span key={index} className="feature-tag">
                        <Check size={12} /> {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowViewModal(false);
                handleEditAdmin(viewingAdmin);
              }}>
                <Edit2 size={14} />
                Edit Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email <span>*</span></label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone"
                  />
                </div>
                <div className="form-group">
                  <label>{editingAdmin ? 'New Password' : 'Password'} {!editingAdmin && <span>*</span>}</label>
                  <div className="input-with-action">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder={editingAdmin ? 'Leave blank to keep current' : 'Enter password'}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Role <span>*</span></label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                  >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    {editingAdmin?.role === 'super_admin' && (
                      <option value="super_admin">Super Admin</option>
                    )}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="permissions-info">
                <h4>Role Permissions</h4>
                <ul>
                  {rolePermissions[formData.role].map((perm, index) => (
                    <li key={index}><Check size={12} /> {perm}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveAdmin}>
                <Check size={14} />
                {editingAdmin ? 'Save Changes' : 'Add Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <div className="delete-icon">
                  <AlertCircle size={32} />
                </div>
                <p>Are you sure you want to delete this admin?</p>
                <span>This action cannot be undone.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteAdmin(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersManagement;
