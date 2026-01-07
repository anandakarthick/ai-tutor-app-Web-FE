/**
 * View Student Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Loader2,
  Users,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  X,
  GraduationCap,
  BookOpen,
  Trophy,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getStudentById, deleteStudent } from '../../services/api/admin';
import './AdminPages.css';

interface Student {
  id: string;
  studentName: string;
  isActive: boolean;
  xp: number;
  level: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  class?: {
    id: string;
    className: string;
  };
  board?: {
    id: string;
    name: string;
    fullName: string;
  };
  subscription?: {
    plan?: {
      planName: string;
    };
    status: string;
    startDate?: string;
    endDate?: string;
  };
}

export function StudentView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const response = await getStudentById(id!);
      if (response.success && response.data) {
        setStudent(response.data);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
      toast.error('Failed to load student details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;

    setDeleting(true);
    try {
      const response = await deleteStudent(student.id);
      if (response.success) {
        toast.success('Student deleted successfully');
        navigate('/admin/students');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
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
          <p>Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="admin-page">
        <div className="not-found-container">
          <AlertCircle size={64} />
          <h2>Student Not Found</h2>
          <p>The student you're looking for doesn't exist or has been deleted.</p>
          <button className="btn btn-primary" onClick={() => navigate('/admin/students')}>
            <ArrowLeft size={16} />
            Back to Students
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
          <button className="back-btn" onClick={() => navigate('/admin/students')}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1>Student Details</h1>
            <p>View student information and activity</p>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate(`/admin/students/${student.id}/edit`)}>
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
              <span style={{ fontSize: '28px', fontWeight: 'bold' }}>
                {student.studentName?.charAt(0) || 'S'}
              </span>
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{student.studentName}</h2>
                <span className={`status-badge-lg ${student.isActive ? 'success' : 'inactive'}`}>
                  {student.isActive ? <><CheckCircle size={14} /> Active</> : <><XCircle size={14} /> Inactive</>}
                </span>
              </div>
              <p className="view-hero-subtitle">{student.user?.email || 'No email'}</p>
              {student.user?.phone && (
                <div className="view-hero-location">
                  <Phone size={14} />
                  <span>{student.user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="view-stats-row">
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
                <Trophy size={20} />
              </div>
              <div className="view-stat-content">
                <span className="view-stat-value">Level {student.level || 1}</span>
                <span className="view-stat-label">Current Level</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
                <Star size={20} />
              </div>
              <div className="view-stat-content">
                <span className="view-stat-value">{(student.xp || 0).toLocaleString()}</span>
                <span className="view-stat-label">Total XP</span>
              </div>
            </div>
            <div className="view-stat-item">
              <div className="view-stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
                <GraduationCap size={20} />
              </div>
              <div className="view-stat-content">
                <span className="view-stat-value">{student.class?.className || '-'}</span>
                <span className="view-stat-label">Class</span>
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="view-section">
            <h3 className="view-section-title">Academic Information</h3>
            <div className="view-info-grid">
              <div className="view-info-item">
                <span className="view-info-label">Board</span>
                <span className="view-info-value">{student.board?.fullName || student.board?.name || '-'}</span>
              </div>
              <div className="view-info-item">
                <span className="view-info-label">Class</span>
                <span className="view-info-value">{student.class?.className || '-'}</span>
              </div>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="view-section">
            <h3 className="view-section-title">Subscription</h3>
            <div className="subscription-info-card">
              <div className="subscription-icon">
                <CreditCard size={24} />
              </div>
              <div className="subscription-details">
                <h4>{student.subscription?.plan?.planName || 'Free Plan'}</h4>
                <span className={`subscription-status ${student.subscription?.status || 'free'}`}>
                  {student.subscription?.status || 'No active subscription'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Meta Info Card */}
        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Account Information</h3>
          
          <div className="view-meta-list">
            <div className="view-meta-item">
              <span className="view-meta-label">
                <Mail size={14} />
                Email
              </span>
              <span className="view-meta-value">{student.user?.email || '-'}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label">
                <Phone size={14} />
                Phone
              </span>
              <span className="view-meta-value">{student.user?.phone || '-'}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label">
                <Calendar size={14} />
                Joined On
              </span>
              <span className="view-meta-value">{formatDate(student.createdAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label">
                <Clock size={14} />
                Last Updated
              </span>
              <span className="view-meta-value">{formatDateTime(student.updatedAt)}</span>
            </div>
          </div>

          <div className="view-actions-section">
            <button className="btn btn-primary btn-block" onClick={() => navigate(`/admin/students/${student.id}/edit`)}>
              <Edit2 size={16} />
              Edit Student
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Student</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-warning">
                <AlertCircle size={48} />
                <h3>Are you sure?</h3>
                <p>This will deactivate the student account for <strong>"{student.studentName}"</strong>.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? <><Loader2 size={16} className="spinner" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentView;
