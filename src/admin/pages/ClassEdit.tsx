/**
 * Edit Class Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, GraduationCap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getClassById, updateClass, getBoards } from '../../services/api/admin';
import './AdminPages.css';

export function ClassEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
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
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [classRes, boardsRes] = await Promise.all([
        getClassById(id!),
        getBoards()
      ]);
      if (boardsRes.success) setBoards(boardsRes.data);
      if (classRes.success && classRes.data) {
        const cls = classRes.data;
        setFormData({
          className: cls.className || '',
          displayName: cls.displayName || '',
          description: cls.description || '',
          boardId: cls.board?.id || '',
          displayOrder: cls.displayOrder || 0,
          isActive: cls.isActive ?? true,
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
    if (!formData.className) {
      toast.error('Class name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await updateClass(id!, formData);
      if (response.success) {
        toast.success('Class updated successfully');
        navigate('/admin/classes');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update class');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="admin-page">
        <div className="not-found-container">
          <AlertCircle size={64} />
          <h2>Class Not Found</h2>
          <button className="btn btn-primary" onClick={() => navigate('/admin/classes')}><ArrowLeft size={16} /> Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/classes')}><ArrowLeft size={20} /></button>
          <div>
            <h1>Edit Class</h1>
            <p>Update class information</p>
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
              <p>Update the class details</p>
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
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Board</label>
                  <select value={formData.boardId} onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}>
                    <option value="">Select Board</option>
                    {boards.map((board: any) => (
                      <option key={board.id} value={board.id}>{board.name}</option>
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
                    <small>Class will be available for enrollment</small>
                  </span>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="toggle-slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </div>

          <div className="form-card-footer">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/classes')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spinner" /> Saving...</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClassEdit;
