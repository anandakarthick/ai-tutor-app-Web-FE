/**
 * Add Class Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import { createClass, getBoards } from '../../services/api/admin';
import './AdminPages.css';

export function ClassAdd() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [boards, setBoards] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    className: '',
    displayName: '',
    description: '',
    boardId: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await getBoards();
      if (response.success) setBoards(response.data);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.className) {
      toast.error('Class name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await createClass(formData);
      if (response.success) {
        toast.success('Class created successfully');
        navigate('/admin/classes');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create class');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/classes')}><ArrowLeft size={20} /></button>
          <div>
            <h1>Add New Class</h1>
            <p>Create a new class or grade level</p>
          </div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h2>Class Information</h2>
              <p>Enter the details for the new class</p>
            </div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Details</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Class Name <span className="required">*</span></label>
                  <input
                    type="text"
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    placeholder="e.g., Class 10, Grade 12"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g., Class X, 10th Standard"
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Board</label>
                  <select
                    value={formData.boardId}
                    onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                  >
                    <option value="">Select Board</option>
                    {boards.map((board: any) => (
                      <option key={board.id} value={board.id}>{board.name} - {board.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description about this class..."
                  rows={3}
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Status</h3>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text">
                    <strong>Active Status</strong>
                    <small>Class will be available for student enrollment</small>
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
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/classes')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spinner" /> Creating...</> : <><Save size={16} /> Create Class</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClassAdd;
