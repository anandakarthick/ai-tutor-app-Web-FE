/**
 * Subjects Management Page
 */

import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  GraduationCap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubjects, createSubject, updateSubject, deleteSubject, getClasses } from '../../services/api/admin';
import './AdminPages.css';

interface SubjectData {
  id: string;
  subjectName: string;
  displayName?: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
  class?: {
    id: string;
    className: string;
  };
}

interface ClassOption {
  id: string;
  className: string;
}

const subjectIcons = ['📚', '🔬', '🧮', '🌍', '📖', '🎨', '💻', '🎵', '⚽', '🧪'];
const subjectColors = ['#F97316', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#EAB308', '#06B6D4', '#EF4444'];

export function SubjectsManagement() {
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
  const [viewingSubject, setViewingSubject] = useState<SubjectData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [classFilter, statusFilter]);

  const fetchInitialData = async () => {
    try {
      const classesRes = await getClasses();
      if (classesRes.success) {
        setClasses(classesRes.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (classFilter !== 'all') filters.classId = classFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;

      const response = await getSubjects(filters);
      if (response.success) {
        setSubjects(response.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubjects = subjects.filter(subj =>
    subj.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subj.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({
      subjectName: '',
      displayName: '',
      description: '',
      classId: classes[0]?.id || '',
      icon: '📚',
      color: '#F97316',
      displayOrder: subjects.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditSubject = (subject: SubjectData) => {
    setEditingSubject(subject);
    setFormData({
      subjectName: subject.subjectName,
      displayName: subject.displayName || '',
      description: subject.description || '',
      classId: subject.class?.id || '',
      icon: subject.icon || '📚',
      color: subject.color || '#F97316',
      displayOrder: subject.displayOrder,
      isActive: subject.isActive,
    });
    setShowModal(true);
  };

  const handleViewSubject = (subject: SubjectData) => {
    setViewingSubject(subject);
    setShowViewModal(true);
  };

  const handleSaveSubject = async () => {
    if (!formData.subjectName) {
      toast.error('Please enter subject name');
      return;
    }

    setSaving(true);
    try {
      if (editingSubject) {
        const response = await updateSubject(editingSubject.id, formData);
        if (response.success) {
          toast.success('Subject updated successfully');
        }
      } else {
        const response = await createSubject(formData);
        if (response.success) {
          toast.success('Subject created successfully');
        }
      }
      setShowModal(false);
      fetchSubjects();
    } catch (error: any) {
      console.error('Error saving subject:', error);
      toast.error(error.response?.data?.message || 'Failed to save subject');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    try {
      const response = await deleteSubject(id);
      if (response.success) {
        toast.success('Subject deleted successfully');
        setShowDeleteConfirm(null);
        fetchSubjects();
      }
    } catch (error: any) {
      console.error('Error deleting subject:', error);
      toast.error(error.response?.data?.message || 'Failed to delete subject');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subjects Management</h1>
          <p>Manage subjects and curriculum</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchSubjects}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={handleAddSubject}>
            <Plus size={16} />
            Add Subject
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Subjects</p>
            <h3 className="stat-value">{subjects.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{subjects.filter(s => s.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <GraduationCap size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Classes</p>
            <h3 className="stat-value">{classes.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <AlertCircle size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Inactive</p>
            <h3 className="stat-value">{subjects.filter(s => !s.isActive).length}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.className}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Subjects Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Subjects ({filteredSubjects.length})</h3>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '60px 20px' }}>
            <Loader2 size={32} className="spinner" />
            <p>Loading subjects...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Class</th>
                    <th>Color</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubjects.map((subject) => (
                    <tr key={subject.id}>
                      <td>
                        <div className="user-cell">
                          <div 
                            className="user-avatar" 
                            style={{ 
                              background: `${subject.color || '#F97316'}20`, 
                              color: subject.color || '#F97316',
                              fontSize: '16px'
                            }}
                          >
                            {subject.icon || '📚'}
                          </div>
                          <div>
                            <span className="user-name">{subject.displayName || subject.subjectName}</span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)' }}>{subject.subjectName}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="plan-badge monthly">{subject.class?.className || '-'}</span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div 
                            style={{ 
                              width: '20px', 
                              height: '20px', 
                              borderRadius: '4px', 
                              background: subject.color || '#F97316' 
                            }} 
                          />
                          <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{subject.color}</span>
                        </div>
                      </td>
                      <td>
                        <span className="number-cell">{subject.displayOrder}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${subject.isActive ? 'active' : 'inactive'}`}>
                          {subject.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="table-action-btn view" 
                            title="View Details"
                            onClick={() => handleViewSubject(subject)}
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            className="table-action-btn edit" 
                            title="Edit"
                            onClick={() => handleEditSubject(subject)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            className="table-action-btn delete" 
                            title="Delete"
                            onClick={() => setShowDeleteConfirm(subject.id)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredSubjects.length === 0 && (
              <div className="empty-state">
                <BookOpen size={48} />
                <h3>No subjects found</h3>
                <p>Create your first subject</p>
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <span className="pagination-info">Showing 1-{filteredSubjects.length} of {subjects.length} subjects</span>
              <div className="pagination-buttons">
                <button className="pagination-btn" disabled>
                  <ChevronLeft size={14} />
                </button>
                <button className="pagination-btn active">1</button>
                <button className="pagination-btn" disabled>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Subject Modal */}
      {showViewModal && viewingSubject && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Subject Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div 
                  className="profile-avatar-large" 
                  style={{ 
                    background: `${viewingSubject.color || '#F97316'}20`, 
                    color: viewingSubject.color || '#F97316',
                    fontSize: '32px'
                  }}
                >
                  {viewingSubject.icon || '📚'}
                </div>
                <h3>{viewingSubject.displayName || viewingSubject.subjectName}</h3>
                <span className={`status-badge ${viewingSubject.isActive ? 'active' : 'inactive'}`}>
                  {viewingSubject.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Internal Name</label>
                  <span>{viewingSubject.subjectName}</span>
                </div>
                <div className="detail-item">
                  <label>Class</label>
                  <span>{viewingSubject.class?.className || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Icon</label>
                  <span>{viewingSubject.icon || '📚'}</span>
                </div>
                <div className="detail-item">
                  <label>Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: viewingSubject.color || '#F97316' }} />
                    <span>{viewingSubject.color}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Display Order</label>
                  <span>{viewingSubject.displayOrder}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description</label>
                  <span>{viewingSubject.description || '-'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowViewModal(false);
                handleEditSubject(viewingSubject);
              }}>
                <Edit2 size={14} />
                Edit Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Subject Name (Internal) <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.subjectName}
                    onChange={(e) => setFormData({...formData, subjectName: e.target.value})}
                    placeholder="e.g., mathematics"
                  />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div className="form-group">
                  <label>Class</label>
                  <select 
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.className}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input 
                    type="number" 
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <div className="icon-picker">
                    {subjectIcons.map((icon) => (
                      <button 
                        key={icon}
                        type="button"
                        className={`icon-option ${formData.icon === icon ? 'active' : ''}`}
                        onClick={() => setFormData({...formData, icon})}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <div className="color-picker">
                    {subjectColors.map((color) => (
                      <button 
                        key={color}
                        type="button"
                        className={`color-option ${formData.color === color ? 'active' : ''}`}
                        style={{ background: color }}
                        onClick={() => setFormData({...formData, color})}
                      />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveSubject} disabled={saving}>
                {saving ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
                {saving ? 'Saving...' : (editingSubject ? 'Save Changes' : 'Add Subject')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <div className="delete-icon">
                  <AlertCircle size={32} />
                </div>
                <p>Are you sure you want to delete this subject?</p>
                <span>Related content will be affected.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteSubject(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectsManagement;
