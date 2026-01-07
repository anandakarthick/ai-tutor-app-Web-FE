/**
 * Edit Admin User Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Shield, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminUserById, updateAdminUser } from '../../services/api/admin';
import './AdminPages.css';

export function AdminUserEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    role: 'admin',
    isActive: true,
  });

  useEffect(() => {
    fetchAdmin();
  }, [id]);

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const response = await getAdminUserById(id!);
      if (response.success && response.data) {
        const a = response.data;
        setFormData({
          fullName: a.fullName || '',
          email: a.email || '',
          phone: a.phone || '',
          password: '',
          role: a.role || 'admin',
          isActive: a.isActive ?? true,
        });
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast.error('Name and email are required');
      return;
    }
    if (formData.password && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    try {
      const updateData = { ...formData };
      if (!updateData.password) delete (updateData as any).password;
      
      const response = await updateAdminUser(id!, updateData);
      if (response.success) {
        toast.success('Admin user updated successfully');
        navigate('/admin/admin-users');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update admin user');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div></div>;
  if (notFound) return <div className="admin-page"><div className="not-found-container"><AlertCircle size={64} /><h2>Not Found</h2><button className="btn btn-primary" onClick={() => navigate('/admin/admin-users')}><ArrowLeft size={16} /> Back</button></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/admin-users')}><ArrowLeft size={20} /></button>
          <div><h1>Edit Admin User</h1><p>Update administrator account</p></div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #EF4444, #F87171)' }}><Shield size={24} /></div>
            <div><h2>Admin Information</h2><p>Update admin account details</p></div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Personal Details</h3>
              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Email <span className="required">*</span></label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Security</h3>
              <div className="form-group">
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Leave empty to keep current"
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <span className="form-hint">Leave empty to keep current password</span>
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
              {saving ? <><Loader2 size={16} className="spinner" /> Saving...</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminUserEdit;
