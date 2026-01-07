/**
 * Students Management Page
 */

import { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  MoreVertical,
  Mail,
  Phone,
  Calendar,
  School,
  X,
  Check,
  AlertCircle,
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
    { id: '1', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 98765 43210', class: 'Class 10', school: 'Delhi Public School', subscription: 'Yearly', status: 'active', joinDate: '2024-01-15' },
    { id: '2', name: 'Rahul Verma', email: 'rahul@example.com', phone: '+91 98765 43211', class: 'Class 9', school: 'St. Xavier\'s High School', subscription: 'Monthly', status: 'active', joinDate: '2024-02-20' },
    { id: '3', name: 'Ananya Patel', email: 'ananya@example.com', phone: '+91 98765 43212', class: 'Class 12', school: 'Kendriya Vidyalaya', subscription: 'Yearly', status: 'pending', joinDate: '2024-03-10' },
    { id: '4', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43213', class: 'Class 11', school: 'DAV Public School', subscription: 'None', status: 'inactive', joinDate: '2024-01-05' },
    { id: '5', name: 'Neha Gupta', email: 'neha@example.com', phone: '+91 98765 43214', class: 'Class 8', school: 'Ryan International', subscription: 'Yearly', status: 'active', joinDate: '2024-02-28' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
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
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
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

  const handleSaveStudent = () => {
    if (editingStudent) {
      setStudents(students.map(s => 
        s.id === editingStudent.id 
          ? { ...s, ...formData } 
          : s
      ));
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
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
            <Upload size={18} />
            Import
          </button>
          <button className="btn btn-outline">
            <Download size={18} />
            Export
          </button>
          <button className="btn btn-primary" onClick={handleAddStudent}>
            <Plus size={18} />
            Add Student
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search students..." 
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
        <button className="btn btn-outline btn-sm">
          <Filter size={16} />
          More Filters
        </button>
      </div>

      {/* Students Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Students ({filteredStudents.length})</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Contact</th>
              <th>Class</th>
              <th>School</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="student-info">
                    <div className="student-avatar">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="student-name">{student.name}</p>
                      <span className="student-id">ID: {student.id}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <span><Mail size={14} /> {student.email}</span>
                    <span><Phone size={14} /> {student.phone}</span>
                  </div>
                </td>
                <td>{student.class}</td>
                <td>{student.school}</td>
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
                <td>{student.joinDate}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn" title="View">
                      <Eye size={16} />
                    </button>
                    <button className="action-btn" title="Edit" onClick={() => handleEditStudent(student)}>
                      <Edit size={16} />
                    </button>
                    <button 
                      className="action-btn danger" 
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

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredStudents.length} of {students.length} students</span>
          <div className="pagination-buttons">
            <button className="pagination-btn" disabled>Previous</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">2</button>
            <button className="pagination-btn">3</button>
            <button className="pagination-btn">Next</button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
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
                <Check size={18} />
                {editingStudent ? 'Save Changes' : 'Add Student'}
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
                <p>Are you sure you want to delete this student? This action cannot be undone.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteStudent(showDeleteConfirm)}>
                <Trash2 size={18} />
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsManagement;
