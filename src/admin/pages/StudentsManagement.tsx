/**
 * Students List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  AlertCircle,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
  UserCheck,
  UserX,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getStudents, deleteStudent, getClasses, getBoards } from '../../services/api/admin';
import './AdminPages.css';

interface Student {
  id: string;
  studentName: string;
  isActive: boolean;
  xp: number;
  level: number;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  class?: {
    id: string;
    className: string;
  };
  board?: {
    id: string;
    name: string;
  };
  subscription?: {
    plan?: {
      planName: string;
    };
    status: string;
  };
}

interface ClassOption {
  id: string;
  className: string;
}

interface BoardOption {
  id: string;
  name: string;
}

export function StudentsManagement() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [boardFilter, setBoardFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, classFilter, boardFilter, statusFilter]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, boardsRes] = await Promise.all([
        getClasses(),
        getBoards()
      ]);
      if (classesRes.success) setClasses(classesRes.data);
      if (boardsRes.success) setBoards(boardsRes.data);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getStudents({
        page: currentPage,
        limit,
        search: searchQuery,
        classId: classFilter || undefined,
        boardId: boardFilter || undefined,
        status: statusFilter || undefined,
      });
      if (response.success) {
        setStudents(response.data.students);
        setTotalPages(response.data.pagination.totalPages);
        setTotalStudents(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await deleteStudent(id);
      if (response.success) {
        toast.success('Student deleted successfully');
        setShowDeleteConfirm(null);
        fetchStudents();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Students Management</h1>
          <p>View and manage student accounts</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchStudents}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-outline">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
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
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <UserCheck size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{students.filter(s => s.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EF444415', color: '#EF4444' }}>
            <UserX size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Inactive</p>
            <h3 className="stat-value">{students.filter(s => !s.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <GraduationCap size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Classes</p>
            <h3 className="stat-value">{classes.length}</h3>
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
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); fetchStudents(); }}>
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        
        <div className="filter-row">
          <select value={boardFilter} onChange={(e) => { setBoardFilter(e.target.value); setCurrentPage(1); }}>
            <option value="">All Boards</option>
            {boards.map(board => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </select>
          <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}>
            <option value="">All Classes</option>
            {classes.map(cls => (
              <option key={cls.id} value={cls.id}>{cls.className}</option>
            ))}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
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
            <p>Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <Users size={64} />
            <h3>No students found</h3>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>Class / Board</th>
                <th>Level / XP</th>
                <th>Subscription</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {student.studentName?.charAt(0) || 'S'}
                      </div>
                      <span className="user-name">{student.studentName}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span>{student.user?.email || '-'}</span>
                      <small>{student.user?.phone || '-'}</small>
                    </div>
                  </td>
                  <td>
                    <div className="class-cell">
                      <span>{student.class?.className || '-'}</span>
                      <small>{student.board?.name || '-'}</small>
                    </div>
                  </td>
                  <td>
                    <div className="level-cell">
                      <span className="level-badge">Lvl {student.level || 1}</span>
                      <small>{student.xp || 0} XP</small>
                    </div>
                  </td>
                  <td>
                    <span className={`subscription-badge ${student.subscription?.status || 'none'}`}>
                      {student.subscription?.plan?.planName || 'Free'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${student.isActive ? 'success' : 'inactive'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(student.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn view" 
                        title="View"
                        onClick={() => navigate(`/admin/students/${student.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit" 
                        title="Edit"
                        onClick={() => navigate(`/admin/students/${student.id}/edit`)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(student.id)}
                      >
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Student</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>This will deactivate the student account. This action can be reversed later.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={deleting}
              >
                {deleting ? <><Loader2 size={16} className="spinner" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsManagement;
