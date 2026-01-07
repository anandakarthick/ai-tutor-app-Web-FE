/**
 * Edit Student Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  Users,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getStudentById, updateStudent, getClasses, getBoards } from '../../services/api/admin';
import './AdminPages.css';

export function StudentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [boards, setBoards] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    studentName: '',
    classId: '',
    boardId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [studentRes, classesRes, boardsRes] = await Promise.all([
        getStudentById(id!),
        getClasses(),
        getBoards()
      ]);
      
      if (classesRes.success) setClasses(classesRes.data);
      if (boardsRes.success) setBoards(boardsRes.data);
      
      if (studentRes.success && studentRes.data) {
        const student = studentRes.data;
        setFormData({
          studentName: student.studentName || '',
          classId: student.class?.id || '',
          boardId: student.board?.id || '',
          isActive: student.isActive ?? true,
        });
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentName) {
      toast.error('Student name is required');
      return;
    }

    setSaving(true);
    try {
      const response = await updateStudent(id!, formData);
      if (response.success) {
        toast.success('Student updated successfully');
        navigate('/admin/students');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="admin-page">
        <div className="not-found-container">
          <AlertCircle size={64} />
          <h2>Student Not Found</h2>
          <p>The student you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/students')}>
            <ArrowLeft size={16} />
            Back to Students
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/students')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Edit Student</h1>
            <p>Update student information</p>
          </div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
              <Users size={24} />
            </div>
            <div>
              <h2>Student Information</h2>
              <p>Update the student details</p>
            </div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Details</h3>
              
              <div className="form-group">
                <label>Student Name <span className="required">*</span></label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="Enter student name"
                  required
                />
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
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <select
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls: any) => (
                      <option key={cls.id} value={cls.id}>{cls.className}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Status</h3>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text">
                    <strong>Active Status</strong>
                    <small>Student can access the platform when active</small>
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
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/students')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spinner" /> Saving...</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StudentEdit;
