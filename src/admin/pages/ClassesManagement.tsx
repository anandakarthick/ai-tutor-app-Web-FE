/**
 * Classes Management Page
 */

import { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Users,
  BookOpen,
} from 'lucide-react';
import './AdminPages.css';

interface ClassData {
  id: string;
  name: string;
  displayName: string;
  board: string;
  description: string;
  totalStudents: number;
  totalSubjects: number;
  status: 'active' | 'inactive';
}

export function ClassesManagement() {
  const [classes, setClasses] = useState<ClassData[]>([
    { id: '1', name: 'class_1', displayName: 'Class 1', board: 'CBSE', description: 'First grade students', totalStudents: 245, totalSubjects: 5, status: 'active' },
    { id: '2', name: 'class_2', displayName: 'Class 2', board: 'CBSE', description: 'Second grade students', totalStudents: 312, totalSubjects: 5, status: 'active' },
    { id: '3', name: 'class_3', displayName: 'Class 3', board: 'CBSE', description: 'Third grade students', totalStudents: 289, totalSubjects: 6, status: 'active' },
    { id: '4', name: 'class_4', displayName: 'Class 4', board: 'CBSE', description: 'Fourth grade students', totalStudents: 356, totalSubjects: 6, status: 'active' },
    { id: '5', name: 'class_5', displayName: 'Class 5', board: 'CBSE', description: 'Fifth grade students', totalStudents: 401, totalSubjects: 7, status: 'active' },
    { id: '6', name: 'class_6', displayName: 'Class 6', board: 'CBSE', description: 'Sixth grade students', totalStudents: 478, totalSubjects: 8, status: 'active' },
    { id: '7', name: 'class_7', displayName: 'Class 7', board: 'CBSE', description: 'Seventh grade students', totalStudents: 512, totalSubjects: 8, status: 'active' },
    { id: '8', name: 'class_8', displayName: 'Class 8', board: 'CBSE', description: 'Eighth grade students', totalStudents: 567, totalSubjects: 8, status: 'active' },
    { id: '9', name: 'class_9', displayName: 'Class 9', board: 'CBSE', description: 'Ninth grade students', totalStudents: 623, totalSubjects: 9, status: 'active' },
    { id: '10', name: 'class_10', displayName: 'Class 10', board: 'CBSE', description: 'Board exam year', totalStudents: 689, totalSubjects: 9, status: 'active' },
    { id: '11', name: 'class_11', displayName: 'Class 11', board: 'CBSE', description: 'Higher secondary first year', totalStudents: 534, totalSubjects: 5, status: 'active' },
    { id: '12', name: 'class_12', displayName: 'Class 12', board: 'CBSE', description: 'Board exam year', totalStudents: 456, totalSubjects: 5, status: 'active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [boardFilter, setBoardFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    board: 'CBSE',
    description: '',
    status: 'active',
  });

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBoard = boardFilter === 'all' || cls.board === boardFilter;
    return matchesSearch && matchesBoard;
  });

  const handleAddClass = () => {
    setEditingClass(null);
    setFormData({ name: '', displayName: '', board: 'CBSE', description: '', status: 'active' });
    setShowModal(true);
  };

  const handleEditClass = (cls: ClassData) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      displayName: cls.displayName,
      board: cls.board,
      description: cls.description,
      status: cls.status,
    });
    setShowModal(true);
  };

  const handleSaveClass = () => {
    if (editingClass) {
      setClasses(classes.map(c => 
        c.id === editingClass.id 
          ? { ...c, ...formData } 
          : c
      ));
    } else {
      const newClass: ClassData = {
        id: Date.now().toString(),
        ...formData,
        totalStudents: 0,
        totalSubjects: 0,
        status: formData.status as 'active' | 'inactive',
      };
      setClasses([...classes, newClass]);
    }
    setShowModal(false);
  };

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter(c => c.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Classes Management</h1>
          <p>Manage academic classes and grades</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddClass}>
            <Plus size={18} />
            Add Class
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search classes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
          <option value="all">All Boards</option>
          <option value="CBSE">CBSE</option>
          <option value="ICSE">ICSE</option>
          <option value="State Board">State Board</option>
        </select>
      </div>

      {/* Classes Grid */}
      <div className="classes-grid">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="class-card">
            <div className="class-header">
              <div className="class-icon">
                <GraduationCap size={24} />
              </div>
              <span className={`status-badge ${cls.status}`}>{cls.status}</span>
            </div>
            <h3>{cls.displayName}</h3>
            <p className="class-board">{cls.board}</p>
            <p className="class-desc">{cls.description}</p>
            <div className="class-stats">
              <div>
                <Users size={16} />
                <span>{cls.totalStudents} Students</span>
              </div>
              <div>
                <BookOpen size={16} />
                <span>{cls.totalSubjects} Subjects</span>
              </div>
            </div>
            <div className="class-actions">
              <button className="btn btn-outline btn-sm" onClick={() => handleEditClass(cls)}>
                <Edit size={14} /> Edit
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowDeleteConfirm(cls.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingClass ? 'Edit Class' : 'Add New Class'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Class Name (Internal) <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., class_1"
                  />
                </div>
                <div className="form-group">
                  <label>Display Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="e.g., Class 1"
                  />
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
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter class description"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveClass}>
                <Check size={18} />
                {editingClass ? 'Save Changes' : 'Add Class'}
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
                <p>Are you sure you want to delete this class? All subject mappings will be removed.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteClass(showDeleteConfirm)}>
                <Trash2 size={18} /> Delete Class
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassesManagement;
