/**
 * Schools List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  AlertCircle,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Users,
  Download,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSchools, deleteSchool } from '../../services/api/admin';
import './AdminPages.css';

interface SchoolData {
  id: string;
  schoolName: string;
  city: string;
  state: string;
  address?: string;
  pincode?: string;
  contactEmail?: string;
  contactPhone?: string;
  principalName?: string;
  studentCount?: number;
  isActive: boolean;
  createdAt: string;
}

export function SchoolsManagement() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchSchools();
  }, [currentPage, statusFilter]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const response = await getSchools({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter || undefined,
      });
      if (response.success) {
        setSchools(response.data.schools || response.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalSchools(response.data.pagination?.total || response.data.length);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchSchools();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await deleteSchool(id);
      if (response.success) {
        toast.success('School deleted successfully');
        setShowDeleteConfirm(null);
        fetchSchools();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete school');
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
          <h1>Schools Management</h1>
          <p>Manage registered schools</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchSchools}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/schools/add')}>
            <Plus size={16} />
            Add School
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <School size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Schools</p>
            <h3 className="stat-value">{totalSchools}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{schools.filter(s => s.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Users size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Students</p>
            <h3 className="stat-value">{schools.reduce((sum, s) => sum + (s.studentCount || 0), 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <MapPin size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Cities</p>
            <h3 className="stat-value">{new Set(schools.map(s => s.city)).size}</h3>
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
              placeholder="Search by school name, city, or state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); fetchSchools(); }}>
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        
        <div className="filter-row">
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
            <p>Loading schools...</p>
          </div>
        ) : schools.length === 0 ? (
          <div className="empty-state">
            <School size={64} />
            <h3>No schools found</h3>
            <p>Click "Add School" to register a new school</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/schools/add')} style={{ marginTop: '16px' }}>
              <Plus size={16} />
              Add School
            </button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Students</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {schools.map((school) => (
                <tr key={school.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: '#3B82F6' }}>
                        <School size={16} />
                      </div>
                      <div>
                        <span className="user-name">{school.schoolName}</span>
                        {school.principalName && <small>Principal: {school.principalName}</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <span>{school.city}</span>
                      <small>{school.state}</small>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span>{school.contactEmail || '-'}</span>
                      <small>{school.contactPhone || '-'}</small>
                    </div>
                  </td>
                  <td>
                    <span className="count-badge">{school.studentCount || 0}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${school.isActive ? 'success' : 'inactive'}`}>
                      {school.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{formatDate(school.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="action-btn view" 
                        title="View"
                        onClick={() => navigate(`/admin/schools/${school.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit" 
                        title="Edit"
                        onClick={() => navigate(`/admin/schools/${school.id}/edit`)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete" 
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(school.id)}
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
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="pagination-info">Page {currentPage} of {totalPages}</span>
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete School</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>This will delete the school and all associated data. This action cannot be undone.</p>
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

export default SchoolsManagement;
