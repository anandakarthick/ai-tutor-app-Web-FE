/**
 * Edit Subject Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubjectById, updateSubject, getClasses } from '../../services/api/admin';
import './AdminPages.css';

const subjectIcons = ['📚', '🔬', '🧮', '🌍', '📖', '🎨', '💻', '🎵', '⚽', '🧪', '📐', '🔢'];
const subjectColors = ['#F97316', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#EAB308', '#06B6D4', '#EF4444'];

export function SubjectEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    subjectName: '',
    displayName: '',
    description: '',
    classId: '',
    icon: '📚',
    color: '#F97316',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectRes, classesRes] = await Promise.all([getSubjectById(id!), getClasses()]);
      if (classesRes.success) setClasses(classesRes.data);
      if (subjectRes.success && subjectRes.data) {
        const s = subjectRes.data;
        setFormData({
          subjectName: s.subjectName || '',
          displayName: s.displayName || '',
          description: s.description || '',
          classId: s.class?.id || '',
          icon: s.icon || '📚',
          color: s.color || '#F97316',
          displayOrder: s.displayOrder || 0,
          isActive: s.isActive ?? true,
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
    if (!formData.subjectName) {
      toast.error('Subject name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await updateSubject(id!, formData);
      if (response.success) {
        toast.success('Subject updated successfully');
        navigate('/admin/subjects');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update subject');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div></div>;
  if (notFound) return <div className="admin-page"><div className="not-found-container"><AlertCircle size={64} /><h2>Not Found</h2><button className="btn btn-primary" onClick={() => navigate('/admin/subjects')}><ArrowLeft size={16} /> Back</button></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/subjects')}><ArrowLeft size={20} /></button>
          <div><h1>Edit Subject</h1><p>Update subject information</p></div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: formData.color, fontSize: '24px' }}>{formData.icon}</div>
            <div><h2>Subject Information</h2><p>Update the subject details</p></div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Subject Name <span className="required">*</span></label>
                  <input type="text" value={formData.subjectName} onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input type="text" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Class</label>
                  <select value={formData.classId} onChange={(e) => setFormData({ ...formData, classId: e.target.value })}>
                    <option value="">Select Class</option>
                    {classes.map((cls: any) => <option key={cls.id} value={cls.id}>{cls.className}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} min="0" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Appearance</h3>
              <div className="form-group">
                <label>Icon</label>
                <div className="icon-picker">
                  {subjectIcons.map((icon) => (
                    <button key={icon} type="button" className={`icon-option ${formData.icon === icon ? 'selected' : ''}`} onClick={() => setFormData({ ...formData, icon })}>{icon}</button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Color</label>
                <div className="color-picker">
                  {subjectColors.map((color) => (
                    <button key={color} type="button" className={`color-option ${formData.color === color ? 'selected' : ''}`} style={{ background: color }} onClick={() => setFormData({ ...formData, color })} />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Status</h3>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text"><strong>Active Status</strong><small>Subject will be available</small></span>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="toggle-slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </div>

          <div className="form-card-footer">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/subjects')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spinner" /> Saving...</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubjectEdit;
