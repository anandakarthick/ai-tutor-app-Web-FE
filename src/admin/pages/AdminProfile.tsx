/**
 * Admin Profile Page
 */

import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Save,
  Eye,
  EyeOff,
  Loader2,
  Camera,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAdminStore } from '../store/adminStore';
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from '../../services/api/admin';
import './AdminPages.css';

export function AdminProfile() {
  const { admin, updateAdmin } = useAdminStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: '',
    profileImageUrl: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getAdminProfile();
      if (response.success && response.data) {
        setProfile({
          fullName: response.data.fullName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          role: response.data.role || '',
          profileImageUrl: response.data.profileImageUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Use store data as fallback
      if (admin) {
        setProfile({
          fullName: admin.name || '',
          email: admin.email || '',
          phone: '',
          role: admin.role || '',
          profileImageUrl: admin.avatar || '',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await updateAdminProfile({
        fullName: profile.fullName,
        phone: profile.phone,
        profileImageUrl: profile.profileImageUrl,
      });

      if (response.success) {
        toast.success('Profile updated successfully!');
        // Update store
        updateAdmin({ name: profile.fullName });
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setChangingPassword(true);
    try {
      const response = await changeAdminPassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (response.success) {
        toast.success('Password changed successfully!');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return { label: 'Super Admin', color: '#EF4444' };
      case 'admin':
        return { label: 'Admin', color: '#3B82F6' };
      case 'moderator':
        return { label: 'Moderator', color: '#22C55E' };
      default:
        return { label: role, color: '#6B7280' };
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(profile.role);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Profile Settings</h1>
          <p>Manage your account information</p>
        </div>
      </div>

      <div className="profile-page-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar-large" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                {profile.profileImageUrl ? (
                  <img src={profile.profileImageUrl} alt={profile.fullName} />
                ) : (
                  <User size={40} />
                )}
              </div>
              <button className="avatar-edit-btn">
                <Camera size={16} />
              </button>
            </div>
            <h3>{profile.fullName}</h3>
            <p>{profile.email}</p>
            <span 
              className="role-badge" 
              style={{ background: `${roleBadge.color}20`, color: roleBadge.color }}
            >
              <Shield size={12} />
              {roleBadge.label}
            </span>
          </div>
        </div>

        {/* Profile Form */}
        <div className="settings-content">
          <div className="settings-section">
            <h3>Personal Information</h3>
            <p>Update your personal details</p>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name <span>*</span></label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input 
                    type="text" 
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} />
                  <input 
                    type="email" 
                    value={profile.email}
                    disabled
                    className="disabled"
                  />
                </div>
                <span className="form-hint">Email cannot be changed</span>
              </div>
              
              <div className="form-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={16} />
                  <input 
                    type="tel" 
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Role</label>
                <div className="input-with-icon">
                  <Shield size={16} />
                  <input 
                    type="text" 
                    value={roleBadge.label}
                    disabled
                    className="disabled"
                  />
                </div>
                <span className="form-hint">Contact super admin to change role</span>
              </div>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
                {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="settings-section" style={{ marginTop: '24px' }}>
            <h3>Change Password</h3>
            <p>Update your password regularly for security</p>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Current Password <span>*</span></label>
                <div className="input-with-action">
                  <input 
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    placeholder="Enter current password"
                  />
                  <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>New Password <span>*</span></label>
                <div className="input-with-action">
                  <input 
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="Enter new password"
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <span className="form-hint">Minimum 8 characters</span>
              </div>
              
              <div className="form-group">
                <label>Confirm New Password <span>*</span></label>
                <div className="input-with-action">
                  <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '24px' }}>
              <button className="btn btn-outline" onClick={handleChangePassword} disabled={changingPassword}>
                {changingPassword ? <Loader2 size={16} className="spinner" /> : <Key size={16} />}
                {changingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
