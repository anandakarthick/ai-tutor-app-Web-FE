/**
 * View Transaction Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Loader2, CreditCard, User, Calendar, AlertCircle,
  CheckCircle, XCircle, Clock, RefreshCw, Copy, ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getTransactionById } from '../../services/api/admin';
import './AdminPages.css';

const statusIcons: Record<string, JSX.Element> = {
  pending: <Clock size={16} />,
  success: <CheckCircle size={16} />,
  failed: <XCircle size={16} />,
  refunded: <RefreshCw size={16} />,
};

const statusColors: Record<string, string> = {
  pending: '#EAB308',
  success: '#22C55E',
  failed: '#EF4444',
  refunded: '#3B82F6',
};

export function TransactionView() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);

  useEffect(() => {
    if (id) fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    setLoading(true);
    try {
      const response = await getTransactionById(id!);
      if (response.success) setTransaction(response.data);
    } catch (error) {
      toast.error('Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
  const formatDateTime = (dateStr: string) => new Date(dateStr).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const formatPrice = (price: number, currency: string = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 2 }).format(price);

  if (loading) return <div className="admin-page"><div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div></div>;
  if (!transaction) return <div className="admin-page"><div className="not-found-container"><AlertCircle size={64} /><h2>Transaction Not Found</h2><button className="btn btn-primary" onClick={() => navigate('/admin/transactions')}><ArrowLeft size={16} /> Back</button></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/transactions')}><ArrowLeft size={20} /></button>
          <div><h1>Transaction Details</h1><p>View payment information</p></div>
        </div>
      </div>

      <div className="view-page-container">
        <div className="view-card view-card-main">
          <div className="view-card-hero">
            <div className="view-hero-icon" style={{ background: `linear-gradient(135deg, ${statusColors[transaction.status]}, ${statusColors[transaction.status]}99)` }}>
              {statusIcons[transaction.status] || <CreditCard size={32} />}
            </div>
            <div className="view-hero-content">
              <div className="view-hero-title">
                <h2>{formatPrice(transaction.amount, transaction.currency)}</h2>
                <span className={`status-badge-lg ${transaction.status === 'success' ? 'success' : transaction.status === 'failed' ? 'danger' : transaction.status === 'pending' ? 'warning' : 'info'}`}>
                  {statusIcons[transaction.status]} {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
              <p className="view-hero-subtitle">{transaction.paymentMethod || 'Razorpay'} Payment</p>
            </div>
          </div>

          <div className="view-section">
            <h3 className="view-section-title">Payment Details</h3>
            <div className="view-info-grid">
              <div className="view-info-item">
                <span className="view-info-label">Order ID</span>
                <span className="view-info-value code-value">
                  {transaction.gatewayOrderId}
                  <button className="copy-btn" onClick={() => copyToClipboard(transaction.gatewayOrderId)}><Copy size={14} /></button>
                </span>
              </div>
              {transaction.gatewayPaymentId && (
                <div className="view-info-item">
                  <span className="view-info-label">Payment ID</span>
                  <span className="view-info-value code-value">
                    {transaction.gatewayPaymentId}
                    <button className="copy-btn" onClick={() => copyToClipboard(transaction.gatewayPaymentId)}><Copy size={14} /></button>
                  </span>
                </div>
              )}
              <div className="view-info-item">
                <span className="view-info-label">Amount</span>
                <span className="view-info-value">{formatPrice(transaction.amount, transaction.currency)}</span>
              </div>
              <div className="view-info-item">
                <span className="view-info-label">Currency</span>
                <span className="view-info-value">{transaction.currency}</span>
              </div>
              <div className="view-info-item">
                <span className="view-info-label">Payment Method</span>
                <span className="view-info-value">{transaction.paymentMethod || 'Razorpay'}</span>
              </div>
            </div>
          </div>

          {transaction.user && (
            <div className="view-section">
              <h3 className="view-section-title">Customer Details</h3>
              <div className="view-info-grid">
                <div className="view-info-item">
                  <span className="view-info-label">Name</span>
                  <span className="view-info-value">{transaction.user.fullName}</span>
                </div>
                <div className="view-info-item">
                  <span className="view-info-label">Email</span>
                  <span className="view-info-value">{transaction.user.email}</span>
                </div>
                {transaction.user.phone && (
                  <div className="view-info-item">
                    <span className="view-info-label">Phone</span>
                    <span className="view-info-value">{transaction.user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {transaction.subscription && (
            <div className="view-section">
              <h3 className="view-section-title">Subscription</h3>
              <div className="view-info-grid">
                <div className="view-info-item">
                  <span className="view-info-label">Plan</span>
                  <span className="view-info-value">{transaction.subscription.plan?.planName || '-'}</span>
                </div>
                <div className="view-info-item">
                  <span className="view-info-label">Status</span>
                  <span className="view-info-value">{transaction.subscription.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="view-card view-card-meta">
          <h3 className="view-card-title">Transaction Info</h3>
          <div className="view-meta-list">
            <div className="view-meta-item">
              <span className="view-meta-label"><Calendar size={14} /> Created</span>
              <span className="view-meta-value">{formatDateTime(transaction.createdAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label"><Clock size={14} /> Updated</span>
              <span className="view-meta-value">{formatDateTime(transaction.updatedAt)}</span>
            </div>
            <div className="view-meta-item">
              <span className="view-meta-label">Transaction ID</span>
              <span className="view-meta-value code">{transaction.id}</span>
            </div>
          </div>

          {transaction.user && (
            <div className="view-actions-section">
              <button className="btn btn-outline btn-block" onClick={() => navigate(`/admin/students/${transaction.user.studentId || transaction.user.id}`)}>
                <User size={16} /> View Customer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TransactionView;
