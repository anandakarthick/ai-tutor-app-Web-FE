/**
 * Transactions Management Page
 */

import { useState } from 'react';
import {
  Wallet,
  Search,
  Download,
  Eye,
  Filter,
  Calendar,
  TrendingUp,
  CreditCard,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from 'lucide-react';
import './AdminPages.css';

interface Transaction {
  id: string;
  orderId: string;
  studentName: string;
  studentEmail: string;
  planName: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  paymentMethod: string;
  paymentId: string;
  createdAt: string;
}

export function TransactionsManagement() {
  const [transactions] = useState<Transaction[]>([
    { id: '1', orderId: 'ORD001', studentName: 'Priya Sharma', studentEmail: 'priya@example.com', planName: 'Yearly Plan', amount: 3000, currency: 'INR', status: 'success', paymentMethod: 'Razorpay', paymentId: 'pay_Nxxxxxxxxxxxx', createdAt: '2024-12-01 10:30:00' },
    { id: '2', orderId: 'ORD002', studentName: 'Rahul Verma', studentEmail: 'rahul@example.com', planName: 'Monthly Plan', amount: 299, currency: 'INR', status: 'success', paymentMethod: 'Razorpay', paymentId: 'pay_Nxxxxxxxxxxxy', createdAt: '2024-12-01 11:45:00' },
    { id: '3', orderId: 'ORD003', studentName: 'Ananya Patel', studentEmail: 'ananya@example.com', planName: 'Yearly Plan', amount: 3000, currency: 'INR', status: 'pending', paymentMethod: 'Razorpay', paymentId: 'pay_Nxxxxxxxxxxxz', createdAt: '2024-12-01 14:20:00' },
    { id: '4', orderId: 'ORD004', studentName: 'Vikram Singh', studentEmail: 'vikram@example.com', planName: 'Monthly Plan', amount: 299, currency: 'INR', status: 'failed', paymentMethod: 'Razorpay', paymentId: 'pay_Nxxxxxxxxxxxa', createdAt: '2024-11-30 09:15:00' },
    { id: '5', orderId: 'ORD005', studentName: 'Neha Gupta', studentEmail: 'neha@example.com', planName: 'Yearly Plan', amount: 3000, currency: 'INR', status: 'refunded', paymentMethod: 'Razorpay', paymentId: 'pay_Nxxxxxxxxxxxb', createdAt: '2024-11-28 16:00:00' },
    { id: '6', orderId: 'ORD006', studentName: 'Amit Kumar', studentEmail: 'amit@example.com', planName: 'Yearly Plan', amount: 3000, currency: 'INR', status: 'success', paymentMethod: 'Razorpay', paymentId: 'pay_Nxxxxxxxxxxxc', createdAt: '2024-11-27 12:30:00' },
    { id: '7', orderId: 'ORD007', studentName: 'Sneha Reddy', studentEmail: 'sneha@example.com', planName: 'Monthly Plan', amount: 299, currency: 'INR', status: 'success', paymentMethod: 'Razorpay', paymentId: 'pay_Nxxxxxxxxxxxd', createdAt: '2024-11-26 18:45:00' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         txn.paymentId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions.filter(t => t.status === 'success').reduce((acc, t) => acc + t.amount, 0);
  const successfulTransactions = transactions.filter(t => t.status === 'success').length;
  const pendingTransactions = transactions.filter(t => t.status === 'pending').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={16} color="#22C55E" />;
      case 'failed': return <XCircle size={16} color="#EF4444" />;
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'refunded': return <RefreshCw size={16} color="#3B82F6" />;
      default: return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>View and manage all payment transactions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Download size={18} />
            Export CSV
          </button>
          <button className="btn btn-outline">
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Wallet size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Revenue</p>
            <h3 className="stat-value">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Successful</p>
            <h3 className="stat-value">{successfulTransactions}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F59E0B15', color: '#F59E0B' }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Pending</p>
            <h3 className="stat-value">{pendingTransactions}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EF444415', color: '#EF4444' }}>
            <XCircle size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Failed</p>
            <h3 className="stat-value">{failedTransactions}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search by name, order ID, or payment ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Transactions ({filteredTransactions.length})</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Student</th>
              <th>Plan</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment ID</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id}>
                <td className="txn-id">{txn.orderId}</td>
                <td>
                  <div>
                    <p style={{ fontWeight: 500 }}>{txn.studentName}</p>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>{txn.studentEmail}</span>
                  </div>
                </td>
                <td>
                  <span className={`plan-badge ${txn.planName.toLowerCase().includes('yearly') ? 'yearly' : 'monthly'}`}>
                    {txn.planName}
                  </span>
                </td>
                <td className="amount">₹{txn.amount.toLocaleString()}</td>
                <td>
                  <span className={`status-badge ${txn.status}`}>
                    {getStatusIcon(txn.status)}
                    {txn.status}
                  </span>
                </td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{txn.paymentId}</td>
                <td className="date">{txn.createdAt}</td>
                <td>
                  <button className="action-btn" title="View Details" onClick={() => setSelectedTransaction(txn)}>
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredTransactions.length} of {transactions.length} transactions</span>
          <div className="pagination-buttons">
            <button className="pagination-btn" disabled>Previous</button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn">Next</button>
          </div>
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button className="modal-close" onClick={() => setSelectedTransaction(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="transaction-detail">
                <div className="detail-row">
                  <span className="label">Order ID</span>
                  <span className="value">{selectedTransaction.orderId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment ID</span>
                  <span className="value">{selectedTransaction.paymentId}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Student</span>
                  <span className="value">{selectedTransaction.studentName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email</span>
                  <span className="value">{selectedTransaction.studentEmail}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Plan</span>
                  <span className="value">{selectedTransaction.planName}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Amount</span>
                  <span className="value amount">₹{selectedTransaction.amount.toLocaleString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Status</span>
                  <span className={`status-badge ${selectedTransaction.status}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    {selectedTransaction.status}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Method</span>
                  <span className="value">{selectedTransaction.paymentMethod}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Date</span>
                  <span className="value">{selectedTransaction.createdAt}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              {selectedTransaction.status === 'success' && (
                <button className="btn btn-outline">
                  <RefreshCw size={16} /> Process Refund
                </button>
              )}
              <button className="btn btn-outline" onClick={() => setSelectedTransaction(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsManagement;
