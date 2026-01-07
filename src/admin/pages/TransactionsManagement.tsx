/**
 * Transactions List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Search, Eye, X, CheckCircle, XCircle, Clock, RefreshCw,
  ChevronLeft, ChevronRight, Loader2, Download, Wallet, TrendingUp, Calendar,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTransactions } from '../../services/api/admin';
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
  user?: { id: string; fullName: string; email: string; };
}

const statusIcons = {
  pending: <Clock size={14} />,
  success: <CheckCircle size={14} />,
  failed: <XCircle size={14} />,
  refunded: <RefreshCw size={14} />,
};

const statusColors = {
  pending: 'warning',
  success: 'success',
  failed: 'danger',
  refunded: 'info',
};

export function TransactionsManagement() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter, fromDate, toDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await getTransactions({
        page: currentPage,
        limit,
        search: searchQuery,
        status: statusFilter || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
      if (response.success) {
        setTransactions(response.data.transactions || response.data);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setTotalTransactions(response.data.pagination?.total || response.data.length);
        const successfulTxns = (response.data.transactions || response.data).filter((t: Transaction) => t.status === 'success');
        setTotalRevenue(successfulTxns.reduce((sum: number, t: Transaction) => sum + t.amount, 0));
      }
    } catch (error) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchTransactions();
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const formatPrice = (price: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p>View payment transactions</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchTransactions}><RefreshCw size={16} /> Refresh</button>
          <button className="btn btn-outline"><Download size={16} /> Export</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}><CreditCard size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Total Transactions</p>
            <h3 className="stat-value">{totalTransactions.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}><TrendingUp size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Revenue</p>
            <h3 className="stat-value">{formatPrice(totalRevenue)}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}><CheckCircle size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Successful</p>
            <h3 className="stat-value">{transactions.filter(t => t.status === 'success').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#EF444415', color: '#EF4444' }}><XCircle size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Failed</p>
            <h3 className="stat-value">{transactions.filter(t => t.status === 'failed').length}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input type="text" placeholder="Search by order ID or user..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); fetchTransactions(); }}><X size={16} /></button>}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
        <div className="filter-row">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <input type="date" value={fromDate} onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }} placeholder="From date" />
          <input type="date" value={toDate} onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }} placeholder="To date" />
        </div>
      </div>

      {/* Table */}
      <div className="data-table-container">
        {loading ? (
          <div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={64} />
            <h3>No transactions found</h3>
            <p>Transactions will appear here once payments are made</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id}>
                  <td>
                    <div className="order-id-cell">
                      <code>{txn.gatewayOrderId?.slice(0, 16) || txn.id.slice(0, 16)}...</code>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <span className="user-name">{txn.user?.fullName || '-'}</span>
                      {txn.user?.email && <small>{txn.user.email}</small>}
                    </div>
                  </td>
                  <td><strong>{formatPrice(txn.amount)}</strong></td>
                  <td>{txn.paymentMethod || 'Razorpay'}</td>
                  <td>
                    <span className={`status-badge ${statusColors[txn.status]}`}>
                      {statusIcons[txn.status]} {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                    </span>
                  </td>
                  <td>{formatDateTime(txn.createdAt)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" onClick={() => navigate(`/admin/transactions/${txn.id}`)}><Eye size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="pagination-info">Page {currentPage} of {totalPages}</span>
          <button className="pagination-btn" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionsManagement;
