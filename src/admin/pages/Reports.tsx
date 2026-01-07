/**
 * Reports Page
 */

import { useState } from 'react';
import {
  FileText,
  Download,
  Calendar,
  Users,
  CreditCard,
  TrendingUp,
  School,
  Clock,
  Mail,
  Play,
  Pause,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  Eye,
  X,
  Plus,
  AlertCircle,
  Check,
  FileSpreadsheet,
  File,
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminPages.css';

interface Report {
  id: string;
  name: string;
  description: string;
  type: string;
  lastGenerated: string;
  generatedBy: string;
  downloads: number;
  status: 'ready' | 'generating' | 'failed';
}

interface ScheduledReport {
  id: string;
  name: string;
  reportType: string;
  schedule: string;
  format: string;
  recipients: string[];
  status: 'active' | 'paused';
  lastSent: string;
  nextRun: string;
}

export function Reports() {
  const [fromDate, setFromDate] = useState('2024-11-01');
  const [toDate, setToDate] = useState('2024-12-01');
  const [generating, setGenerating] = useState<string | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const [reports] = useState<Report[]>([
    { id: 'RPT001', name: 'Students Report', description: 'Complete list of all registered students with details', type: 'Students', lastGenerated: '2024-12-01 10:30', generatedBy: 'Admin', downloads: 45, status: 'ready' },
    { id: 'RPT002', name: 'Revenue Report', description: 'Revenue breakdown by plan, period, and source', type: 'Finance', lastGenerated: '2024-12-01 09:15', generatedBy: 'Admin', downloads: 32, status: 'ready' },
    { id: 'RPT003', name: 'Subscriptions Report', description: 'Active, expired, and upcoming subscription details', type: 'Subscriptions', lastGenerated: '2024-11-30 16:45', generatedBy: 'System', downloads: 28, status: 'ready' },
    { id: 'RPT004', name: 'Platform Usage Report', description: 'User activity, session duration, and engagement metrics', type: 'Analytics', lastGenerated: '2024-11-30 14:20', generatedBy: 'Admin', downloads: 56, status: 'ready' },
    { id: 'RPT005', name: 'Schools Report', description: 'Partner schools with student counts and performance', type: 'Schools', lastGenerated: '2024-11-29 11:00', generatedBy: 'Admin', downloads: 19, status: 'ready' },
    { id: 'RPT006', name: 'Transactions Report', description: 'All payment transactions with status and details', type: 'Finance', lastGenerated: '2024-11-28 15:30', generatedBy: 'System', downloads: 67, status: 'ready' },
  ]);

  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([
    { id: 'SCH001', name: 'Weekly Revenue Summary', reportType: 'Finance', schedule: 'Every Monday, 9:00 AM', format: 'Excel', recipients: ['admin@aitutor.com', 'finance@aitutor.com'], status: 'active', lastSent: '2024-11-25', nextRun: '2024-12-02' },
    { id: 'SCH002', name: 'Monthly User Report', reportType: 'Students', schedule: '1st of every month, 8:00 AM', format: 'PDF', recipients: ['admin@aitutor.com'], status: 'active', lastSent: '2024-12-01', nextRun: '2025-01-01' },
    { id: 'SCH003', name: 'Daily Signups Report', reportType: 'Students', schedule: 'Daily, 6:00 PM', format: 'CSV', recipients: ['marketing@aitutor.com'], status: 'paused', lastSent: '2024-11-20', nextRun: '-' },
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleGenerateReport = async (reportId: string, format: string) => {
    setGenerating(`${reportId}-${format}`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGenerating(null);
    toast.success(`Report generated successfully! Downloading ${format.toUpperCase()}...`);
  };

  const handleViewReport = (report: Report) => {
    setViewingReport(report);
    setShowViewModal(true);
  };

  const toggleScheduleStatus = (id: string) => {
    setScheduledReports(scheduledReports.map(r => 
      r.id === id ? { ...r, status: r.status === 'active' ? 'paused' : 'active' } : r
    ));
    toast.success('Schedule status updated');
  };

  const handleDeleteSchedule = (id: string) => {
    setScheduledReports(scheduledReports.filter(r => r.id !== id));
    setShowDeleteConfirm(null);
    toast.success('Scheduled report deleted');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Students': return Users;
      case 'Finance': return CreditCard;
      case 'Schools': return School;
      case 'Analytics': return TrendingUp;
      case 'Subscriptions': return CreditCard;
      default: return FileText;
    }
  };

  const totalDownloads = reports.reduce((acc, r) => acc + r.downloads, 0);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Generate and schedule automated reports</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Download size={16} />
            Export All
          </button>
          <button className="btn btn-primary" onClick={() => setShowScheduleModal(true)}>
            <Plus size={16} />
            Schedule Report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <FileText size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Reports</p>
            <h3 className="stat-value">{reports.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Download size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Downloads</p>
            <h3 className="stat-value">{totalDownloads}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <Calendar size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Scheduled Reports</p>
            <h3 className="stat-value">{scheduledReports.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Mail size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Schedules</p>
            <h3 className="stat-value">{scheduledReports.filter(r => r.status === 'active').length}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <FileText size={16} />
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="Students">Students</option>
          <option value="Finance">Finance</option>
          <option value="Schools">Schools</option>
          <option value="Analytics">Analytics</option>
          <option value="Subscriptions">Subscriptions</option>
        </select>
        <div className="date-range-filter">
          <label>From:</label>
          <input 
            type="date" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span>to</span>
          <input 
            type="date" 
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>Available Reports ({filteredReports.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Report Name</th>
                <th>Type</th>
                <th>Last Generated</th>
                <th>Generated By</th>
                <th>Downloads</th>
                <th>Status</th>
                <th style={{ width: '180px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => {
                const TypeIcon = getTypeIcon(report.type);
                return (
                  <tr key={report.id}>
                    <td>
                      <span className="id-badge">{report.id}</span>
                    </td>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                          <TypeIcon size={16} />
                        </div>
                        <div>
                          <span className="user-name">{report.name}</span>
                          <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {report.description}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="plan-badge monthly">{report.type}</span>
                    </td>
                    <td>
                      <span className="date-cell">{report.lastGenerated}</span>
                    </td>
                    <td>{report.generatedBy}</td>
                    <td>
                      <span className="number-cell">{report.downloads}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${report.status === 'ready' ? 'success' : report.status === 'generating' ? 'pending' : 'failed'}`}>
                        {report.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button 
                          className="table-action-btn view" 
                          title="View Details"
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye size={15} />
                        </button>
                        <button 
                          className="table-action-btn edit" 
                          title="Download CSV"
                          disabled={generating === `${report.id}-csv`}
                          onClick={() => handleGenerateReport(report.id, 'csv')}
                        >
                          {generating === `${report.id}-csv` ? <Loader2 size={15} className="spinner" /> : <FileText size={15} />}
                        </button>
                        <button 
                          className="table-action-btn view" 
                          title="Download Excel"
                          disabled={generating === `${report.id}-excel`}
                          onClick={() => handleGenerateReport(report.id, 'excel')}
                        >
                          {generating === `${report.id}-excel` ? <Loader2 size={15} className="spinner" /> : <FileSpreadsheet size={15} />}
                        </button>
                        <button 
                          className="table-action-btn delete" 
                          title="Download PDF"
                          style={{ background: '#FEF2F2', color: '#EF4444', borderColor: '#FEE2E2' }}
                          disabled={generating === `${report.id}-pdf`}
                          onClick={() => handleGenerateReport(report.id, 'pdf')}
                        >
                          {generating === `${report.id}-pdf` ? <Loader2 size={15} className="spinner" /> : <File size={15} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="empty-state">
            <FileText size={48} />
            <h3>No reports found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredReports.length} of {reports.length} reports</span>
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

      {/* Scheduled Reports Table */}
      <div className="data-grid" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3>Scheduled Reports ({scheduledReports.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Report Name</th>
                <th>Type</th>
                <th>Schedule</th>
                <th>Format</th>
                <th>Recipients</th>
                <th>Last Sent</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduledReports.map((report) => (
                <tr key={report.id}>
                  <td>
                    <span className="id-badge">{report.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)' }}>
                        <Calendar size={16} />
                      </div>
                      <span className="user-name">{report.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="plan-badge monthly">{report.reportType}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                      <Clock size={14} style={{ color: 'var(--admin-text-muted)' }} />
                      {report.schedule}
                    </div>
                  </td>
                  <td>
                    <span className="plan-badge yearly">{report.format}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {report.recipients.slice(0, 2).map((email, index) => (
                        <span key={index} style={{ fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                          {email}
                        </span>
                      ))}
                      {report.recipients.length > 2 && (
                        <span style={{ fontSize: '11px', color: 'var(--admin-primary)' }}>
                          +{report.recipients.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="date-cell">{report.lastSent}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${report.status}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="table-action-btn view" 
                        title={report.status === 'active' ? 'Pause' : 'Resume'}
                        onClick={() => toggleScheduleStatus(report.id)}
                      >
                        {report.status === 'active' ? <Pause size={15} /> : <Play size={15} />}
                      </button>
                      <button className="table-action-btn edit" title="Edit">
                        <Edit2 size={15} />
                      </button>
                      <button 
                        className="table-action-btn delete" 
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(report.id)}
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

        {scheduledReports.length === 0 && (
          <div className="empty-state">
            <Calendar size={48} />
            <h3>No scheduled reports</h3>
            <p>Create a scheduled report to automate report generation</p>
          </div>
        )}
      </div>

      {/* View Report Modal */}
      {showViewModal && viewingReport && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Report Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large" style={{ background: 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                  <FileText size={28} />
                </div>
                <h3>{viewingReport.name}</h3>
                <span className={`status-badge ${viewingReport.status === 'ready' ? 'success' : 'pending'}`}>
                  {viewingReport.status}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Report ID</label>
                  <span>{viewingReport.id}</span>
                </div>
                <div className="detail-item">
                  <label>Type</label>
                  <span>{viewingReport.type}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description</label>
                  <span>{viewingReport.description}</span>
                </div>
                <div className="detail-item">
                  <label>Last Generated</label>
                  <span>{viewingReport.lastGenerated}</span>
                </div>
                <div className="detail-item">
                  <label>Generated By</label>
                  <span>{viewingReport.generatedBy}</span>
                </div>
                <div className="detail-item">
                  <label>Total Downloads</label>
                  <span className="highlight">{viewingReport.downloads}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  handleGenerateReport(viewingReport.id, 'excel');
                  setShowViewModal(false);
                }}
              >
                <Download size={14} />
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule New Report</h3>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Report Name <span>*</span></label>
                  <input type="text" placeholder="e.g., Weekly Revenue Summary" />
                </div>
                <div className="form-group">
                  <label>Report Type <span>*</span></label>
                  <select>
                    <option value="">Select Report Type</option>
                    <option value="Students">Students Report</option>
                    <option value="Finance">Revenue Report</option>
                    <option value="Subscriptions">Subscriptions Report</option>
                    <option value="Analytics">Usage Report</option>
                    <option value="Schools">Schools Report</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Format</label>
                  <select>
                    <option value="excel">Excel</option>
                    <option value="csv">CSV</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Frequency <span>*</span></label>
                  <select>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Time <span>*</span></label>
                  <input type="time" defaultValue="09:00" />
                </div>
                <div className="form-group full-width">
                  <label>Recipients (comma separated) <span>*</span></label>
                  <input type="text" placeholder="admin@aitutor.com, finance@aitutor.com" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select>
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={() => {
                toast.success('Report scheduled successfully!');
                setShowScheduleModal(false);
              }}>
                <Check size={14} />
                Schedule Report
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
                <p>Are you sure you want to delete this scheduled report?</p>
                <span>This action cannot be undone.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDeleteSchedule(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;
