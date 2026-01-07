/**
 * Students Management Page
 */

import { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getStudents, getStudentById, updateStudent, deleteStudent, getClasses, getBoards } from '../../services/api/admin';
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
    boardName: string;
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
  fullName: string;
}

export function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const limit = 20;

  const [formData, setFormData] = useState({
    studentName: '',
    classId: '',
    boardId: '',
    isActive: true,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [currentPage, classFilter, statusFilter]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, boardsRes] = await Promise.all([
        getClasses(),
        getBoards(),
      ]);

      if (classesRes.success) {
        setClasses(classesRes.data);
      }
      if (boardsRes.success) {
        setBoards(boardsRes.data);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const filters: any = {
        page: currentPage,
        limit,
        search: searchQuery || undefined,
      };

      if (classFilter !== 'all') {
        filters.classId = classFilter;
      }
      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const response = await getStudents(filters);

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

  const handleSearch = () => {
    setCurrentPage(1);
    fetchStudents();
  };

  const handleViewStudent = async (student: Student) => {
    try {
      const response = await getStudentById(student.id);
      if (response.success) {
        setViewingStudent(response.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
      toast.error('Failed to load student details');
    }
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentName: student.studentName,
      classId: student.class?.id || '',
      boardId: student.board?.id || '',
      isActive: student.isActive,
    });
    setShowEditModal(true);
  };

  const handleSaveStudent = async () => {
    if (!editingStudent) return;

    setSaving(true);
    try {
      const response = await updateStudent(editingStudent.id, formData);
      if (response.success) {
        toast.success('Student updated successfully');
        setShowEditModal(false);
        fetchStudents();
      }
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast.error(error.response?.data?.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const response = await deleteStudent(id);
      if (response.success) {
        toast.success('Student deleted successfully');
        setShowDeleteConfirm(null);
        fetchStudents();
      }
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast.error(error.response?.data?.message || 'Failed to delete student');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Students Management</h1>
          <p>Manage registered students and their accounts</p>
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

      {/* Stats */}
      <div className="stats-grid">
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
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Students</p>
            <h3 className="stat-value">{students.filter(s => s.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <GraduationCap size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Classes</p>
            <h3 className="stat-value">{classes.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Calendar size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">This Month</p>
            <h3 className="stat-value">-</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email, phone..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <select value={classFilter} onChange={(e) => { setClassFilter(e.target.value); setCurrentPage(1); }}>
          <option value="all">All Classes</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.className}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={handleSearch}>
          <Search size={14} />
          Search
        </button>
      </div>

      {/* Students Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Students ({totalStudents})</h3>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '60px 20px' }}>
            <Loader2 size={32} className="spinner" />
            <p>Loading students...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Contact</th>
                    <th>Class</th>
                    <th>Board</th>
                    <th>Plan</th>
                    <th>Level</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {getInitials(student.studentName)}
                          </div>
                          <span className="user-name">{student.studentName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span><Mail size={12} /> {student.user?.email || '-'}</span>
                          <span><Phone size={12} /> {student.user?.phone || '-'}</span>
                        </div>
                      </td>
                      <td>{student.class?.className || '-'}</td>
                      <td>{student.board?.boardName || '-'}</td>
                      <td>
                        <span className={`plan-badge ${student.subscription?.plan ? 'yearly' : 'none'}`}>
                          {student.subscription?.plan?.planName || 'Free'}
                        </span>
                      </td>
                      <td>
                        <span className="number-cell">{student.level}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${student.isActive ? 'active' : 'inactive'}`}>
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">{formatDate(student.createdAt)}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="table-action-btn view" 
                            title="View Details"
                            onClick={() => handleViewStudent(student)}
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            className="table-action-btn edit" 
                            title="Edit"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            className="table-action-btn delete" 
                            title="Delete"
                            onClick={() => setShowDeleteConfirm(student.id)}
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

            {students.length === 0 && (
              <div className="empty-state">
                <Users size={48} />
                <h3>No students found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <span className="pagination-info">
                Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalStudents)} of {totalStudents} students
              </span>
              <div className="pagination-buttons">
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button 
                      key={page}
                      className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span>...</span>}
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Student Modal */}
      {showViewModal && viewingStudent && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large">
                  {getInitials(viewingStudent.studentName)}
                </div>
                <h3>{viewingStudent.studentName}</h3>
                <span className={`status-badge ${viewingStudent.isActive ? 'active' : 'inactive'}`}>
                  {viewingStudent.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Student ID</label>
                  <span>{viewingStudent.id.slice(0, 8)}...</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{viewingStudent.user?.email || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{viewingStudent.user?.phone || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Class</label>
                  <span>{viewingStudent.class?.className || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Board</label>
                  <span>{viewingStudent.board?.boardName || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Plan</label>
                  <span>{viewingStudent.subscription?.plan?.planName || 'Free'}</span>
                </div>
                <div className="detail-item">
                  <label>Level</label>
                  <span className="highlight">{viewingStudent.level}</span>
                </div>
                <div className="detail-item">
                  <label>XP</label>
                  <span className="highlight success">{viewingStudent.xp.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Joined</label>
                  <span>{formatDate(viewingStudent.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowViewModal(false);
                handleEditStudent(viewingStudent);
              }}>
                <Edit2 size={14} />
                Edit Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && editingStudent && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Student</h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Student Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    placeholder="Enter student name"
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
                  <label>Status</label>
                  <select 
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowEditModal(false)} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveStudent} disabled={saving}>
                {saving ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
                <p>Are you sure you want to delete this student?</p>
                <span>This action will deactivate the student account.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteStudent(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsManagement;
