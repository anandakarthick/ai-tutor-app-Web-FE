/**
 * Classes Management Page
 */

import { useState, useEffect } from 'react';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getClasses, createClass, updateClass, deleteClass, getBoards } from '../../services/api/admin';
import './AdminPages.css';

interface ClassData {
  id: string;
  className: string;
  displayName?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  studentCount?: number;
  board?: {
    id: string;
    name: string;
    fullName: string;
  };
}

interface BoardOption {
  id: string;
  name: string;
  fullName: string;
}

export function ClassesManagement() {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [viewingClass, setViewingClass] = useState<ClassData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    className: '',
    displayName: '',
    description: '',
    boardId: '',
    displayOrder: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [boardFilter, statusFilter]);

  const fetchInitialData = async () => {
    try {
      const boardsRes = await getBoards();
      if (boardsRes.success) {
        setBoards(boardsRes.data);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (boardFilter !== 'all') filters.boardId = boardFilter;
      if (statusFilter !== 'all') filters.status = statusFilter;

      const response = await getClasses(filters);
      if (response.success) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cls.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddClass = () => {
    setEditingClass(null);
    setFormData({
      className: '',
      displayName: '',
      description: '',
      boardId: boards[0]?.id || '',
      displayOrder: classes.length + 1,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditClass = (cls: ClassData) => {
    setEditingClass(cls);
    setFormData({
      className: cls.className,
      displayName: cls.displayName || '',
      description: cls.description || '',
      boardId: cls.board?.id || '',
      displayOrder: cls.displayOrder,
      isActive: cls.isActive,
    });
    setShowModal(true);
  };

  const handleViewClass = (cls: ClassData) => {
    setViewingClass(cls);
    setShowViewModal(true);
  };

  const handleSaveClass = async () => {
    if (!formData.className) {
      toast.error('Please enter class name');
      return;
    }

    setSaving(true);
    try {
      if (editingClass) {
        const response = await updateClass(editingClass.id, formData);
        if (response.success) {
          toast.success('Class updated successfully');
        }
      } else {
        const response = await createClass(formData);
        if (response.success) {
          toast.success('Class created successfully');
        }
      }
      setShowModal(false);
      fetchClasses();
    } catch (error: any) {
      console.error('Error saving class:', error);
      toast.error(error.response?.data?.message || 'Failed to save class');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClass = async (id: string) => {
    try {
      const response = await deleteClass(id);
      if (response.success) {
        toast.success('Class deleted successfully');
        setShowDeleteConfirm(null);
        fetchClasses();
      }
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast.error(error.response?.data?.message || 'Failed to delete class');
    }
  };

  const totalStudents = classes.reduce((acc, cls) => acc + (cls.studentCount || 0), 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Classes Management</h1>
          <p>Manage classes and grade levels</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchClasses}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={handleAddClass}>
            <Plus size={16} />
            Add Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
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
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{classes.filter(c => c.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <Users size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Students</p>
            <h3 className="stat-value">{totalStudents.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Boards</p>
            <h3 className="stat-value">{boards.length}</h3>
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
          {boards.map(board => (
            <option key={board.id} value={board.id}>{board.fullName}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Classes Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Classes ({filteredClasses.length})</h3>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '60px 20px' }}>
            <Loader2 size={32} className="spinner" />
            <p>Loading classes...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Class Name</th>
                    <th>Display Name</th>
                    <th>Board</th>
                    <th>Students</th>
                    <th>Order</th>
                    <th>Status</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClasses.map((cls) => (
                    <tr key={cls.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                            <GraduationCap size={16} />
                          </div>
                          <span className="user-name">{cls.className}</span>
                        </div>
                      </td>
                      <td>{cls.displayName || cls.className}</td>
                      <td>
                        <span className="plan-badge monthly">{cls.board?.fullName || '-'}</span>
                      </td>
                      <td>
                        <span className="number-cell">{cls.studentCount || 0}</span>
                      </td>
                      <td>
                        <span className="number-cell">{cls.displayOrder}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${cls.isActive ? 'active' : 'inactive'}`}>
                          {cls.isActive ? 'Active' : 'Inactive'}
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
                <p>Add your first class</p>
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
                <button className="pagination-btn" disabled>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Class Modal */}
      {showViewModal && viewingClass && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
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
                <h3>{viewingClass.className}</h3>
                <span className={`status-badge ${viewingClass.isActive ? 'active' : 'inactive'}`}>
                  {viewingClass.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Display Name</label>
                  <span>{viewingClass.displayName || viewingClass.className}</span>
                </div>
                <div className="detail-item">
                  <label>Board</label>
                  <span>{viewingClass.board?.fullName || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Students</label>
                  <span className="highlight">{viewingClass.studentCount || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Display Order</label>
                  <span>{viewingClass.displayOrder}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description</label>
                  <span>{viewingClass.description || '-'}</span>
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
                  <label>Class Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.className}
                    onChange={(e) => setFormData({...formData, className: e.target.value})}
                    placeholder="e.g., class_10"
                  />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
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
                    value={formData.boardId}
                    onChange={(e) => setFormData({...formData, boardId: e.target.value})}
                  >
                    <option value="">Select Board</option>
                    {boards.map(board => (
                      <option key={board.id} value={board.id}>{board.fullName}</option>
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
              <button className="btn btn-primary" onClick={handleSaveClass} disabled={saving}>
                {saving ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
                {saving ? 'Saving...' : (editingClass ? 'Save Changes' : 'Add Class')}
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
                <span>Students in this class will need to be reassigned.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
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
