/**
 * Admin Users Management Page
 */

import { useState } from 'react';
import {
  UserCog,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Shield,
  Mail,
  Phone,
  Key,
  Eye,
  EyeOff,
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
  admin: ['students', 'schools', 'classes', 'subjects', 'plans', 'transactions', 'analytics', 'reports'],
  moderator: ['students', 'schools', 'reports'],
};

export function AdminUsersManagement() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    { id: '1', name: 'Super Admin', email: 'admin@aitutor.com', phone: '+91 98765 43210', role: 'super_admin', permissions: ['all'], status: 'active', lastLogin: '2024-12-01 10:30:00', createdAt: '2024-01-01' },
    { id: '2', name: 'John Doe', email: 'john@aitutor.com', phone: '+91 98765 43211', role: 'admin', permissions: rolePermissions.admin, status: 'active', lastLogin: '2024-12-01 09:15:00', createdAt: '2024-02-15' },
    { id: '3', name: 'Jane Smith', email: 'jane@aitutor.com', phone: '+91 98765 43212', role: 'moderator', permissions: rolePermissions.moderator, status: 'active', lastLogin: '2024-11-30 14:20:00', createdAt: '2024-03-20' },
    { id: '4', name: 'Mike Johnson', email: 'mike@aitutor.com', phone: '+91 98765 43213', role: 'admin', permissions: rolePermissions.admin, status: 'inactive', lastLogin: '2024-11-15 11:00:00', createdAt: '2024-04-10' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
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
                         admin.email.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleSaveAdmin = () => {
    if (editingAdmin) {
      setAdmins(admins.map(a => 
        a.id === editingAdmin.id 
          ? { 
              ...a, 
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              role: formData.role,
              permissions: rolePermissions[formData.role],
              status: formData.status as 'active' | 'inactive',
            } 
          : a
      ));
    } else {
      const newAdmin: AdminUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        permissions: rolePermissions[formData.role],
        status: formData.status as 'active' | 'inactive',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAdmins([...admins, newAdmin]);
    }
    setShowModal(false);
  };

  const handleDeleteAdmin = (id: string) => {
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
          <p>Manage administrator accounts and permissions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddAdmin}>
            <Plus size={18} />
            Add Admin
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Admins</p>
            <h3 className="stat-value">{admins.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <UserCog size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{admins.filter(a => a.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <Key size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Super Admins</p>
            <h3 className="stat-value">{admins.filter(a => a.role === 'super_admin').length}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
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

      {/* Admin Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Admin Users ({filteredAdmins.length})</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Admin</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Login</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdmins.map((admin) => (
              <tr key={admin.id}>
                <td>
                  <div className="admin-info">
                    <div className="admin-avatar">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="admin-name">{admin.name}</p>
                      <span className="admin-id">ID: {admin.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <span><Mail size={14} /> {admin.email}</span>
                    <span><Phone size={14} /> {admin.phone}</span>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${getRoleBadgeClass(admin.role)}`}>
                    {admin.role.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${admin.status}`}>
                    {admin.status}
                  </span>
                </td>
                <td className="date">{admin.lastLogin}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" title="Edit" onClick={() => handleEditAdmin(admin)}>
                      <Edit size={16} />
                    </button>
                    {admin.role !== 'super_admin' && (
                      <button 
                        className="action-btn danger" 
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(admin.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAdmin ? 'Edit Admin' : 'Add New Admin'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
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
                {!editingAdmin && (
                  <div className="form-group full-width">
                    <label>Password <span>*</span></label>
                    <div className="input-with-action">
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Enter password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label>Role <span>*</span></label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'super_admin' | 'admin' | 'moderator'})}
                  >
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                    <option value="super_admin">Super Admin</option>
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
                <h4>Role Permissions:</h4>
                <ul>
                  {rolePermissions[formData.role].map((perm, index) => (
                    <li key={index}><Check size={14} /> {perm === 'all' ? 'Full Access (All Permissions)' : perm}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveAdmin}>
                <Check size={18} />
                {editingAdmin ? 'Save Changes' : 'Add Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <AlertCircle size={48} color="#EF4444" />
                <p>Are you sure you want to delete this admin user? This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteAdmin(showDeleteConfirm)}>
                <Trash2 size={18} /> Delete Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminUsersManagement;
