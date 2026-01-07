/**
 * Schools Management Page
 */

import { useState } from 'react';
import {
  School,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  X,
  Check,
  AlertCircle,
  MapPin,
  Users,
  Phone,
  Mail,
  Building,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './AdminPages.css';

interface SchoolData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  principalName: string;
  totalStudents: number;
  activeSubscriptions: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export function SchoolsManagement() {
  const [schools, setSchools] = useState<SchoolData[]>([
    { id: 'SCH001', name: 'Delhi Public School', address: '123 Main Road', city: 'Delhi', state: 'Delhi', phone: '+91 11 2345 6789', email: 'contact@dps.edu', principalName: 'Dr. Sharma', totalStudents: 456, activeSubscriptions: 380, status: 'active', createdAt: '2024-01-01' },
    { id: 'SCH002', name: 'St. Xavier\'s High School', address: '45 Church Street', city: 'Mumbai', state: 'Maharashtra', phone: '+91 22 3456 7890', email: 'info@stxaviers.edu', principalName: 'Fr. Joseph', totalStudents: 389, activeSubscriptions: 320, status: 'active', createdAt: '2024-01-15' },
    { id: 'SCH003', name: 'Kendriya Vidyalaya', address: '78 Government Colony', city: 'Chennai', state: 'Tamil Nadu', phone: '+91 44 4567 8901', email: 'kv@gov.in', principalName: 'Mrs. Lakshmi', totalStudents: 312, activeSubscriptions: 250, status: 'active', createdAt: '2024-02-01' },
    { id: 'SCH004', name: 'DAV Public School', address: '90 DAV Road', city: 'Bangalore', state: 'Karnataka', phone: '+91 80 5678 9012', email: 'admin@davschool.org', principalName: 'Mr. Verma', totalStudents: 278, activeSubscriptions: 200, status: 'inactive', createdAt: '2024-02-15' },
    { id: 'SCH005', name: 'Ryan International', address: '56 Education Lane', city: 'Pune', state: 'Maharashtra', phone: '+91 20 6789 0123', email: 'info@ryan.edu', principalName: 'Mrs. D\'Souza', totalStudents: 245, activeSubscriptions: 180, status: 'active', createdAt: '2024-03-01' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
  const [viewingSchool, setViewingSchool] = useState<SchoolData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    principalName: '',
    status: 'active',
  });

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         school.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || school.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddSchool = () => {
    setEditingSchool(null);
    setFormData({ name: '', address: '', city: '', state: '', phone: '', email: '', principalName: '', status: 'active' });
    setShowModal(true);
  };

  const handleEditSchool = (school: SchoolData) => {
    setEditingSchool(school);
    setFormData({
      name: school.name,
      address: school.address,
      city: school.city,
      state: school.state,
      phone: school.phone,
      email: school.email,
      principalName: school.principalName,
      status: school.status,
    });
    setShowModal(true);
  };

  const handleViewSchool = (school: SchoolData) => {
    setViewingSchool(school);
    setShowViewModal(true);
  };

  const handleSaveSchool = () => {
    if (editingSchool) {
      setSchools(schools.map(s => 
        s.id === editingSchool.id 
          ? { ...s, ...formData } 
          : s
      ));
    } else {
      const newSchool: SchoolData = {
        id: `SCH${String(schools.length + 1).padStart(3, '0')}`,
        ...formData,
        totalStudents: 0,
        activeSubscriptions: 0,
        status: formData.status as 'active' | 'inactive',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setSchools([...schools, newSchool]);
    }
    setShowModal(false);
  };

  const handleDeleteSchool = (id: string) => {
    setSchools(schools.filter(s => s.id !== id));
    setShowDeleteConfirm(null);
  };

  const totalStudents = schools.reduce((acc, s) => acc + s.totalStudents, 0);
  const totalSubscriptions = schools.reduce((acc, s) => acc + s.activeSubscriptions, 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Schools Management</h1>
          <p>Manage partner schools and institutions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Download size={16} />
            Export
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
            <Building size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Schools</p>
            <h3 className="stat-value">{schools.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <School size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Schools</p>
            <h3 className="stat-value">{schools.filter(s => s.status === 'active').length}</h3>
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
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Subscriptions</p>
            <h3 className="stat-value">{totalSubscriptions.toLocaleString()}</h3>
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
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Schools Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Schools ({filteredSchools.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>School Name</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Principal</th>
                <th>Students</th>
                <th>Subscriptions</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools.map((school) => (
                <tr key={school.id}>
                  <td>
                    <span className="id-badge">{school.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar school">
                        <School size={16} />
                      </div>
                      <span className="user-name">{school.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="location-cell">
                      <MapPin size={12} />
                      <span>{school.city}, {school.state}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span><Mail size={12} /> {school.email}</span>
                      <span><Phone size={12} /> {school.phone}</span>
                    </div>
                  </td>
                  <td>{school.principalName}</td>
                  <td>
                    <span className="number-cell">{school.totalStudents}</span>
                  </td>
                  <td>
                    <span className="number-cell success">{school.activeSubscriptions}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${school.status}`}>
                      {school.status}
                    </span>
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

        {filteredSchools.length === 0 && (
          <div className="empty-state">
            <School size={48} />
            <h3>No schools found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredSchools.length} of {schools.length} schools</span>
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

      {/* View School Modal */}
      {showViewModal && viewingSchool && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
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
                <h3>{viewingSchool.name}</h3>
                <span className={`status-badge ${viewingSchool.status}`}>{viewingSchool.status}</span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>School ID</label>
                  <span>{viewingSchool.id}</span>
                </div>
                <div className="detail-item">
                  <label>Address</label>
                  <span>{viewingSchool.address}</span>
                </div>
                <div className="detail-item">
                  <label>City</label>
                  <span>{viewingSchool.city}</span>
                </div>
                <div className="detail-item">
                  <label>State</label>
                  <span>{viewingSchool.state}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{viewingSchool.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{viewingSchool.email}</span>
                </div>
                <div className="detail-item">
                  <label>Principal</label>
                  <span>{viewingSchool.principalName}</span>
                </div>
                <div className="detail-item">
                  <label>Total Students</label>
                  <span className="highlight">{viewingSchool.totalStudents}</span>
                </div>
                <div className="detail-item">
                  <label>Active Subscriptions</label>
                  <span className="highlight success">{viewingSchool.activeSubscriptions}</span>
                </div>
                <div className="detail-item">
                  <label>Created At</label>
                  <span>{viewingSchool.createdAt}</span>
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
          <div className="modal" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
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
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter school name"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <input 
                    type="text" 
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter address"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
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
                <div className="form-group">
                  <label>Phone</label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone"
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email"
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
              <button className="btn btn-primary" onClick={handleSaveSchool}>
                <Check size={14} />
                {editingSchool ? 'Save Changes' : 'Add School'}
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
                <p>Are you sure you want to delete this school?</p>
                <span>All associated data will be removed.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
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
