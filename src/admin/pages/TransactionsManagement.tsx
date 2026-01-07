/**
 * Transactions Management Page
 */

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Download,
  Wallet,
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTransactions, getTransactionById } from '../../services/api/admin';
import './AdminPages.css';

interface Transaction {
  id: string;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
}

export function TransactionsManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingTransaction, setViewingTransaction] = useState<Transaction | null>(null);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const limit = 20;

  // Date filters
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const filters: any = {
        page: currentPage,
        limit,
        search: searchQuery || undefined,
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }

      if (fromDate) filters.fromDate = fromDate;
      if (toDate) filters.toDate = toDate;

      const response = await getTransactions(filters);

      if (response.success) {
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pagination.totalPages);
        setTotalTransactions(response.data.pagination.total);
        setTotalRevenue(response.data.summary?.totalRevenue || 0);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchTransactions();
  };

  const handleViewTransaction = async (transaction: Transaction) => {
    try {
      const response = await getTransactionById(transaction.id);
      if (response.success) {
        setViewingTransaction(response.data);
        setShowViewModal(true);
      }
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      setViewingTransaction(transaction);
      setShowViewModal(true);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${Number(amount).toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle size={14} />;
      case 'failed': return <XCircle size={14} />;
      case 'pending': return <Clock size={14} />;
      case 'refunded': return <RefreshCw size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
  };

  const successfulTransactions = transactions.filter(t => t.status === 'success').length;
  const failedTransactions = transactions.filter(t => t.status === 'failed').length;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>View and manage payment transactions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchTransactions}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-outline">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <CreditCard size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Transactions</p>
            <h3 className="stat-value">{totalTransactions.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Revenue</p>
            <h3 className="stat-value">{formatCurrency(totalRevenue)}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <CheckCircle size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Successful</p>
            <h3 className="stat-value">{successfulTransactions}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EF444415', color: '#EF4444' }}>
            <XCircle size={22} />
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
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by order ID, payment ID, name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
        <input 
          type="date" 
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          placeholder="From"
        />
        <input 
          type="date" 
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          placeholder="To"
        />
        <button className="btn btn-primary btn-sm" onClick={handleSearch}>
          <Search size={14} />
          Search
        </button>
      </div>

      {/* Transactions Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Transactions ({totalTransactions})</h3>
        </div>

        {loading ? (
          <div className="loading-container" style={{ padding: '60px 20px' }}>
            <Loader2 size={32} className="spinner" />
            <p>Loading transactions...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Payment ID</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn.id}>
                      <td>
                        <span className="id-badge">{txn.gatewayOrderId || txn.id.slice(0, 12)}</span>
                      </td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {getInitials(txn.user?.fullName || '')}
                          </div>
                          <div>
                            <span className="user-name">{txn.user?.fullName || 'Unknown'}</span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)' }}>
                              {txn.user?.email || '-'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="number-cell success">{formatCurrency(txn.amount)}</span>
                      </td>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'var(--admin-text-muted)' }}>
                          {txn.gatewayPaymentId || '-'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${txn.status}`}>
                          {getStatusIcon(txn.status)}
                          {txn.status}
                        </span>
                      </td>
                      <td>
                        <span className="date-cell">{formatDate(txn.createdAt)}</span>
                      </td>
                      <td>
                        <div className="table-actions" style={{ justifyContent: 'center' }}>
                          <button 
                            className="table-action-btn view" 
                            title="View Details"
                            onClick={() => handleViewTransaction(txn)}
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

            {transactions.length === 0 && (
              <div className="empty-state">
                <CreditCard size={48} />
                <h3>No transactions found</h3>
                <p>Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Pagination */}
            <div className="pagination">
              <span className="pagination-info">
                Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, totalTransactions)} of {totalTransactions} transactions
              </span>
              <div className="pagination-buttons">
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                  <button 
                    key={page}
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                {totalPages > 5 && <span>...</span>}
                <button 
                  className="pagination-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Transaction Modal */}
      {showViewModal && viewingTransaction && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transaction Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large" style={{ background: viewingTransaction.status === 'success' ? 'linear-gradient(135deg, #22C55E, #4ADE80)' : viewingTransaction.status === 'failed' ? 'linear-gradient(135deg, #EF4444, #F87171)' : 'linear-gradient(135deg, #F97316, #FB923C)' }}>
                  <Wallet size={28} />
                </div>
                <h3>{formatCurrency(viewingTransaction.amount)}</h3>
                <span className={`status-badge ${viewingTransaction.status}`}>
                  {getStatusIcon(viewingTransaction.status)}
                  {viewingTransaction.status}
                </span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Order ID</label>
                  <span>{viewingTransaction.gatewayOrderId || viewingTransaction.id}</span>
                </div>
                <div className="detail-item">
                  <label>Payment ID</label>
                  <span>{viewingTransaction.gatewayPaymentId || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Student Name</label>
                  <span>{viewingTransaction.user?.fullName || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Email</label>
                  <span>{viewingTransaction.user?.email || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Amount</label>
                  <span className="highlight success">{formatCurrency(viewingTransaction.amount)}</span>
                </div>
                <div className="detail-item">
                  <label>Currency</label>
                  <span>{viewingTransaction.currency || 'INR'}</span>
                </div>
                <div className="detail-item">
                  <label>Payment Method</label>
                  <span>{viewingTransaction.paymentMethod || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Date</label>
                  <span>{formatDate(viewingTransaction.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              {viewingTransaction.status === 'success' && (
                <button className="btn btn-danger" onClick={() => toast.error('Refund feature coming soon')}>
                  <RefreshCw size={14} />
                  Refund
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TransactionsManagement;
