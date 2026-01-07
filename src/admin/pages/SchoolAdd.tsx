/**
 * Add School Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, School, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { createSchool } from '../../services/api/admin';
import './AdminPages.css';

export function SchoolAdd() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: '',
    city: '',
    state: '',
    address: '',
    pincode: '',
    contactEmail: '',
    contactPhone: '',
    principalName: '',
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.schoolName || !formData.city || !formData.state) {
      toast.error('School name, city, and state are required');
      return;
    }

    setSaving(true);
    try {
      const response = await createSchool(formData);
      if (response.success) {
        toast.success('School created successfully');
        navigate('/admin/schools');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create school');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/schools')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Add New School</h1>
            <p>Register a new school</p>
          </div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
              <School size={24} />
            </div>
            <div>
              <h2>School Information</h2>
              <p>Enter the details for the new school</p>
            </div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Details</h3>
              
              <div className="form-group">
                <label>School Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.schoolName}
                  onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                  placeholder="e.g., Delhi Public School"
                  required
                />
              </div>

              <div className="form-group">
                <label>Principal Name</label>
                <input
                  type="text"
                  value={formData.principalName}
                  onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                  placeholder="Enter principal's name"
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Location</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>City <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Chennai"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g., Tamil Nadu"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address of the school"
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Pincode</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="e.g., 600001"
                  maxLength={6}
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Contact Information</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    placeholder="school@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Status</h3>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text">
                    <strong>Active Status</strong>
                    <small>School will be available for student registration</small>
                  </span>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </div>

          <div className="form-card-footer">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/schools')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spinner" /> Creating...</> : <><Save size={16} /> Create School</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SchoolAdd;
