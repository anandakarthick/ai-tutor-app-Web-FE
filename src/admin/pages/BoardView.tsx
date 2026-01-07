/**
 * View Board Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  BookOpen,
  Users,
  GraduationCap,
  MapPin,
  Calendar,
  Hash,
  AlertCircle,
  X,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getBoardById, deleteBoard } from '../../services/api/admin';
import './AdminPages.css';

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

export function BoardView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<Board | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchBoard();
    }
  }, [id]);

  const fetchBoard = async () => {
    setLoading(true);
    try {
      const response = await getBoardById(id!);
      if (response.success && response.data) {
        setBoard(response.data);
      }
    } catch (error) {
      console.error('Error fetching board:', error);
      toast.error('Failed to load board details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!board) return;

    setDeleting(true);
    try {
      const response = await deleteBoard(board.id);
      if (response.success) {
        toast.success('Board deleted successfully');
        navigate('/admin/boards');
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
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading board details...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="admin-page">
        <div className="not-found-container">
          <AlertCircle size={64} />
          <h2>Board Not Found</h2>
          <p>The board you're looking for doesn't exist or has been deleted.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/boards')}>
            <ArrowLeft size={16} />
            Back to Boards
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/boards')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Board Details</h1>
            <p>View information about this education board</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/admin/boards/${board.id}/edit`)}>
            <Edit2 size={16} />
            Edit
          </button>
          <button className="btn btn-danger-outline" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="view-page-container">
        {/* Main Info Card */}
        <div className="view-card view-card-main">
          <div className="view-card-hero">
            <div className="view-hero-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
              <BookOpen size={32} />
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{board.name}</h2>
                <span className={`status-badge-lg ${board.isActive ? 'success' : 'inactive'}`}>
                  {board.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                </span>
              </div>
              <p className="view-hero-subtitle">{board.fullName}</p>
              {board.state && (
                <div className="view-hero-location">
                  <MapPin size={14} />
                  <span>{board.state}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="view-stats-row">
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
                <GraduationCap size={20} />
              </div>
              <div className="view-stat-content">
                <span className="view-stat-value">{board.classCount || 0}</span>
                <span className="view-stat-label">Classes</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
                <Users size={20} />
              </div>
              <div className="view-stat-content">
                <span className="view-stat-value">{(board.studentCount || 0).toLocaleString()}</span>
                <span className="view-stat-label">Students</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
                <Hash size={20} />
              </div>
              <div className="view-stat-content">
                <span className="view-stat-value">{board.displayOrder}</span>
                <span className="view-stat-label">Display Order</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {board.description && (
            <div className="view-section">
              <h3 className="view-section-title">Description</h3>
              <p className="view-description">{board.description}</p>
            </div>
          )}

          {/* Logo */}
          {board.logoUrl && (
            <div className="view-section">
              <h3 className="view-section-title">Logo</h3>
              <a href={board.logoUrl} target="_blank" rel="noopener noreferrer" className="view-link">
                <ExternalLink size={14} />
                {board.logoUrl}
              </a>
            </div>
          )}
        </div>

        {/* Meta Info Card */}
        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Additional Information</h3>
          
          <div className="view-meta-list">
            <div className="view-meta-item">
              <span className="view-meta-label">
                <Hash size={14} />
                Board ID
              </span>
              <span className="view-meta-value code">{board.id}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label">
                <Calendar size={14} />
                Created On
              </span>
              <span className="view-meta-value">{formatDate(board.createdAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label">
                <Clock size={14} />
                Last Updated
              </span>
              <span className="view-meta-value">{formatDateTime(board.updatedAt)}</span>
            </div>
          </div>

          <div className="view-actions-section">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/admin/boards/${board.id}/edit`)}>
              <Edit2 size={16} />
              Edit Board
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
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
                  You are about to delete the board <strong>"{board.name}"</strong>. 
                  This action cannot be undone.
                </p>
                {(board.classCount || 0) > 0 && (
                  <div className="warning-box">
                    <AlertCircle size={16} />
                    <span>This board has {board.classCount} associated classes. You must reassign or delete them first.</span>
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
                onClick={handleDelete}
                disabled={deleting || (board.classCount || 0) > 0}
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

export default BoardView;
