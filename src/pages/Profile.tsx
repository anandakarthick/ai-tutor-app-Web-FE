/**
 * Profile Page
 */

import { useState } from 'react';
import { User, Mail, Phone, School, BookOpen, Edit2, Save, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { studentsApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './Pages.css';

export function Profile() {
  const navigate = useNavigate();
  const { user, student, setStudent, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    studentName: student?.studentName || '',
    schoolName: (student as any)?.schoolName || '',
  });

  const handleSave = async () => {
    if (!student?.id) return;
    
    setSaving(true);
    try {
      const response = await studentsApi.update(student.id, formData);
      if (response.success) {
        setStudent(response.data);
        setEditing(false);
        toast.success('Profile updated!');
      }
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="page-container profile-page">
      <header className="page-header">
        <h1>Profile</h1>
        <p>Manage your account settings</p>
      </header>

      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {student?.studentName?.charAt(0) || user?.fullName?.charAt(0) || 'U'}
        </div>
        <div className="profile-info">
          <h2>{student?.studentName || user?.fullName}</h2>
          <p>{student?.class?.displayName} • {student?.board?.name}</p>
        </div>
        <button className="edit-btn" onClick={() => setEditing(!editing)}>
          {editing ? <X size={20} /> : <Edit2 size={20} />}
        </button>
      </div>

      {/* Edit Form */}
      {editing && (
        <div className="profile-form">
          <div className="form-group">
            <label>Student Name</label>
            <input
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>School Name</label>
            <input
              type="text"
              value={formData.schoolName}
              onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
            />
          </div>
          <button className="save-btn" onClick={handleSave} disabled={saving}>
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}

      {/* Details */}
      <div className="profile-details">
        <div className="detail-item">
          <User size={20} />
          <div>
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{user?.fullName}</span>
          </div>
        </div>
        <div className="detail-item">
          <Phone size={20} />
          <div>
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user?.phone}</span>
          </div>
        </div>
        {user?.email && (
          <div className="detail-item">
            <Mail size={20} />
            <div>
              <span className="detail-label">Email</span>
              <span className="detail-value">{user?.email}</span>
            </div>
          </div>
        )}
        <div className="detail-item">
          <School size={20} />
          <div>
            <span className="detail-label">Board & Class</span>
            <span className="detail-value">{student?.board?.fullName} - {student?.class?.displayName}</span>
          </div>
        </div>
        <div className="detail-item">
          <BookOpen size={20} />
          <div>
            <span className="detail-label">Medium</span>
            <span className="detail-value" style={{ textTransform: 'capitalize' }}>{student?.medium}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="profile-stats">
        <div className="profile-stat">
          <h3>{student?.xp?.toLocaleString() || 0}</h3>
          <p>Total XP</p>
        </div>
        <div className="profile-stat">
          <h3>Lv {student?.level || 1}</h3>
          <p>Level</p>
        </div>
        <div className="profile-stat">
          <h3>{student?.streakDays || 0}</h3>
          <p>Day Streak</p>
        </div>
      </div>

      {/* Logout */}
      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}

export default Profile;
