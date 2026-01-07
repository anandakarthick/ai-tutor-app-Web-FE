/**
 * Schools Management Page
 */

import { useState, useEffect } from 'react';
import {
  School,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  MapPin,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Users,
  Download,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSchools, getSchoolById, createSchool, updateSchool, deleteSchool } from '../../services/api/admin';
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
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
  const [viewingSchool, setViewingSchool] = useState<SchoolData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchools, setTotalSchools] = useState(0);
  const limit = 20;

  const [formData, setFormData] = useState({
    schoolName: '',
    city: '',
    state: '',
    address: '',
    pincode: '',
    contactEmail: '',
    contactPhone: '',
    principalName: '',
    isActive: true,
  });

  useEffect(() => {
    fetchSchools();
  }, [currentPage, statusFilter]);

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const filters: any = {
        page: currentPage,
        limit,
        search: searchQuery || undefined,
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      const response = await getSchools(filters);

      if (response.success) {
        setSchools(response.data.schools);
        setTotalPages(response.data.pagination.totalPages);
        setTotalSchools(response.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      toast.error('Failed to load schools');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSchools();
  };

  const handleAddSchool = () => {
    setEditingSchool(null);
    setFormData({
      schoolName: '',
      city: '',
      state: '',
      address: '',
      pincode: '',
      contactEmail: '',
      contactPhone: '',
      principalName: '',
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditSchool = (school: SchoolData) => {
    setEditingSchool(school);
    setFormData({
      schoolName: school.schoolName,
      city: school.city,
      state: school.state,
      address: school.address || '',
      pincode: school.pincode || '',
      contactEmail: school.contactEmail || '',
      contactPhone: school.contactPhone || '',
      principalName: school.principalName || '',
      isActive: school.isActive,
    });
    setShowModal(true);
  };

  const handleViewSchool = async (school: SchoolData) => {
    try {
      const response = await getSchoolById(school.id);
      if (response.success) {
        setViewingSchool(response.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching school details:', error);
      toast.error('Failed to load school details');
    }
  };

  const handleSaveSchool = async () => {
    if (!formData.schoolName || !formData.city) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingSchool) {
        const response = await updateSchool(editingSchool.id, formData);
        if (response.success) {
          toast.success('School updated successfully');
        }
      } else {
        const response = await createSchool(formData);
        if (response.success) {
          toast.success('School created successfully');
        }
      }
      setShowModal(false);
      fetchSchools();
    } catch (error: any) {
      console.error('Error saving school:', error);
      toast.error(error.response?.data?.message || 'Failed to save school');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchool = async (id: string) => {
    try {
      const response = await deleteSchool(id);
      if (response.success) {
        toast.success('School deleted successfully');
        setShowDeleteConfirm(null);
        fetchSchools();
      }
    } catch (error: any) {
      console.error('Error deleting school:', error);
      toast.error(error.response?.data?.message || 'Failed to delete school');
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
          <p>Manage partner schools and institutions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchSchools}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={handleAddSchool}>
            <Plus size={16} />
            Add School
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
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
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{schools.filter(s => s.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <Users size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Students</p>
            <h3 className="stat-value">{schools.reduce((acc, s) => acc + (s.studentCount || 0), 0)}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <MapPin size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Cities</p>
            <h3 className="stat-value">{new Set(schools.map(s => s.city)).size}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search schools..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
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

      {/* Schools Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Schools ({totalSchools})</h3>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '60px 20px' }}>
            <Loader2 size={32} className="spinner" />
            <p>Loading schools...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>School Name</th>
                    <th>Location</th>
                    <th>Contact</th>
                    <th>Principal</th>
                    <th>Students</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schools.map((school) => (
                    <tr key={school.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar school">
                            <School size={16} />
                          </div>
                          <span className="user-name">{school.schoolName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="location-cell">
                          <MapPin size={14} />
                          {school.city}, {school.state}
                        </div>
                      </td>
                      <td>
                        <div className="contact-cell">
                          <span><Mail size={12} /> {school.contactEmail || '-'}</span>
                          <span><Phone size={12} /> {school.contactPhone || '-'}</span>
                        </div>
                      </td>
                      <td>{school.principalName || '-'}</td>
                      <td>
                        <span className="number-cell">{school.studentCount || 0}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${school.isActive ? 'active' : 'inactive'}`}>
                          {school.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">{formatDate(school.createdAt)}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="table-action-btn view" 
                            title="View Details"
                            onClick={() => handleViewSchool(school)}
                          >
                            <Eye size={15} />
                          </button>
                          <button 
                            className="table-action-btn edit" 
                            title="Edit"
                            onClick={() => handleEditSchool(school)}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button 
                            className="table-action-btn delete" 
                            title="Delete"
                            onClick={() => setShowDeleteConfirm(school.id)}
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

            {schools.length === 0 && (
              <div className="empty-state">
                <School size={48} />
                <h3>No schools found</h3>
                <p>Add your first partner school</p>
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <span className="pagination-info">
                Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalSchools)} of {totalSchools} schools
              </span>
              <div className="pagination-buttons">
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
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

      {/* View School Modal */}
      {showViewModal && viewingSchool && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>School Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large school">
                  <School size={28} />
                </div>
                <h3>{viewingSchool.schoolName}</h3>
                <span className={`status-badge ${viewingSchool.isActive ? 'active' : 'inactive'}`}>
                  {viewingSchool.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>City</label>
                  <span>{viewingSchool.city}</span>
                </div>
                <div className="detail-item">
                  <label>State</label>
                  <span>{viewingSchool.state}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Address</label>
                  <span>{viewingSchool.address || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Pincode</label>
                  <span>{viewingSchool.pincode || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Principal</label>
                  <span>{viewingSchool.principalName || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{viewingSchool.contactEmail || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{viewingSchool.contactPhone || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Students</label>
                  <span className="highlight">{viewingSchool.studentCount || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Joined</label>
                  <span>{formatDate(viewingSchool.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowViewModal(false);
                handleEditSchool(viewingSchool);
              }}>
                <Edit2 size={14} />
                Edit School
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
              <h3>{editingSchool ? 'Edit School' : 'Add New School'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>School Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.schoolName}
                    onChange={(e) => setFormData({...formData, schoolName: e.target.value})}
                    placeholder="Enter school name"
                  />
                </div>
                <div className="form-group">
                  <label>City <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input 
                    type="text" 
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    placeholder="Enter state"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <textarea 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter full address"
                  />
                </div>
                <div className="form-group">
                  <label>Pincode</label>
                  <input 
                    type="text" 
                    value={formData.pincode}
                    onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                    placeholder="Enter pincode"
                  />
                </div>
                <div className="form-group">
                  <label>Principal Name</label>
                  <input 
                    type="text" 
                    value={formData.principalName}
                    onChange={(e) => setFormData({...formData, principalName: e.target.value})}
                    placeholder="Enter principal name"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input 
                    type="email" 
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input 
                    type="tel" 
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    placeholder="Enter phone"
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
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveSchool} disabled={saving}>
                {saving ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
                {saving ? 'Saving...' : (editingSchool ? 'Save Changes' : 'Add School')}
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
                <p>Are you sure you want to delete this school?</p>
                <span>This action will deactivate the school.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteSchool(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolsManagement;
