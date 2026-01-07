/**
 * Schools Management Page
 */

import { useState } from 'react';
import {
  School,
  Search,
  Plus,
  Edit,
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
    { id: '1', name: 'Delhi Public School', address: '123 Main Road', city: 'Delhi', state: 'Delhi', phone: '+91 11 2345 6789', email: 'contact@dps.edu', principalName: 'Dr. Sharma', totalStudents: 456, activeSubscriptions: 380, status: 'active', createdAt: '2024-01-01' },
    { id: '2', name: 'St. Xavier\'s High School', address: '45 Church Street', city: 'Mumbai', state: 'Maharashtra', phone: '+91 22 3456 7890', email: 'info@stxaviers.edu', principalName: 'Fr. Joseph', totalStudents: 389, activeSubscriptions: 320, status: 'active', createdAt: '2024-01-15' },
    { id: '3', name: 'Kendriya Vidyalaya', address: '78 Government Colony', city: 'Chennai', state: 'Tamil Nadu', phone: '+91 44 4567 8901', email: 'kv@gov.in', principalName: 'Mrs. Lakshmi', totalStudents: 312, activeSubscriptions: 250, status: 'active', createdAt: '2024-02-01' },
    { id: '4', name: 'DAV Public School', address: '90 DAV Road', city: 'Bangalore', state: 'Karnataka', phone: '+91 80 5678 9012', email: 'admin@davschool.org', principalName: 'Mr. Verma', totalStudents: 278, activeSubscriptions: 200, status: 'inactive', createdAt: '2024-02-15' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingSchool, setEditingSchool] = useState<SchoolData | null>(null);
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
                         school.city.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleSaveSchool = () => {
    if (editingSchool) {
      setSchools(schools.map(s => 
        s.id === editingSchool.id 
          ? { ...s, ...formData } 
          : s
      ));
    } else {
      const newSchool: SchoolData = {
        id: Date.now().toString(),
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

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Schools Management</h1>
          <p>Manage partner schools and institutions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-primary" onClick={handleAddSchool}>
            <Plus size={18} />
            Add School
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <Building size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Schools</p>
            <h3 className="stat-value">{schools.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <School size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Schools</p>
            <h3 className="stat-value">{schools.filter(s => s.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Students</p>
            <h3 className="stat-value">{schools.reduce((acc, s) => acc + s.totalStudents, 0)}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Subscriptions</p>
            <h3 className="stat-value">{schools.reduce((acc, s) => acc + s.activeSubscriptions, 0)}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
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

      {/* Schools Grid */}
      <div className="schools-grid">
        {filteredSchools.map((school) => (
          <div key={school.id} className="school-card">
            <div className="school-header">
              <div className="school-icon">
                <School size={24} />
              </div>
              <span className={`status-badge ${school.status}`}>{school.status}</span>
            </div>
            <h3>{school.name}</h3>
            <div className="school-details">
              <p><MapPin size={14} /> {school.city}, {school.state}</p>
              <p><Phone size={14} /> {school.phone}</p>
              <p><Mail size={14} /> {school.email}</p>
            </div>
            <div className="school-stats">
              <div>
                <span className="stat-num">{school.totalStudents}</span>
                <span className="stat-label">Students</span>
              </div>
              <div>
                <span className="stat-num">{school.activeSubscriptions}</span>
                <span className="stat-label">Active Subs</span>
              </div>
            </div>
            <div className="school-actions">
              <button className="btn btn-outline btn-sm" onClick={() => handleEditSchool(school)}>
                <Edit size={14} /> Edit
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowDeleteConfirm(school.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingSchool ? 'Edit School' : 'Add New School'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
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
                <Check size={18} />
                {editingSchool ? 'Save Changes' : 'Add School'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <AlertCircle size={48} color="#EF4444" />
                <p>Are you sure you want to delete this school? All associated data will be removed.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteSchool(showDeleteConfirm)}>
                <Trash2 size={18} /> Delete School
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SchoolsManagement;
