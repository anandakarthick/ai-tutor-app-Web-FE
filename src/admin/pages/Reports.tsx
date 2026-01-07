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
  BookOpen,
  TrendingUp,
  Filter,
  RefreshCw,
  Mail,
  CheckCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminPages.css';

interface Report {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: any;
  lastGenerated: string;
  format: string[];
}

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isGenerating, setIsGenerating] = useState(false);

  const reports: Report[] = [
    {
      id: 'students',
      name: 'Students Report',
      description: 'Complete list of all registered students with their details',
      type: 'users',
      icon: Users,
      lastGenerated: '2024-12-01',
      format: ['CSV', 'Excel', 'PDF'],
    },
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Detailed revenue analysis with payment breakdowns',
      type: 'financial',
      icon: CreditCard,
      lastGenerated: '2024-12-01',
      format: ['CSV', 'Excel', 'PDF'],
    },
    {
      id: 'subscriptions',
      name: 'Subscriptions Report',
      description: 'Active, expired, and pending subscription details',
      type: 'financial',
      icon: TrendingUp,
      lastGenerated: '2024-11-30',
      format: ['CSV', 'Excel'],
    },
    {
      id: 'usage',
      name: 'Platform Usage Report',
      description: 'User engagement, session times, and activity metrics',
      type: 'analytics',
      icon: BookOpen,
      lastGenerated: '2024-11-28',
      format: ['CSV', 'Excel', 'PDF'],
    },
    {
      id: 'schools',
      name: 'Schools Report',
      description: 'Partner schools with student counts and revenue',
      type: 'users',
      icon: Users,
      lastGenerated: '2024-11-25',
      format: ['CSV', 'Excel'],
    },
    {
      id: 'transactions',
      name: 'Transactions Report',
      description: 'All payment transactions with status and details',
      type: 'financial',
      icon: CreditCard,
      lastGenerated: '2024-12-01',
      format: ['CSV', 'Excel', 'PDF'],
    },
  ];

  const scheduledReports = [
    { name: 'Daily Revenue Summary', schedule: 'Daily at 6 AM', recipients: 'admin@aitutor.com', status: 'active' },
    { name: 'Weekly User Report', schedule: 'Every Monday 9 AM', recipients: 'admin@aitutor.com, manager@aitutor.com', status: 'active' },
    { name: 'Monthly Analytics', schedule: '1st of every month', recipients: 'admin@aitutor.com', status: 'paused' },
  ];

  const handleGenerateReport = async (reportId: string, format: string) => {
    setIsGenerating(true);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(`${format} report generated successfully!`);
    setIsGenerating(false);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Generate and download platform reports</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Calendar size={18} />
            Schedule Report
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <div className="filter-bar">
        <div className="date-range-filter">
          <label>Date Range:</label>
          <input 
            type="date" 
            value={dateRange.from}
            onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
          />
          <span>to</span>
          <input 
            type="date" 
            value={dateRange.to}
            onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
          />
        </div>
        <button className="btn btn-outline btn-sm">
          <Filter size={16} />
          Apply Filter
        </button>
      </div>

      {/* Reports Grid */}
      <div className="reports-grid">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <div className="report-icon">
                  <Icon size={24} />
                </div>
                <span className="report-type">{report.type}</span>
              </div>
              <h3>{report.name}</h3>
              <p>{report.description}</p>
              <div className="report-meta">
                <span>Last generated: {report.lastGenerated}</span>
              </div>
              <div className="report-formats">
                {report.format.map((fmt) => (
                  <button 
                    key={fmt}
                    className="format-btn"
                    onClick={() => handleGenerateReport(report.id, fmt)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? <RefreshCw size={14} className="spinner" /> : <Download size={14} />}
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduled Reports */}
      <div className="scheduled-reports">
        <div className="card-header">
          <h3>Scheduled Reports</h3>
          <button className="btn btn-primary btn-sm">
            <Calendar size={16} /> New Schedule
          </button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report Name</th>
              <th>Schedule</th>
              <th>Recipients</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {scheduledReports.map((report, index) => (
              <tr key={index}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#F97316" />
                    {report.name}
                  </div>
                </td>
                <td>{report.schedule}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mail size={14} />
                    {report.recipients}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${report.status}`}>
                    {report.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-outline btn-sm">Edit</button>
                    <button className="btn btn-outline btn-sm">
                      {report.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div className="report-stats">
        <h3>Report Generation Stats</h3>
        <div className="stats-row">
          <div className="quick-stat">
            <CheckCircle size={20} color="#22C55E" />
            <div>
              <span className="stat-num">156</span>
              <span className="stat-label">Reports Generated This Month</span>
            </div>
          </div>
          <div className="quick-stat">
            <Download size={20} color="#3B82F6" />
            <div>
              <span className="stat-num">89</span>
              <span className="stat-label">Downloads This Week</span>
            </div>
          </div>
          <div className="quick-stat">
            <Mail size={20} color="#F97316" />
            <div>
              <span className="stat-num">45</span>
              <span className="stat-label">Scheduled Emails Sent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reports;
