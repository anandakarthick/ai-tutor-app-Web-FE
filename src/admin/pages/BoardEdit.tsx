/**
 * Edit Board Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  BookOpen,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBoardById, updateBoard } from '../../services/api/admin';
import './AdminPages.css';

export function BoardEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fullName: '',
    state: '',
    description: '',
    logoUrl: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    if (id) {
      fetchBoard();
    }
  }, [id]);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const response = await getBoardById(id!);
      if (response.success && response.data) {
        const board = response.data;
        setFormData({
          name: board.name || '',
          fullName: board.fullName || '',
          state: board.state || '',
          description: board.description || '',
          logoUrl: board.logoUrl || '',
          displayOrder: board.displayOrder || 0,
          isActive: board.isActive ?? true,
        });
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching board:', error);
      setNotFound(true);
      toast.error('Failed to load board details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.fullName) {
      toast.error('Name and Full Name are required');
      return;
    }

    setSaving(true);
    try {
      const response = await updateBoard(id!, formData);
      if (response.success) {
        toast.success('Board updated successfully');
        navigate('/admin/boards');
      }
    } catch (error: any) {
      console.error('Error updating board:', error);
      toast.error(error.response?.data?.message || 'Failed to update board');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading board details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="admin-page">
        <div className="not-found-container">
          <AlertCircle size={64} />
          <h2>Board Not Found</h2>
          <p>The board you're looking for doesn't exist or has been deleted.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/boards')}>
            <ArrowLeft size={16} />
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/boards')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Edit Board</h1>
            <p>Update board information for <strong>{formData.name}</strong></p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h2>Board Information</h2>
              <p>Update the details for this education board</p>
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
          </div>

          <div className="form-card-footer">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/boards')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 size={16} className="spinner" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BoardEdit;
