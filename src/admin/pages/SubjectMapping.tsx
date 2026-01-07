/**
 * Subject Mapping Page - Map subjects to classes
 */

import { useState } from 'react';
import {
  Layers,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  GraduationCap,
  BookOpen,
} from 'lucide-react';
import './AdminPages.css';

interface SubjectMapping {
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
  const [mappings, setMappings] = useState<SubjectMapping[]>([
    { id: '1', classId: '10', className: 'Class 10', subjectId: '1', subjectName: 'Mathematics', board: 'CBSE', chapters: 15, topics: 120, status: 'active' },
    { id: '2', classId: '10', className: 'Class 10', subjectId: '2', subjectName: 'Science', board: 'CBSE', chapters: 16, topics: 95, status: 'active' },
    { id: '3', classId: '10', className: 'Class 10', subjectId: '3', subjectName: 'English', board: 'CBSE', chapters: 12, topics: 60, status: 'active' },
    { id: '4', classId: '10', className: 'Class 10', subjectId: '5', subjectName: 'Social Science', board: 'CBSE', chapters: 20, topics: 85, status: 'active' },
    { id: '5', classId: '9', className: 'Class 9', subjectId: '1', subjectName: 'Mathematics', board: 'CBSE', chapters: 15, topics: 110, status: 'active' },
    { id: '6', classId: '9', className: 'Class 9', subjectId: '2', subjectName: 'Science', board: 'CBSE', chapters: 15, topics: 90, status: 'active' },
    { id: '7', classId: '12', className: 'Class 12', subjectId: '6', subjectName: 'Physics', board: 'CBSE', chapters: 14, topics: 100, status: 'active' },
    { id: '8', classId: '12', className: 'Class 12', subjectId: '7', subjectName: 'Chemistry', board: 'CBSE', chapters: 16, topics: 95, status: 'active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingMapping, setEditingMapping] = useState<SubjectMapping | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'];
  const subjects = ['Mathematics', 'Science', 'English', 'Hindi', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];

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

  const filteredMappings = mappings.filter(mapping => {
    const matchesSearch = mapping.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         mapping.className.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = classFilter === 'all' || mapping.className === classFilter;
    return matchesSearch && matchesClass;
  });

  const handleAddMapping = () => {
    setEditingMapping(null);
    setFormData({ classId: '', className: '', subjectId: '', subjectName: '', board: 'CBSE', chapters: 0, topics: 0, status: 'active' });
    setShowModal(true);
  };

  const handleEditMapping = (mapping: SubjectMapping) => {
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

  const handleSaveMapping = () => {
    if (editingMapping) {
      setMappings(mappings.map(m => 
        m.id === editingMapping.id 
          ? { ...m, ...formData } 
          : m
      ));
    } else {
      const newMapping: SubjectMapping = {
        id: Date.now().toString(),
        ...formData,
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

  // Group mappings by class
  const groupedMappings = filteredMappings.reduce((acc, mapping) => {
    if (!acc[mapping.className]) {
      acc[mapping.className] = [];
    }
    acc[mapping.className].push(mapping);
    return acc;
  }, {} as Record<string, SubjectMapping[]>);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subject Mapping</h1>
          <p>Map subjects to classes and manage curriculum</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddMapping}>
            <Plus size={18} />
            Add Mapping
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search mappings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>

      {/* Mappings by Class */}
      <div className="mapping-container">
        {Object.entries(groupedMappings).map(([className, classSubjects]) => (
          <div key={className} className="mapping-group">
            <div className="mapping-group-header">
              <GraduationCap size={20} />
              <h3>{className}</h3>
              <span className="subject-count">{classSubjects.length} Subjects</span>
            </div>
            <div className="mapping-subjects">
              {classSubjects.map((mapping) => (
                <div key={mapping.id} className="mapping-card">
                  <div className="mapping-info">
                    <BookOpen size={18} />
                    <div>
                      <h4>{mapping.subjectName}</h4>
                      <span>{mapping.board} • {mapping.chapters} Chapters • {mapping.topics} Topics</span>
                    </div>
                  </div>
                  <div className="mapping-actions">
                    <span className={`status-badge ${mapping.status}`}>{mapping.status}</span>
                    <button className="action-btn" onClick={() => handleEditMapping(mapping)}>
                      <Edit size={16} />
                    </button>
                    <button className="action-btn danger" onClick={() => setShowDeleteConfirm(mapping.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingMapping ? 'Edit Mapping' : 'Add Subject Mapping'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Class <span>*</span></label>
                  <select 
                    value={formData.className}
                    onChange={(e) => setFormData({...formData, className: e.target.value, classId: e.target.value})}
                  >
                    <option value="">Select Class</option>
                    {classes.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Subject <span>*</span></label>
                  <select 
                    value={formData.subjectName}
                    onChange={(e) => setFormData({...formData, subjectName: e.target.value, subjectId: e.target.value})}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
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
                  <label>Chapters</label>
                  <input 
                    type="number" 
                    value={formData.chapters}
                    onChange={(e) => setFormData({...formData, chapters: parseInt(e.target.value) || 0})}
                    placeholder="Number of chapters"
                  />
                </div>
                <div className="form-group">
                  <label>Topics</label>
                  <input 
                    type="number" 
                    value={formData.topics}
                    onChange={(e) => setFormData({...formData, topics: parseInt(e.target.value) || 0})}
                    placeholder="Number of topics"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveMapping}>
                <Check size={18} />
                {editingMapping ? 'Save Changes' : 'Add Mapping'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
                <p>Are you sure you want to delete this subject mapping?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteMapping(showDeleteConfirm)}>
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectMapping;
