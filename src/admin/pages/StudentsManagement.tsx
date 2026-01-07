/**
 * Students Management Page
 */

import { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Download,
  Upload,
  Mail,
  Phone,
  Calendar,
  X,
  Check,
  AlertCircle,
  MoreHorizontal,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import './AdminPages.css';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  school: string;
  subscription: string;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
}

export function StudentsManagement() {
  const [students, setStudents] = useState<Student[]>([
    { id: 'STU001', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', class: 'Class 10', school: 'Delhi Public School', subscription: 'Yearly', status: 'active', joinDate: '2024-01-15' },
    { id: 'STU002', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 98765 43211', class: 'Class 9', school: 'St. Xavier\'s High School', subscription: 'Monthly', status: 'active', joinDate: '2024-02-20' },
    { id: 'STU003', name: 'Ananya Patel', email: 'ananya@example.com', phone: '+91 98765 43212', class: 'Class 12', school: 'Kendriya Vidyalaya', subscription: 'Yearly', status: 'pending', joinDate: '2024-03-10' },
    { id: 'STU004', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43213', class: 'Class 11', school: 'DAV Public School', subscription: 'None', status: 'inactive', joinDate: '2024-01-05' },
    { id: 'STU005', name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 98765 43214', class: 'Class 8', school: 'Ryan International', subscription: 'Yearly', status: 'active', joinDate: '2024-02-28' },
    { id: 'STU006', name: 'Amit Kumar', email: 'amit@example.com', phone: '+91 98765 43215', class: 'Class 10', school: 'Delhi Public School', subscription: 'Monthly', status: 'active', joinDate: '2024-03-15' },
    { id: 'STU007', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 98765 43216', class: 'Class 9', school: 'Kendriya Vidyalaya', subscription: 'Yearly', status: 'active', joinDate: '2024-04-01' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    school: '',
    status: 'active',
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesClass = classFilter === 'all' || student.class === classFilter;
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', phone: '', class: '', school: '', status: 'active' });
    setShowModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      class: student.class,
      school: student.school,
      status: student.status,
    });
    setShowModal(true);
  };

  const handleViewStudent = (student: Student) => {
    setViewingStudent(student);
    setShowViewModal(true);
  };

  const handleSaveStudent = () => {
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData } 
          : s
      ));
    } else {
      const newStudent: Student = {
        id: `STU${String(students.length + 1).padStart(3, '0')}`,
        ...formData,
        subscription: 'None',
        status: formData.status as 'active' | 'inactive' | 'pending',
        joinDate: new Date().toISOString().split('T')[0],
      };
      setStudents([...students, newStudent]);
    }
    setShowModal(false);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Students Management</h1>
          <p>Manage all registered students</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Upload size={16} />
            Import
          </button>
          <button className="btn btn-outline">
            <Download size={16} />
            Export
          </button>
          <button className="btn btn-primary" onClick={handleAddStudent}>
            <Plus size={16} />
            Add Student
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
            <h3 className="stat-value">{students.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{students.filter(s => s.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F59E0B15', color: '#F59E0B' }}>
            <Calendar size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Pending</p>
            <h3 className="stat-value">{students.filter(s => s.status === 'pending').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EF444415', color: '#EF4444' }}>
            <X size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Inactive</p>
            <h3 className="stat-value">{students.filter(s => s.status === 'inactive').length}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email or ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
          ))}
        </select>
      </div>

      {/* Students Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Students ({filteredStudents.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Contact</th>
                <th>Class</th>
                <th>School</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>
                    <span className="id-badge">{student.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="user-name">{student.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span><Mail size={12} /> {student.email}</span>
                      <span><Phone size={12} /> {student.phone}</span>
                    </div>
                  </td>
                  <td>{student.class}</td>
                  <td>
                    <span className="school-cell">{student.school}</span>
                  </td>
                  <td>
                    <span className={`plan-badge ${student.subscription.toLowerCase()}`}>
                      {student.subscription}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${student.status}`}>
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <span className="date-cell">{student.joinDate}</span>
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

        {filteredStudents.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <h3>No students found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredStudents.length} of {students.length} students</span>
          <div className="pagination-buttons">
            <button className="pagination-btn" disabled>
              <ChevronLeft size={14} />
            </button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
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
                  {viewingStudent.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3>{viewingStudent.name}</h3>
                <span className={`status-badge ${viewingStudent.status}`}>{viewingStudent.status}</span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Student ID</label>
                  <span>{viewingStudent.id}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{viewingStudent.email}</span>
                </div>
                <div className="detail-item">
                  <label>Phone</label>
                  <span>{viewingStudent.phone}</span>
                </div>
                <div className="detail-item">
                  <label>Class</label>
                  <span>{viewingStudent.class}</span>
                </div>
                <div className="detail-item">
                  <label>School</label>
                  <span>{viewingStudent.school}</span>
                </div>
                <div className="detail-item">
                  <label>Subscription</label>
                  <span className={`plan-badge ${viewingStudent.subscription.toLowerCase()}`}>
                    {viewingStudent.subscription}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Join Date</label>
                  <span>{viewingStudent.joinDate}</span>
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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email <span>*</span></label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone <span>*</span></label>
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Class <span>*</span></label>
                  <select 
                    value={formData.class}
                    onChange={(e) => setFormData({...formData, class: e.target.value})}
                  >
                    <option value="">Select Class</option>
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={`Class ${i + 1}`}>Class {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>School</label>
                  <select 
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                  >
                    <option value="">Select School</option>
                    <option value="Delhi Public School">Delhi Public School</option>
                    <option value="St. Xavier's High School">St. Xavier's High School</option>
                    <option value="Kendriya Vidyalaya">Kendriya Vidyalaya</option>
                    <option value="DAV Public School">DAV Public School</option>
                    <option value="Ryan International">Ryan International</option>
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
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveStudent}>
                <Check size={14} />
                {editingStudent ? 'Save Changes' : 'Add Student'}
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
                <span>This action cannot be undone.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteStudent(showDeleteConfirm)}>
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsManagement;
