/**
 * Add Board Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  BookOpen,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { createBoard } from '../../services/api/admin';
import './AdminPages.css';

export function BoardAdd() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    state: '',
    description: '',
    logoUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.fullName) {
      toast.error('Name and Full Name are required');
      return;
    }

    setSaving(true);
    try {
      const response = await createBoard(formData);
      if (response.success) {
        toast.success('Board created successfully');
        navigate('/admin/boards');
      }
    } catch (error: any) {
      console.error('Error creating board:', error);
      toast.error(error.response?.data?.message || 'Failed to create board');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/boards')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Add New Board</h1>
            <p>Create a new education board</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon">
              <BookOpen size={24} />
            </div>
            <div>
              <h2>Board Information</h2>
              <p>Enter the details for the new education board</p>
            </div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Details</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Board Code <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                    placeholder="e.g., CBSE, ICSE, TNSB"
                    required
                  />
                  <span className="form-hint">Short unique identifier for the board</span>
                </div>

                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    min="0"
                    placeholder="0"
                  />
                  <span className="form-hint">Order in which board appears in lists</span>
                </div>
              </div>

              <div className="form-group">
                <label>Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g., Central Board of Secondary Education"
                  required
                />
              </div>

              <div className="form-group">
                <label>State / Region</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g., Tamil Nadu, Maharashtra (leave empty for national boards)"
                />
                <span className="form-hint">Applicable for state-level boards only</span>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Additional Information</h3>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description about the education board, its history, and significance..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/board-logo.png"
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Status</h3>
              
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text">
                    <strong>Active Status</strong>
                    <small>Board will be visible and available for selection</small>
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

            <div className="info-box">
              <Info size={18} />
              <div>
                <strong>Note:</strong> After creating the board, you can add classes and subjects associated with this board from the respective management pages.
              </div>
            </div>
          </div>

          <div className="form-card-footer">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/boards')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Board
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardAdd;
