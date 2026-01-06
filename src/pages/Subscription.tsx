/**
 * Subscription & Transactions Page
 */

import { useEffect, useState } from 'react';
import {
  Crown,
  CreditCard,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  ChevronRight,
  AlertCircle,
  Star,
  Zap,
  Shield,
  Gift,
  RefreshCw,
  Receipt,
  X,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { subscriptionApi, paymentsApi } from '../services/api';
import toast from 'react-hot-toast';
import './Subscription.css';

interface SubscriptionPlan {
  id: string;
  planName: string;
  displayName: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency: string;
  durationMonths: number;
  maxStudents: number;
  aiMinutesPerDay: number;
  features?: string[];
  hasLiveSessions: boolean;
  hasPersonalMentor: boolean;
  supportType: string;
  isPopular: boolean;
}

interface UserSubscription {
  id: string;
  planId: string;
  status: string;
  startedAt: string;
  expiresAt: string;
  autoRenew: boolean;
  finalAmount: number;
  discountAmount: number;
  couponCode?: string;
  plan: SubscriptionPlan;
}

interface Payment {
  id: string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  gateway: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  description?: string;
  invoiceUrl?: string;
  createdAt: string;
  metadata?: {
    planId?: string;
    planName?: string;
  };
}

export function Subscription() {
  const { user } = useAuthStore();
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);
  const [allSubscriptions, setAllSubscriptions] = useState<UserSubscription[]>([]);
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'transactions'>('plan');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [activeRes, allSubsRes, transactionsRes, plansRes] = await Promise.all([
        subscriptionApi.getActive(),
        subscriptionApi.getAll(),
        paymentsApi.getAll(),
        subscriptionApi.getPlans(),
      ]);

      if (activeRes.success) setActiveSubscription(activeRes.data);
      if (allSubsRes.success) setAllSubscriptions(allSubsRes.data || []);
      if (transactionsRes.success) setTransactions(transactionsRes.data || []);
      if (plansRes.success) setPlans(plansRes.data || []);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'success':
        return { bg: '#DCFCE7', color: '#22C55E' };
      case 'pending':
        return { bg: '#FEF3C7', color: '#F59E0B' };
      case 'expired':
      case 'cancelled':
      case 'failed':
        return { bg: '#FEE2E2', color: '#EF4444' };
      case 'refunded':
        return { bg: '#DBEAFE', color: '#3B82F6' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  const handleDownloadInvoice = (payment: Payment) => {
    if (payment.invoiceUrl) {
      window.open(payment.invoiceUrl, '_blank');
    } else {
      toast.error('Invoice not available for this transaction');
    }
  };

  if (loading) {
    return (
      <div className="subscription-loading">
        <div className="loading-spinner"></div>
        <p>Loading subscription details...</p>
      </div>
    );
  }

  return (
    <div className="subscription-page">
      {/* Header */}
      <header className="subscription-header">
        <div className="header-content">
          <h1>Subscription</h1>
          <p>Manage your plan and view transactions</p>
        </div>
        <div className="header-icon">
          <Crown size={48} />
        </div>
      </header>

      {/* Tabs */}
      <div className="subscription-tabs">
        <button
          className={`tab ${activeTab === 'plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('plan')}
        >
          <Crown size={18} />
          <span>Current Plan</span>
        </button>
        <button
          className={`tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          <Receipt size={18} />
          <span>Transactions</span>
        </button>
      </div>

      {activeTab === 'plan' ? (
        <>
          {/* Current Plan Card */}
          {activeSubscription ? (
            <div className="current-plan-card">
              <div className="plan-badge">
                <Crown size={20} />
                <span>Current Plan</span>
              </div>

              <div className="plan-header">
                <div className="plan-info">
                  <h2>{activeSubscription.plan?.displayName || 'Premium Plan'}</h2>
                  <p>{activeSubscription.plan?.description || 'Full access to all features'}</p>
                </div>
                <div className="plan-price">
                  <span className="amount">{formatCurrency(activeSubscription.finalAmount)}</span>
                  <span className="period">/{activeSubscription.plan?.durationMonths || 1} month(s)</span>
                </div>
              </div>

              <div className="plan-dates">
                <div className="date-item">
                  <Calendar size={18} />
                  <div>
                    <span className="label">Started</span>
                    <span className="value">{formatDate(activeSubscription.startedAt)}</span>
                  </div>
                </div>
                <div className="date-item">
                  <Clock size={18} />
                  <div>
                    <span className="label">Expires</span>
                    <span className="value">{formatDate(activeSubscription.expiresAt)}</span>
                  </div>
                </div>
                <div className="date-item">
                  <AlertCircle size={18} />
                  <div>
                    <span className="label">Days Left</span>
                    <span className={`value ${getDaysRemaining(activeSubscription.expiresAt) <= 7 ? 'warning' : ''}`}>
                      {getDaysRemaining(activeSubscription.expiresAt)} days
                    </span>
                  </div>
                </div>
              </div>

              <div className="plan-status">
                <div
                  className="status-badge"
                  style={{
                    background: getStatusColor(activeSubscription.status).bg,
                    color: getStatusColor(activeSubscription.status).color,
                  }}
                >
                  {activeSubscription.status === 'active' ? (
                    <CheckCircle size={16} />
                  ) : (
                    <XCircle size={16} />
                  )}
                  <span>{activeSubscription.status}</span>
                </div>
                {activeSubscription.autoRenew && (
                  <div className="auto-renew">
                    <RefreshCw size={14} />
                    <span>Auto-renew enabled</span>
                  </div>
                )}
              </div>

              {activeSubscription.couponCode && (
                <div className="coupon-applied">
                  <Gift size={16} />
                  <span>Coupon applied: {activeSubscription.couponCode}</span>
                  <span className="discount">- {formatCurrency(activeSubscription.discountAmount)}</span>
                </div>
              )}

              {/* Plan Features */}
              {activeSubscription.plan?.features && activeSubscription.plan.features.length > 0 && (
                <div className="plan-features">
                  <h4>Plan Features</h4>
                  <ul>
                    {activeSubscription.plan.features.map((feature, index) => (
                      <li key={index}>
                        <CheckCircle size={16} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="no-plan-card">
              <div className="no-plan-icon">
                <Crown size={64} />
              </div>
              <h2>No Active Subscription</h2>
              <p>Subscribe to a plan to unlock all features</p>
              <button className="subscribe-btn">
                <Zap size={20} />
                <span>View Plans</span>
              </button>
            </div>
          )}

          {/* Available Plans */}
          {!activeSubscription && plans.length > 0 && (
            <div className="available-plans">
              <h3>Available Plans</h3>
              <div className="plans-grid">
                {plans.map((plan) => (
                  <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
                    {plan.isPopular && (
                      <div className="popular-badge">
                        <Star size={14} />
                        <span>Most Popular</span>
                      </div>
                    )}
                    <h4>{plan.displayName}</h4>
                    <p className="plan-desc">{plan.description}</p>
                    <div className="plan-pricing">
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <span className="original-price">{formatCurrency(plan.originalPrice)}</span>
                      )}
                      <span className="current-price">{formatCurrency(plan.price)}</span>
                      <span className="duration">/{plan.durationMonths} month(s)</span>
                    </div>
                    <button className="select-plan-btn">
                      Select Plan
                      <ChevronRight size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subscription History */}
          {allSubscriptions.length > 1 && (
            <div className="subscription-history">
              <h3>Subscription History</h3>
              <div className="history-list">
                {allSubscriptions.filter(s => s.id !== activeSubscription?.id).map((sub) => (
                  <div key={sub.id} className="history-item">
                    <div className="history-info">
                      <span className="history-plan">{sub.plan?.displayName || 'Plan'}</span>
                      <span className="history-dates">
                        {formatDate(sub.startedAt)} - {formatDate(sub.expiresAt)}
                      </span>
                    </div>
                    <div
                      className="history-status"
                      style={{
                        background: getStatusColor(sub.status).bg,
                        color: getStatusColor(sub.status).color,
                      }}
                    >
                      {sub.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        /* Transactions Tab */
        <div className="transactions-section">
          <div className="transactions-header">
            <h3>Transaction History</h3>
            <span className="transaction-count">{transactions.length} transactions</span>
          </div>

          {transactions.length === 0 ? (
            <div className="no-transactions">
              <Receipt size={64} />
              <h3>No Transactions</h3>
              <p>Your payment history will appear here</p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="transaction-item"
                  onClick={() => setSelectedTransaction(transaction)}
                >
                  <div className="transaction-icon">
                    <CreditCard size={24} />
                  </div>
                  <div className="transaction-info">
                    <h4>{transaction.description || 'Subscription Payment'}</h4>
                    <p>{formatDateTime(transaction.createdAt)}</p>
                  </div>
                  <div className="transaction-amount">
                    <span className="amount">{formatCurrency(transaction.amount, transaction.currency)}</span>
                    <div
                      className="status"
                      style={{
                        background: getStatusColor(transaction.status).bg,
                        color: getStatusColor(transaction.status).color,
                      }}
                    >
                      {transaction.status}
                    </div>
                  </div>
                  <ChevronRight size={20} className="arrow" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Transaction Details</h2>
              <button className="modal-close" onClick={() => setSelectedTransaction(null)}>
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="transaction-detail-header">
                <div className="detail-icon">
                  <CreditCard size={32} />
                </div>
                <div className="detail-amount">
                  <span className="amount">{formatCurrency(selectedTransaction.amount, selectedTransaction.currency)}</span>
                  <div
                    className="status"
                    style={{
                      background: getStatusColor(selectedTransaction.status).bg,
                      color: getStatusColor(selectedTransaction.status).color,
                    }}
                  >
                    {selectedTransaction.status === 'success' && <CheckCircle size={14} />}
                    {selectedTransaction.status === 'failed' && <XCircle size={14} />}
                    {selectedTransaction.status === 'pending' && <Clock size={14} />}
                    <span>{selectedTransaction.status}</span>
                  </div>
                </div>
              </div>

              <div className="detail-rows">
                <div className="detail-row">
                  <span className="label">Transaction ID</span>
                  <span className="value">{selectedTransaction.id}</span>
                </div>
                {selectedTransaction.gatewayPaymentId && (
                  <div className="detail-row">
                    <span className="label">Payment ID</span>
                    <span className="value">{selectedTransaction.gatewayPaymentId}</span>
                  </div>
                )}
                {selectedTransaction.gatewayOrderId && (
                  <div className="detail-row">
                    <span className="label">Order ID</span>
                    <span className="value">{selectedTransaction.gatewayOrderId}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Date & Time</span>
                  <span className="value">{formatDateTime(selectedTransaction.createdAt)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Payment Gateway</span>
                  <span className="value">{selectedTransaction.gateway}</span>
                </div>
                {selectedTransaction.paymentMethod && (
                  <div className="detail-row">
                    <span className="label">Payment Method</span>
                    <span className="value">{selectedTransaction.paymentMethod}</span>
                  </div>
                )}
                {selectedTransaction.description && (
                  <div className="detail-row">
                    <span className="label">Description</span>
                    <span className="value">{selectedTransaction.description}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="download-invoice-btn"
                onClick={() => handleDownloadInvoice(selectedTransaction)}
                disabled={!selectedTransaction.invoiceUrl}
              >
                <Download size={18} />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;
