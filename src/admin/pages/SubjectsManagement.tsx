/**
 * Subjects Management Page
 */

import { useState } from 'react';
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
  Palette,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './AdminPages.css';

interface SubjectData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  classCount: number;
  status: 'active' | 'inactive';
}

const iconOptions = ['📐', '🧪', '📚', '🔤', '🌍', '💻', '🎨', '🎵', '⚽', '🧮'];
const colorOptions = ['#F97316', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#06B6D4'];

export function SubjectsManagement() {
  const [subjects, setSubjects] = useState<SubjectData[]>([
    { id: 'SUB001', name: 'mathematics', displayName: 'Mathematics', description: 'Numbers, algebra, geometry, and more', icon: '📐', color: '#F97316', classCount: 12, status: 'active' },
    { id: 'SUB002', name: 'science', displayName: 'Science', description: 'Physics, chemistry, and biology basics', icon: '🧪', color: '#22C55E', classCount: 8, status: 'active' },
    { id: 'SUB003', name: 'english', displayName: 'English', description: 'Grammar, literature, and communication', icon: '📚', color: '#3B82F6', classCount: 12, status: 'active' },
    { id: 'SUB004', name: 'hindi', displayName: 'Hindi', description: 'Hindi language and literature', icon: '🔤', color: '#8B5CF6', classCount: 10, status: 'active' },
    { id: 'SUB005', name: 'social_science', displayName: 'Social Science', description: 'History, geography, and civics', icon: '🌍', color: '#EC4899', classCount: 8, status: 'active' },
    { id: 'SUB006', name: 'physics', displayName: 'Physics', description: 'Advanced physics for higher classes', icon: '🧪', color: '#EF4444', classCount: 4, status: 'active' },
    { id: 'SUB007', name: 'chemistry', displayName: 'Chemistry', description: 'Advanced chemistry for higher classes', icon: '🧪', color: '#F59E0B', classCount: 4, status: 'active' },
    { id: 'SUB008', name: 'biology', displayName: 'Biology', description: 'Advanced biology for higher classes', icon: '🧪', color: '#06B6D4', classCount: 4, status: 'active' },
    { id: 'SUB009', name: 'computer_science', displayName: 'Computer Science', description: 'Programming and digital literacy', icon: '💻', color: '#3B82F6', classCount: 6, status: 'active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
  const [viewingSubject, setViewingSubject] = useState<SubjectData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    icon: '📐',
    color: '#F97316',
    status: 'active',
  });

  const filteredSubjects = subjects.filter(subject =>
    subject.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({ name: '', displayName: '', description: '', icon: '📐', color: '#F97316', status: 'active' });
    setShowModal(true);
  };

  const handleEditSubject = (subject: SubjectData) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      displayName: subject.displayName,
      description: subject.description,
      icon: subject.icon,
      color: subject.color,
      status: subject.status,
    });
    setShowModal(true);
  };

  const handleViewSubject = (subject: SubjectData) => {
    setViewingSubject(subject);
    setShowViewModal(true);
  };

  const handleSaveSubject = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...s, ...formData } 
          : s
      ));
    } else {
      const newSubject: SubjectData = {
        id: `SUB${String(subjects.length + 1).padStart(3, '0')}`,
        ...formData,
        classCount: 0,
        status: formData.status as 'active' | 'inactive',
      };
      setSubjects([...subjects, newSubject]);
    }
    setShowModal(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subjects Management</h1>
          <p>Manage subjects and their configurations</p>
        </div>
        <div className="header-actions">
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
            <p className="stat-title">Active Subjects</p>
            <h3 className="stat-value">{subjects.filter(s => s.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <Palette size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Mappings</p>
            <h3 className="stat-value">{subjects.reduce((acc, s) => acc + s.classCount, 0)}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <X size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Inactive</p>
            <h3 className="stat-value">{subjects.filter(s => s.status === 'inactive').length}</h3>
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
      </div>

      {/* Subjects Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Subjects ({filteredSubjects.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Color</th>
                <th>Classes</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map((subject) => (
                <tr key={subject.id}>
                  <td>
                    <span className="id-badge">{subject.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div 
                        className="user-avatar" 
                        style={{ 
                          background: `${subject.color}20`,
                          fontSize: '18px'
                        }}
                      >
                        {subject.icon}
                      </div>
                      <span className="user-name">{subject.displayName}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ maxWidth: '250px', display: 'block' }}>{subject.description}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        background: subject.color 
                      }} />
                      <span style={{ fontSize: '12px', color: 'var(--admin-text-muted)' }}>{subject.color}</span>
                    </div>
                  </td>
                  <td>
                    <span className="number-cell">{subject.classCount}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${subject.status}`}>
                      {subject.status}
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
            <p>Try adjusting your search criteria</p>
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
            <button className="pagination-btn">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Subject Modal */}
      {showViewModal && viewingSubject && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
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
                    background: `${viewingSubject.color}20`,
                    fontSize: '32px'
                  }}
                >
                  {viewingSubject.icon}
                </div>
                <h3>{viewingSubject.displayName}</h3>
                <span className={`status-badge ${viewingSubject.status}`}>{viewingSubject.status}</span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Subject ID</label>
                  <span>{viewingSubject.id}</span>
                </div>
                <div className="detail-item">
                  <label>Internal Name</label>
                  <span>{viewingSubject.name}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description</label>
                  <span>{viewingSubject.description}</span>
                </div>
                <div className="detail-item">
                  <label>Icon</label>
                  <span style={{ fontSize: '24px' }}>{viewingSubject.icon}</span>
                </div>
                <div className="detail-item">
                  <label>Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '6px', 
                      background: viewingSubject.color 
                    }} />
                    <span>{viewingSubject.color}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <label>Classes Mapped</label>
                  <span className="highlight">{viewingSubject.classCount}</span>
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
          <div className="modal" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., mathematics"
                  />
                </div>
                <div className="form-group">
                  <label>Display Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter description"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Icon</label>
                  <div className="icon-picker">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, icon})}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Color</label>
                  <div className="color-picker">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${formData.color === color ? 'selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => setFormData({...formData, color})}
                      />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveSubject}>
                <Check size={14} />
                {editingSubject ? 'Save Changes' : 'Add Subject'}
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
                <span>This will affect all class mappings.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
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
