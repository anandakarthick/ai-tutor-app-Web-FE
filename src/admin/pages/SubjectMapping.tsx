/**
 * Subject Mapping Page
 * Maps subjects to classes
 */

import { useState, useEffect } from 'react';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSubjects, getClasses, getBoards } from '../../services/api/admin';
import './AdminPages.css';

interface SubjectMapping {
  id: string;
  class: {
    id: string;
    className: string;
    displayName?: string;
  };
  subject: {
    id: string;
    subjectName: string;
    displayName?: string;
    icon?: string;
    color?: string;
  };
  board?: {
    id: string;
    name: string;
    fullName: string;
  };
  chapters?: number;
  topics?: number;
  isActive: boolean;
}

interface ClassOption {
  id: string;
  className: string;
  board?: {
    boardName: string;
  };
}

interface BoardOption {
  id: string;
  name: string;
  fullName: string;
}

export function SubjectMapping() {
  const [mappings, setMappings] = useState<SubjectMapping[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [boards, setBoards] = useState<BoardOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [boardFilter, setBoardFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingMapping, setViewingMapping] = useState<SubjectMapping | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchMappings();
  }, [classFilter, boardFilter]);

  const fetchInitialData = async () => {
    try {
      const [classesRes, boardsRes] = await Promise.all([
        getClasses(),
        getBoards(),
      ]);

      if (classesRes.success) {
        setClasses(classesRes.data);
      }
      if (boardsRes.success) {
        setBoards(boardsRes.data);
      }
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchMappings = async () => {
    setLoading(true);
    try {
      const filters: any = {};
      if (classFilter !== 'all') filters.classId = classFilter;

      const response = await getSubjects(filters);
      
      if (response.success) {
        // Transform subjects into mapping format
        const subjectMappings: SubjectMapping[] = response.data
          .filter((s: any) => s.class)
          .map((subject: any) => ({
            id: subject.id,
            class: subject.class,
            subject: {
              id: subject.id,
              subjectName: subject.subjectName,
              displayName: subject.displayName,
              icon: subject.icon,
              color: subject.color,
            },
            board: subject.class?.board,
            chapters: Math.floor(Math.random() * 20) + 5, // Mock data
            topics: Math.floor(Math.random() * 100) + 20, // Mock data
            isActive: subject.isActive,
          }));
        
        setMappings(subjectMappings);
      }
    } catch (error) {
      console.error('Error fetching mappings:', error);
      toast.error('Failed to load subject mappings');
    } finally {
      setLoading(false);
    }
  };

  const filteredMappings = mappings.filter(mapping => {
    const searchMatch = 
      mapping.class.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.subject.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mapping.subject.displayName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const boardMatch = boardFilter === 'all' || mapping.board?.id === boardFilter;
    
    return searchMatch && boardMatch;
  });

  const handleViewMapping = (mapping: SubjectMapping) => {
    setViewingMapping(mapping);
    setShowViewModal(true);
  };

  const totalChapters = mappings.reduce((acc, m) => acc + (m.chapters || 0), 0);
  const totalTopics = mappings.reduce((acc, m) => acc + (m.topics || 0), 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subject Mapping</h1>
          <p>View class-subject relationships and content coverage</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchMappings}>
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <Layers size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Mappings</p>
            <h3 className="stat-value">{mappings.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <GraduationCap size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Classes</p>
            <h3 className="stat-value">{classes.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Chapters</p>
            <h3 className="stat-value">{totalChapters}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Check size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Topics</p>
            <h3 className="stat-value">{totalTopics}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by class or subject..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
          <option value="all">All Classes</option>
          {classes.map(cls => (
            <option key={cls.id} value={cls.id}>{cls.className}</option>
          ))}
        </select>
        <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
          <option value="all">All Boards</option>
          {boards.map(board => (
            <option key={board.id} value={board.id}>{board.fullName}</option>
          ))}
        </select>
      </div>

      {/* Mappings Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>Class-Subject Mappings ({filteredMappings.length})</h3>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '60px 20px' }}>
            <Loader2 size={32} className="spinner" />
            <p>Loading mappings...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Subject</th>
                    <th>Board</th>
                    <th>Chapters</th>
                    <th>Topics</th>
                    <th>Status</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMappings.map((mapping) => (
                    <tr key={mapping.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                            <GraduationCap size={16} />
                          </div>
                          <span className="user-name">{mapping.class.displayName || mapping.class.className}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div 
                            className="user-avatar" 
                            style={{ 
                              background: `${mapping.subject.color || '#F97316'}20`, 
                              color: mapping.subject.color || '#F97316',
                              fontSize: '16px'
                            }}
                          >
                            {mapping.subject.icon || <BookOpen size={16} />}
                          </div>
                          <span className="user-name">{mapping.subject.displayName || mapping.subject.subjectName}</span>
                        </div>
                      </td>
                      <td>
                        <span className="plan-badge monthly">{mapping.board?.fullName || '-'}</span>
                      </td>
                      <td>
                        <span className="number-cell">{mapping.chapters || 0}</span>
                      </td>
                      <td>
                        <span className="number-cell">{mapping.topics || 0}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${mapping.isActive ? 'active' : 'inactive'}`}>
                          {mapping.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'center' }}>
                          <button 
                            className="table-action-btn view" 
                            title="View Details"
                            onClick={() => handleViewMapping(mapping)}
                          >
                            <Eye size={15} />
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
                <p>Subject mappings will appear here once subjects are assigned to classes</p>
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
                <button className="pagination-btn" disabled>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Mapping Modal */}
      {showViewModal && viewingMapping && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '450px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Mapping Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                  <Layers size={28} />
                </div>
                <h3>{viewingMapping.class.className} - {viewingMapping.subject.displayName || viewingMapping.subject.subjectName}</h3>
                <span className={`status-badge ${viewingMapping.isActive ? 'active' : 'inactive'}`}>
                  {viewingMapping.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Class</label>
                  <span>{viewingMapping.class.displayName || viewingMapping.class.className}</span>
                </div>
                <div className="detail-item">
                  <label>Subject</label>
                  <span>{viewingMapping.subject.displayName || viewingMapping.subject.subjectName}</span>
                </div>
                <div className="detail-item">
                  <label>Board</label>
                  <span>{viewingMapping.board?.fullName || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Chapters</label>
                  <span className="highlight">{viewingMapping.chapters || 0}</span>
                </div>
                <div className="detail-item">
                  <label>Topics</label>
                  <span className="highlight success">{viewingMapping.topics || 0}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubjectMapping;
