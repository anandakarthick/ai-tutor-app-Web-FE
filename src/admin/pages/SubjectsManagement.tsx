/**
 * Subjects List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, Plus, Edit2, Trash2, Eye, X, AlertCircle,
  ChevronLeft, ChevronRight, Loader2, RefreshCw, GraduationCap, CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubjects, deleteSubject, getClasses } from '../../services/api/admin';
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
  class?: { id: string; className: string; };
}

export function SubjectsManagement() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [classFilter, statusFilter]);

  const fetchInitialData = async () => {
    try {
      const classesRes = await getClasses();
      if (classesRes.success) setClasses(classesRes.data);
      fetchSubjects();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await getSubjects({
        search: searchQuery,
        classId: classFilter || undefined,
        status: statusFilter || undefined,
      });
      if (response.success) setSubjects(response.data);
    } catch (error) {
      toast.error('Failed to load subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSubjects();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await deleteSubject(id);
      if (response.success) {
        toast.success('Subject deleted successfully');
        setShowDeleteConfirm(null);
        fetchSubjects();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete subject');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subjects Management</h1>
          <p>Manage subjects and courses</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchSubjects}><RefreshCw size={16} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/subjects/add')}><Plus size={16} /> Add Subject</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}><BookOpen size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Total Subjects</p>
            <h3 className="stat-value">{subjects.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}><CheckCircle size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{subjects.filter(s => s.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}><GraduationCap size={22} /></div>
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
            <input type="text" placeholder="Search subjects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); fetchSubjects(); }}><X size={16} /></button>}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="filter-row">
          <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="">All Classes</option>
            {classes.map(cls => <option key={cls.id} value={cls.id}>{cls.className}</option>)}
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
          <div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div>
        ) : subjects.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>No subjects found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/admin/subjects/add')} style={{ marginTop: '16px' }}><Plus size={16} /> Add Subject</button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Class</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: subject.color || '#F97316', fontSize: '16px' }}>
                        {subject.icon || '📚'}
                      </div>
                      <div>
                        <span className="user-name">{subject.subjectName}</span>
                        {subject.displayName && <small>{subject.displayName}</small>}
                      </div>
                    </div>
                  </td>
                  <td>{subject.class?.className || '-'}</td>
                  <td>{subject.displayOrder}</td>
                  <td>
                    <span className={`status-badge ${subject.isActive ? 'success' : 'inactive'}`}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" onClick={() => navigate(`/admin/subjects/${subject.id}`)}><Eye size={16} /></button>
                      <button className="action-btn edit" onClick={() => navigate(`/admin/subjects/${subject.id}/edit`)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => setShowDeleteConfirm(subject.id)}><Trash2 size={16} /></button>
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
              <h2>Delete Subject</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>This will delete the subject.</p>
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

export default SubjectsManagement;
