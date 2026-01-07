/**
 * Boards List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  X,
  Loader2,
  RefreshCw,
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
  AlertCircle,
  MoreVertical,
  CheckCircle,
  Calendar,
  Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBoards, deleteBoard } from '../../services/api/admin';
import './AdminPages.css';
import './AdminPagesExtra.css';

interface Board {
  id: string;
  name: string;
  fullName: string;
  state?: string;
  description?: string;
  logoUrl?: string;
  isActive: boolean;
  displayOrder: number;
  classCount?: number;
  studentCount?: number;
  createdAt: string;
  updatedAt: string;
}

const boardColors = [
  'linear-gradient(135deg, #3B82F6, #60A5FA)',
  'linear-gradient(135deg, #8B5CF6, #A78BFA)',
  'linear-gradient(135deg, #F97316, #FB923C)',
  'linear-gradient(135deg, #22C55E, #4ADE80)',
  'linear-gradient(135deg, #EC4899, #F472B6)',
  'linear-gradient(135deg, #06B6D4, #22D3EE)',
  'linear-gradient(135deg, #EF4444, #F87171)',
  'linear-gradient(135deg, #6366F1, #818CF8)',
];

export function BoardsManagement() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [allBoards, setAllBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    // Filter boards based on status
    let filtered = [...allBoards];
    if (statusFilter === 'active') {
      filtered = filtered.filter(b => b.isActive);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(b => !b.isActive);
    }
    setBoards(filtered);
  }, [statusFilter, allBoards]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchBoards = async () => {
    setLoading(true);
    try {
      const response = await getBoards({ search: searchQuery });
      if (response.success) {
        setAllBoards(response.data);
        setBoards(response.data);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
      toast.error('Failed to load boards');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchBoards();
  };

  const openDeleteModal = (board: Board) => {
    setSelectedBoard(board);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const handleDeleteBoard = async () => {
    if (!selectedBoard) return;

    setDeleting(true);
    try {
      const response = await deleteBoard(selectedBoard.id);
      if (response.success) {
        toast.success('Board deleted successfully');
        setShowDeleteModal(false);
        fetchBoards();
      }
    } catch (error: any) {
      console.error('Error deleting board:', error);
      toast.error(error.response?.data?.message || 'Failed to delete board');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getBoardColor = (index: number) => {
    return boardColors[index % boardColors.length];
  };

  if (loading && boards.length === 0) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading boards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Boards Management</h1>
          <p>Manage education boards (CBSE, ICSE, State Boards, etc.)</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchBoards}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/boards/add')}>
            <Plus size={16} />
            Add Board
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <BookOpen size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Boards</p>
            <h3 className="stat-value">{allBoards.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Boards</p>
            <h3 className="stat-value">{allBoards.filter(b => b.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <GraduationCap size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Classes</p>
            <h3 className="stat-value">{allBoards.reduce((sum, b) => sum + (b.classCount || 0), 0)}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <Users size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Students</p>
            <h3 className="stat-value">{allBoards.reduce((sum, b) => sum + (b.studentCount || 0), 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="board-filters">
        <div className="board-search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by name, full name, or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          {searchQuery && (
            <button className="clear-search" onClick={() => { setSearchQuery(''); fetchBoards(); }}>
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="board-filter-tabs">
          <button 
            className={`filter-tab ${statusFilter === '' ? 'active' : ''}`}
            onClick={() => setStatusFilter('')}
          >
            <span className="tab-dot all" />
            All
            <span className="tab-count">{allBoards.length}</span>
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            <span className="tab-dot active" />
            Active
            <span className="tab-count">{allBoards.filter(b => b.isActive).length}</span>
          </button>
          <button 
            className={`filter-tab ${statusFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            <span className="tab-dot inactive" />
            Inactive
            <span className="tab-count">{allBoards.filter(b => !b.isActive).length}</span>
          </button>
        </div>
      </div>

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <div className="data-grid">
          <div className="empty-state">
            <BookOpen size={64} />
            <h3>No boards found</h3>
            <p>Click "Add Board" to create a new education board</p>
            <button className="btn btn-primary" onClick={() => navigate('/admin/boards/add')} style={{ marginTop: '16px' }}>
              <Plus size={16} />
              Add Board
            </button>
          </div>
        </div>
      ) : (
        <div className="boards-grid">
          {boards.map((board, index) => (
            <div key={board.id} className={`board-card ${!board.isActive ? 'inactive' : ''}`}>
              <div className="board-card-header">
                <div className="board-icon" style={{ background: getBoardColor(index) }}>
                  <BookOpen size={24} />
                </div>
                <div className="board-actions">
                  <div className="dropdown-wrapper">
                    <button 
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === board.id ? null : board.id);
                      }}
                    >
                      <MoreVertical size={18} />
                    </button>
                    {activeDropdown === board.id && (
                      <div className="dropdown-menu">
                        <button onClick={() => navigate(`/admin/boards/${board.id}`)}>
                          <Eye size={14} />
                          View Details
                        </button>
                        <button onClick={() => navigate(`/admin/boards/${board.id}/edit`)}>
                          <Edit2 size={14} />
                          Edit Board
                        </button>
                        <button className="danger" onClick={() => openDeleteModal(board)}>
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="board-card-body" onClick={() => navigate(`/admin/boards/${board.id}`)}>
                <div className="board-name-row">
                  <h3>{board.name}</h3>
                  <span className={`status-dot ${board.isActive ? 'active' : 'inactive'}`} />
                </div>
                <p className="board-fullname">{board.fullName}</p>
                
                {board.state && (
                  <div className="board-location">
                    <MapPin size={12} />
                    <span>{board.state}</span>
                  </div>
                )}

                {board.description && (
                  <p className="board-description">{board.description}</p>
                )}
              </div>

              <div className="board-card-footer">
                <div className="board-stat">
                  <GraduationCap size={14} />
                  <span>{board.classCount || 0} Classes</span>
                </div>
                <div className="board-stat">
                  <Users size={14} />
                  <span>{(board.studentCount || 0).toLocaleString()} Students</span>
                </div>
              </div>

              <div className="board-card-meta">
                <span className="order-badge">
                  <Hash size={10} />
                  {board.displayOrder}
                </span>
                <span className="date-info">
                  <Calendar size={10} />
                  {formatDate(board.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBoard && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Board</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>
                  You are about to delete the board <strong>"{selectedBoard.name}"</strong>. 
                  This action cannot be undone.
                </p>
                {(selectedBoard.classCount || 0) > 0 && (
                  <div className="warning-box">
                    <AlertCircle size={16} />
                    <span>This board has {selectedBoard.classCount} associated classes. You must reassign or delete them first.</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleDeleteBoard}
                disabled={deleting || (selectedBoard.classCount || 0) > 0}
              >
                {deleting ? <><Loader2 size={16} className="spinner" /> Deleting...</> : 'Delete Board'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BoardsManagement;
