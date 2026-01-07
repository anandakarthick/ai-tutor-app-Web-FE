/**
 * Subjects Management Page
 */

import { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Palette,
} from 'lucide-react';
import './AdminPages.css';

interface Subject {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  status: 'active' | 'inactive';
}

const iconOptions = ['📐', '🧪', '📚', '🔤', '🌍', '💻', '🎨', '🎵', '⚽', '🧮'];
const colorOptions = ['#F97316', '#3B82F6', '#22C55E', '#8B5CF6', '#EC4899', '#14B8A6', '#F59E0B', '#EF4444'];

export function SubjectsManagement() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'mathematics', displayName: 'Mathematics', description: 'Numbers, algebra, geometry', icon: '📐', color: '#F97316', status: 'active' },
    { id: '2', name: 'science', displayName: 'Science', description: 'Physics, Chemistry, Biology basics', icon: '🧪', color: '#22C55E', status: 'active' },
    { id: '3', name: 'english', displayName: 'English', description: 'Language and literature', icon: '📚', color: '#3B82F6', status: 'active' },
    { id: '4', name: 'hindi', displayName: 'Hindi', description: 'Hindi language and literature', icon: '🔤', color: '#EC4899', status: 'active' },
    { id: '5', name: 'social_science', displayName: 'Social Science', description: 'History, Geography, Civics', icon: '🌍', color: '#8B5CF6', status: 'active' },
    { id: '6', name: 'physics', displayName: 'Physics', description: 'Advanced physics for higher classes', icon: '⚡', color: '#3B82F6', status: 'active' },
    { id: '7', name: 'chemistry', displayName: 'Chemistry', description: 'Advanced chemistry', icon: '🧪', color: '#14B8A6', status: 'active' },
    { id: '8', name: 'biology', displayName: 'Biology', description: 'Life sciences', icon: '🧬', color: '#22C55E', status: 'active' },
    { id: '9', name: 'computer_science', displayName: 'Computer Science', description: 'Programming and IT', icon: '💻', color: '#6366F1', status: 'active' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    icon: '📐',
    color: '#F97316',
    status: 'active',
  });

  const filteredSubjects = subjects.filter(subject => 
    subject.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubject = () => {
    setEditingSubject(null);
    setFormData({ name: '', displayName: '', description: '', icon: '📐', color: '#F97316', status: 'active' });
    setShowModal(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
    setFormData({
      name: subject.name,
      displayName: subject.displayName,
      description: subject.description,
      icon: subject.icon,
      color: subject.color,
      status: subject.status,
    });
    setShowModal(true);
  };

  const handleSaveSubject = () => {
    if (editingSubject) {
      setSubjects(subjects.map(s => 
        s.id === editingSubject.id 
          ? { ...s, ...formData } 
          : s
      ));
    } else {
      const newSubject: Subject = {
        id: Date.now().toString(),
        ...formData,
        status: formData.status as 'active' | 'inactive',
      };
      setSubjects([...subjects, newSubject]);
    }
    setShowModal(false);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subjects Management</h1>
          <p>Manage academic subjects</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddSubject}>
            <Plus size={18} />
            Add Subject
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search subjects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="subjects-grid">
        {filteredSubjects.map((subject) => (
          <div key={subject.id} className="subject-card">
            <div className="subject-header">
              <div className="subject-icon" style={{ background: `${subject.color}15`, color: subject.color }}>
                <span style={{ fontSize: '28px' }}>{subject.icon}</span>
              </div>
              <span className={`status-badge ${subject.status}`}>{subject.status}</span>
            </div>
            <h3>{subject.displayName}</h3>
            <p className="subject-desc">{subject.description}</p>
            <div className="subject-color">
              <Palette size={14} />
              <span style={{ background: subject.color, width: '20px', height: '20px', borderRadius: '4px', display: 'inline-block' }}></span>
              <span>{subject.color}</span>
            </div>
            <div className="subject-actions">
              <button className="btn btn-outline btn-sm" onClick={() => handleEditSubject(subject)}>
                <Edit size={14} /> Edit
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowDeleteConfirm(subject.id)}>
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
              <h3>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Subject Name (Internal) <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., mathematics"
                  />
                </div>
                <div className="form-group">
                  <label>Display Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Enter subject description"
                  />
                </div>
                <div className="form-group">
                  <label>Icon</label>
                  <div className="icon-picker">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                        onClick={() => setFormData({...formData, icon})}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <div className="color-picker">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-option ${formData.color === color ? 'selected' : ''}`}
                        style={{ background: color }}
                        onClick={() => setFormData({...formData, color})}
                      />
                    ))}
                  </div>
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
              <button className="btn btn-primary" onClick={handleSaveSubject}>
                <Check size={18} />
                {editingSubject ? 'Save Changes' : 'Add Subject'}
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
                <p>Are you sure you want to delete this subject? This will affect all class mappings.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeleteSubject(showDeleteConfirm)}>
                <Trash2 size={18} /> Delete Subject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectsManagement;
