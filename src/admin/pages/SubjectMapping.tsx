/**
 * Subject Mapping Page
 */

import { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  List,
} from 'lucide-react';
import './AdminPages.css';

interface MappingData {
  id: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  board: string;
  chapters: number;
  topics: number;
  status: 'active' | 'inactive';
}

export function SubjectMapping() {
  const [mappings, setMappings] = useState<MappingData[]>([
    { id: 'MAP001', classId: 'CLS009', className: 'Class 9', subjectId: 'SUB001', subjectName: 'Mathematics', board: 'CBSE', chapters: 15, topics: 120, status: 'active' },
    { id: 'MAP002', classId: 'CLS009', className: 'Class 9', subjectId: 'SUB002', subjectName: 'Science', board: 'CBSE', chapters: 15, topics: 98, status: 'active' },
    { id: 'MAP003', classId: 'CLS009', className: 'Class 9', subjectId: 'SUB003', subjectName: 'English', board: 'CBSE', chapters: 12, topics: 85, status: 'active' },
    { id: 'MAP004', classId: 'CLS010', className: 'Class 10', subjectId: 'SUB001', subjectName: 'Mathematics', board: 'CBSE', chapters: 15, topics: 130, status: 'active' },
    { id: 'MAP005', classId: 'CLS010', className: 'Class 10', subjectId: 'SUB002', subjectName: 'Science', board: 'CBSE', chapters: 16, topics: 112, status: 'active' },
    { id: 'MAP006', classId: 'CLS010', className: 'Class 10', subjectId: 'SUB003', subjectName: 'English', board: 'CBSE', chapters: 14, topics: 92, status: 'active' },
    { id: 'MAP007', classId: 'CLS012', className: 'Class 12', subjectId: 'SUB006', subjectName: 'Physics', board: 'CBSE', chapters: 14, topics: 156, status: 'active' },
    { id: 'MAP008', classId: 'CLS012', className: 'Class 12', subjectId: 'SUB007', subjectName: 'Chemistry', board: 'CBSE', chapters: 16, topics: 178, status: 'active' },
    { id: 'MAP009', classId: 'CLS011', className: 'Class 11', subjectId: 'SUB006', subjectName: 'Physics', board: 'CBSE', chapters: 15, topics: 145, status: 'active' },
    { id: 'MAP010', classId: 'CLS011', className: 'Class 11', subjectId: 'SUB007', subjectName: 'Chemistry', board: 'CBSE', chapters: 14, topics: 160, status: 'active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<MappingData | null>(null);
  const [viewingMapping, setViewingMapping] = useState<MappingData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    classId: '',
    className: '',
    subjectId: '',
    subjectName: '',
    board: 'CBSE',
    chapters: 0,
    topics: 0,
    status: 'active',
  });

  const classOptions = [
    { id: 'CLS009', name: 'Class 9' },
    { id: 'CLS010', name: 'Class 10' },
    { id: 'CLS011', name: 'Class 11' },
    { id: 'CLS012', name: 'Class 12' },
  ];

  const subjectOptions = [
    { id: 'SUB001', name: 'Mathematics' },
    { id: 'SUB002', name: 'Science' },
    { id: 'SUB003', name: 'English' },
    { id: 'SUB006', name: 'Physics' },
    { id: 'SUB007', name: 'Chemistry' },
    { id: 'SUB008', name: 'Biology' },
  ];

  const filteredMappings = mappings.filter(mapping => {
    const matchesSearch = mapping.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mapping.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mapping.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || mapping.classId === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleAddMapping = () => {
    setEditingMapping(null);
    setFormData({ classId: '', className: '', subjectId: '', subjectName: '', board: 'CBSE', chapters: 0, topics: 0, status: 'active' });
    setShowModal(true);
  };

  const handleEditMapping = (mapping: MappingData) => {
    setEditingMapping(mapping);
    setFormData({
      classId: mapping.classId,
      className: mapping.className,
      subjectId: mapping.subjectId,
      subjectName: mapping.subjectName,
      board: mapping.board,
      chapters: mapping.chapters,
      topics: mapping.topics,
      status: mapping.status,
    });
    setShowModal(true);
  };

  const handleViewMapping = (mapping: MappingData) => {
    setViewingMapping(mapping);
    setShowViewModal(true);
  };

  const handleSaveMapping = () => {
    const selectedClass = classOptions.find(c => c.id === formData.classId);
    const selectedSubject = subjectOptions.find(s => s.id === formData.subjectId);

    if (editingMapping) {
      setMappings(mappings.map(m => 
        m.id === editingMapping.id 
          ? { 
              ...m, 
              ...formData,
              className: selectedClass?.name || formData.className,
              subjectName: selectedSubject?.name || formData.subjectName,
            } 
          : m
      ));
    } else {
      const newMapping: MappingData = {
        id: `MAP${String(mappings.length + 1).padStart(3, '0')}`,
        ...formData,
        className: selectedClass?.name || '',
        subjectName: selectedSubject?.name || '',
        status: formData.status as 'active' | 'inactive',
      };
      setMappings([...mappings, newMapping]);
    }
    setShowModal(false);
  };

  const handleDeleteMapping = (id: string) => {
    setMappings(mappings.filter(m => m.id !== id));
    setShowDeleteConfirm(null);
  };

  const totalChapters = mappings.reduce((acc, m) => acc + m.chapters, 0);
  const totalTopics = mappings.reduce((acc, m) => acc + m.topics, 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subject Mapping</h1>
          <p>Map subjects to classes with chapters and topics</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddMapping}>
            <Plus size={16} />
            Add Mapping
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Layers size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Mappings</p>
            <h3 className="stat-value">{mappings.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Mappings</p>
            <h3 className="stat-value">{mappings.filter(m => m.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <FileText size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Chapters</p>
            <h3 className="stat-value">{totalChapters}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <List size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Topics</p>
            <h3 className="stat-value">{totalTopics.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search mappings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {classOptions.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.name}</option>
          ))}
        </select>
      </div>

      {/* Mappings Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Mappings ({filteredMappings.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Board</th>
                <th>Chapters</th>
                <th>Topics</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMappings.map((mapping) => (
                <tr key={mapping.id}>
                  <td>
                    <span className="id-badge">{mapping.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                        <GraduationCap size={16} />
                      </div>
                      <span className="user-name">{mapping.className}</span>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                        <BookOpen size={16} />
                      </div>
                      <span className="user-name">{mapping.subjectName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="plan-badge monthly">{mapping.board}</span>
                  </td>
                  <td>
                    <span className="number-cell">{mapping.chapters}</span>
                  </td>
                  <td>
                    <span className="number-cell success">{mapping.topics}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${mapping.status}`}>
                      {mapping.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="table-action-btn view" 
                        title="View Details"
                        onClick={() => handleViewMapping(mapping)}
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        className="table-action-btn edit" 
                        title="Edit"
                        onClick={() => handleEditMapping(mapping)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        className="table-action-btn delete" 
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(mapping.id)}
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

        {filteredMappings.length === 0 && (
          <div className="empty-state">
            <Layers size={48} />
            <h3>No mappings found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredMappings.length} of {mappings.length} mappings</span>
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

      {/* View Mapping Modal */}
      {showViewModal && viewingMapping && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Mapping Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                  <Layers size={28} />
                </div>
                <h3>{viewingMapping.className} - {viewingMapping.subjectName}</h3>
                <span className={`status-badge ${viewingMapping.status}`}>{viewingMapping.status}</span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Mapping ID</label>
                  <span>{viewingMapping.id}</span>
                </div>
                <div className="detail-item">
                  <label>Class</label>
                  <span>{viewingMapping.className}</span>
                </div>
                <div className="detail-item">
                  <label>Subject</label>
                  <span>{viewingMapping.subjectName}</span>
                </div>
                <div className="detail-item">
                  <label>Board</label>
                  <span>{viewingMapping.board}</span>
                </div>
                <div className="detail-item">
                  <label>Total Chapters</label>
                  <span className="highlight">{viewingMapping.chapters}</span>
                </div>
                <div className="detail-item">
                  <label>Total Topics</label>
                  <span className="highlight success">{viewingMapping.topics}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowViewModal(false);
                handleEditMapping(viewingMapping);
              }}>
                <Edit2 size={14} />
                Edit Mapping
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
              <h3>{editingMapping ? 'Edit Mapping' : 'Add New Mapping'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Class <span>*</span></label>
                  <select 
                    value={formData.classId}
                    onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  >
                    <option value="">Select Class</option>
                    {classOptions.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject <span>*</span></label>
                  <select 
                    value={formData.subjectId}
                    onChange={(e) => setFormData({...formData, subjectId: e.target.value})}
                  >
                    <option value="">Select Subject</option>
                    {subjectOptions.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Board</label>
                  <select 
                    value={formData.board}
                    onChange={(e) => setFormData({...formData, board: e.target.value})}
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State Board">State Board</option>
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
                  </select>
                </div>
                <div className="form-group">
                  <label>Number of Chapters</label>
                  <input 
                    type="number" 
                    value={formData.chapters}
                    onChange={(e) => setFormData({...formData, chapters: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Topics</label>
                  <input 
                    type="number" 
                    value={formData.topics}
                    onChange={(e) => setFormData({...formData, topics: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveMapping}>
                <Check size={14} />
                {editingMapping ? 'Save Changes' : 'Add Mapping'}
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
                <p>Are you sure you want to delete this mapping?</p>
                <span>All chapters and topics will be removed.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteMapping(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectMapping;
