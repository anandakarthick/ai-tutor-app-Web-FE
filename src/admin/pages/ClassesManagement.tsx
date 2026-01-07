/**
 * Classes List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, Search, Plus, Edit2, Trash2, Eye, X, AlertCircle, Users,
  BookOpen, ChevronLeft, ChevronRight, Loader2, RefreshCw, CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getClasses, deleteClass, getBoards } from '../../services/api/admin';
import './AdminPages.css';

interface ClassData {
  id: string;
  className: string;
  displayName?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  studentCount?: number;
  subjectCount?: number;
  board?: { id: string; name: string; fullName: string; };
}

interface BoardOption {
  id: string;
  name: string;
  fullName: string;
}

export function ClassesManagement() {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [boardFilter, statusFilter]);

  const fetchInitialData = async () => {
    try {
      const boardsRes = await getBoards();
      if (boardsRes.success) setBoards(boardsRes.data);
      fetchClasses();
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const response = await getClasses({
        search: searchQuery,
        boardId: boardFilter || undefined,
        status: statusFilter || undefined,
      });
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClasses();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await deleteClass(id);
      if (response.success) {
        toast.success('Class deleted successfully');
        setShowDeleteConfirm(null);
        fetchClasses();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete class');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Classes Management</h1>
          <p>Manage classes and grade levels</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchClasses}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/classes/add')}>
            <Plus size={16} /> Add Class
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
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
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{classes.filter(c => c.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Users size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Students</p>
            <h3 className="stat-value">{classes.reduce((sum, c) => sum + (c.studentCount || 0), 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Boards</p>
            <h3 className="stat-value">{boards.length}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); fetchClasses(); }}>
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="filter-row">
          <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
            <option value="">All Boards</option>
            {boards.map(board => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="data-table-container">
        {loading ? (
          <div className="loading-container">
            <Loader2 size={40} className="spinner" />
            <p>Loading classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="empty-state">
            <GraduationCap size={64} />
            <h3>No classes found</h3>
            <p>Click "Add Class" to create a new class</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/classes/add')} style={{ marginTop: '16px' }}>
              <Plus size={16} /> Add Class
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Board</th>
                <th>Students</th>
                <th>Subjects</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls) => (
                <tr key={cls.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: '#8B5CF6' }}>
                        <GraduationCap size={16} />
                      </div>
                      <div>
                        <span className="user-name">{cls.className}</span>
                        {cls.displayName && <small>{cls.displayName}</small>}
                      </div>
                    </div>
                  </td>
                  <td>{cls.board?.name || '-'}</td>
                  <td><span className="count-badge">{cls.studentCount || 0}</span></td>
                  <td><span className="count-badge secondary">{cls.subjectCount || 0}</span></td>
                  <td>{cls.displayOrder}</td>
                  <td>
                    <span className={`status-badge ${cls.isActive ? 'success' : 'inactive'}`}>
                      {cls.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" title="View" onClick={() => navigate(`/admin/classes/${cls.id}`)}>
                        <Eye size={16} />
                      </button>
                      <button className="action-btn edit" title="Edit" onClick={() => navigate(`/admin/classes/${cls.id}/edit`)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="action-btn delete" title="Delete" onClick={() => setShowDeleteConfirm(cls.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Class</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>This will delete the class and may affect associated data.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)} disabled={deleting}>
                {deleting ? <><Loader2 size={16} className="spinner" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesManagement;
