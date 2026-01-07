/**
 * Add Admin User Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Shield, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { createAdminUser } from '../../services/api/admin';
import './AdminPages.css';

export function AdminUserAdd() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Name, email, and password are required');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      const response = await createAdminUser(formData);
      if (response.success) {
        toast.success('Admin user created successfully');
        navigate('/admin/admin-users');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create admin user');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/admin-users')}><ArrowLeft size={20} /></button>
          <div><h1>Add Admin User</h1><p>Create a new administrator account</p></div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}><Shield size={24} /></div>
            <div><h2>Admin Information</h2><p>Enter admin account details</p></div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Personal Details</h3>
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Enter full name" required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="admin@example.com" required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Security</h3>
              <div className="form-group">
                <label>Password <span className="required">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Minimum 8 characters"
                    required
                    minLength={8}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Role & Access</h3>
              <div className="form-group">
                <label>Role <span className="required">*</span></label>
                <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
                <span className="form-hint">
                  {formData.role === 'super_admin' && 'Full access to all features'}
                  {formData.role === 'admin' && 'Access to most features except admin management'}
                  {formData.role === 'moderator' && 'Limited access to students and reports'}
                </span>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text"><strong>Active</strong><small>Can login and access admin panel</small></span>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="toggle-slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </div>

          <div className="form-card-footer">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/admin-users')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spinner" /> Creating...</> : <><Save size={16} /> Create Admin</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUserAdd;
