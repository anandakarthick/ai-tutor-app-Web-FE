/**
 * Classes Management Page
 */

import { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './AdminPages.css';

interface ClassData {
  id: string;
  name: string;
  displayName: string;
  board: string;
  description: string;
  studentCount: number;
  subjectCount: number;
  status: 'active' | 'inactive';
}

export function ClassesManagement() {
  const [classes, setClasses] = useState<ClassData[]>([
    { id: 'CLS001', name: 'class_1', displayName: 'Class 1', board: 'CBSE', description: 'Foundation level', studentCount: 856, subjectCount: 6, status: 'active' },
    { id: 'CLS002', name: 'class_2', displayName: 'Class 2', board: 'CBSE', description: 'Primary education', studentCount: 923, subjectCount: 6, status: 'active' },
    { id: 'CLS003', name: 'class_3', displayName: 'Class 3', board: 'CBSE', description: 'Primary education', studentCount: 1045, subjectCount: 7, status: 'active' },
    { id: 'CLS004', name: 'class_4', displayName: 'Class 4', board: 'CBSE', description: 'Primary education', studentCount: 987, subjectCount: 7, status: 'active' },
    { id: 'CLS005', name: 'class_5', displayName: 'Class 5', board: 'CBSE', description: 'Primary education', studentCount: 1123, subjectCount: 8, status: 'active' },
    { id: 'CLS006', name: 'class_6', displayName: 'Class 6', board: 'CBSE', description: 'Middle school', studentCount: 1234, subjectCount: 8, status: 'active' },
    { id: 'CLS007', name: 'class_7', displayName: 'Class 7', board: 'CBSE', description: 'Middle school', studentCount: 1156, subjectCount: 9, status: 'active' },
    { id: 'CLS008', name: 'class_8', displayName: 'Class 8', board: 'CBSE', description: 'Middle school', studentCount: 1289, subjectCount: 9, status: 'active' },
    { id: 'CLS009', name: 'class_9', displayName: 'Class 9', board: 'CBSE', description: 'Secondary education', studentCount: 1456, subjectCount: 10, status: 'active' },
    { id: 'CLS010', name: 'class_10', displayName: 'Class 10', board: 'CBSE', description: 'Board exam year', studentCount: 1678, subjectCount: 10, status: 'active' },
    { id: 'CLS011', name: 'class_11', displayName: 'Class 11', board: 'CBSE', description: 'Higher secondary', studentCount: 1234, subjectCount: 8, status: 'active' },
    { id: 'CLS012', name: 'class_12', displayName: 'Class 12', board: 'CBSE', description: 'Board exam year', studentCount: 1567, subjectCount: 8, status: 'active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    board: 'CBSE',
    description: '',
    status: 'active',
  });

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = boardFilter === 'all' || cls.board === boardFilter;
    return matchesSearch && matchesBoard;
  });

  const handleAddClass = () => {
    setEditingClass(null);
    setFormData({ name: '', displayName: '', board: 'CBSE', description: '', status: 'active' });
    setShowModal(true);
  };

  const handleEditClass = (cls: ClassData) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      displayName: cls.displayName,
      board: cls.board,
      description: cls.description,
      status: cls.status,
    });
    setShowModal(true);
  };

  const handleViewClass = (cls: ClassData) => {
    setViewingClass(cls);
    setShowViewModal(true);
  };

  const handleSaveClass = () => {
    if (editingClass) {
      setClasses(classes.map(c => 
        c.id === editingClass.id 
          ? { ...c, ...formData } 
          : c
      ));
    } else {
      const newClass: ClassData = {
        id: `CLS${String(classes.length + 1).padStart(3, '0')}`,
        ...formData,
        studentCount: 0,
        subjectCount: 0,
        status: formData.status as 'active' | 'inactive',
      };
      setClasses([...classes, newClass]);
    }
    setShowModal(false);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
  };

  const totalStudents = classes.reduce((acc, c) => acc + c.studentCount, 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Classes Management</h1>
          <p>Manage classes and grade levels</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddClass}>
            <Plus size={16} />
            Add Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <GraduationCap size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Classes</p>
            <h3 className="stat-value">{classes.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Classes</p>
            <h3 className="stat-value">{classes.filter(c => c.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <Users size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Students</p>
            <h3 className="stat-value">{totalStudents.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Subjects</p>
            <h3 className="stat-value">{classes.reduce((acc, c) => acc + c.subjectCount, 0)}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search classes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
          <option value="all">All Boards</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
          <option value="State Board">State Board</option>
        </select>
      </div>

      {/* Classes Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Classes ({filteredClasses.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Class Name</th>
                <th>Board</th>
                <th>Description</th>
                <th>Students</th>
                <th>Subjects</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClasses.map((cls) => (
                <tr key={cls.id}>
                  <td>
                    <span className="id-badge">{cls.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                        <GraduationCap size={16} />
                      </div>
                      <span className="user-name">{cls.displayName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="plan-badge monthly">{cls.board}</span>
                  </td>
                  <td>{cls.description}</td>
                  <td>
                    <span className="number-cell">{cls.studentCount.toLocaleString()}</span>
                  </td>
                  <td>
                    <span className="number-cell">{cls.subjectCount}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${cls.status}`}>
                      {cls.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="table-action-btn view" 
                        title="View Details"
                        onClick={() => handleViewClass(cls)}
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        className="table-action-btn edit" 
                        title="Edit"
                        onClick={() => handleEditClass(cls)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        className="table-action-btn delete" 
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(cls.id)}
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

        {filteredClasses.length === 0 && (
          <div className="empty-state">
            <GraduationCap size={48} />
            <h3>No classes found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredClasses.length} of {classes.length} classes</span>
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

      {/* View Class Modal */}
      {showViewModal && viewingClass && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Class Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                  <GraduationCap size={28} />
                </div>
                <h3>{viewingClass.displayName}</h3>
                <span className={`status-badge ${viewingClass.status}`}>{viewingClass.status}</span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Class ID</label>
                  <span>{viewingClass.id}</span>
                </div>
                <div className="detail-item">
                  <label>Internal Name</label>
                  <span>{viewingClass.name}</span>
                </div>
                <div className="detail-item">
                  <label>Board</label>
                  <span>{viewingClass.board}</span>
                </div>
                <div className="detail-item">
                  <label>Description</label>
                  <span>{viewingClass.description}</span>
                </div>
                <div className="detail-item">
                  <label>Total Students</label>
                  <span className="highlight">{viewingClass.studentCount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Total Subjects</label>
                  <span className="highlight">{viewingClass.subjectCount}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowViewModal(false);
                handleEditClass(viewingClass);
              }}>
                <Edit2 size={14} />
                Edit Class
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
              <h3>{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Class Name (Internal) <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., class_10"
                  />
                </div>
                <div className="form-group">
                  <label>Display Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="e.g., Class 10"
                  />
                </div>
                <div className="form-group">
                  <label>Board</label>
                  <select 
                    value={formData.board}
                    onChange={(e) => setFormData({...formData, board: e.target.value})}
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
                  </select>
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
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveClass}>
                <Check size={14} />
                {editingClass ? 'Save Changes' : 'Add Class'}
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
                <p>Are you sure you want to delete this class?</p>
                <span>This will also remove all subject mappings.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteClass(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesManagement;
