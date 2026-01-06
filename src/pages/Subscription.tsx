/**
 * Subscription & Transactions Page with Razorpay Integration
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
  Check,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { subscriptionApi, paymentsApi } from '../services/api';
import toast from 'react-hot-toast';
import './Subscription.css';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

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
  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState<'plan' | 'transactions'>('plan');

  useEffect(() => {
    loadRazorpayScript();
    loadData();
  }, []);

  // Load Razorpay SDK
  const loadRazorpayScript = () => {
    if (document.getElementById('razorpay-script')) return;
    
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const loadData = async () => {
    try {
      const [activeRes, transactionsRes, plansRes] = await Promise.all([
        subscriptionApi.getActive(),
        paymentsApi.getAll(),
        subscriptionApi.getPlans(),
      ]);

      if (activeRes.success) setActiveSubscription(activeRes.data);
      if (transactionsRes.success) setTransactions(transactionsRes.data || []);
      if (plansRes.success) setPlans(plansRes.data || []);
    } catch (error) {
      console.error('Failed to load subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!window.Razorpay) {
      toast.error('Payment system not loaded. Please refresh the page.');
      return;
    }

    setProcessingPayment(true);

    try {
      // Create order
      const orderRes = await paymentsApi.createOrder({
        amount: plan.price,
        planId: plan.id,
        description: `${plan.displayName} Subscription`,
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to create order');
      }

      const { orderId, keyId, amount } = orderRes.data;

      // Open Razorpay checkout
      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'AI Tutor',
        description: `${plan.displayName} Subscription`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyRes = await paymentsApi.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              toast.success('Payment successful! Your subscription is now active.');
              loadData(); // Reload data
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('Payment verification failed');
          }
          setProcessingPayment(false);
        },
        prefill: {
          name: user?.fullName || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: '#F97316',
        },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to initiate payment');
      setProcessingPayment(false);
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
      maximumFractionDigits: 0,
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
          <span>Plans</span>
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
          {activeSubscription && (
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
              </div>
            </div>
          )}

          {/* Available Plans */}
          <div className="available-plans">
            <h3>{activeSubscription ? 'Upgrade Your Plan' : 'Choose Your Plan'}</h3>
            <div className="plans-grid">
              {plans.map((plan) => (
                <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
                  {plan.isPopular && (
                    <div className="popular-badge">
                      <Star size={14} />
                      <span>Best Value</span>
                    </div>
                  )}
                  
                  <div className="plan-card-header">
                    <h4>{plan.displayName}</h4>
                    <p className="plan-desc">{plan.description}</p>
                  </div>
                  
                  <div className="plan-pricing">
                    {plan.originalPrice && plan.originalPrice > plan.price && (
                      <span className="original-price">{formatCurrency(plan.originalPrice)}</span>
                    )}
                    <span className="current-price">{formatCurrency(plan.price)}</span>
                    <span className="duration">
                      /{plan.durationMonths === 1 ? 'month' : `${plan.durationMonths} months`}
                    </span>
                  </div>

                  {plan.durationMonths === 12 && (
                    <div className="savings-badge">
                      <Gift size={14} />
                      <span>Save ₹588/year</span>
                    </div>
                  )}

                  <ul className="plan-features-list">
                    {plan.features?.slice(0, 4).map((feature, index) => (
                      <li key={index}>
                        <Check size={14} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button 
                    className={`subscribe-btn ${plan.isPopular ? 'primary' : ''}`}
                    onClick={() => handleSubscribe(plan)}
                    disabled={processingPayment}
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 size={18} className="spinner" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Zap size={18} />
                        <span>Subscribe Now</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <Shield size={20} />
              <span>Secure Payments</span>
            </div>
            <div className="trust-badge">
              <RefreshCw size={20} />
              <span>Cancel Anytime</span>
            </div>
            <div className="trust-badge">
              <Sparkles size={20} />
              <span>Instant Access</span>
            </div>
          </div>
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
                  <span className="value">{selectedTransaction.id.substring(0, 18)}...</span>
                </div>
                {selectedTransaction.gatewayPaymentId && (
                  <div className="detail-row">
                    <span className="label">Payment ID</span>
                    <span className="value">{selectedTransaction.gatewayPaymentId}</span>
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
                {selectedTransaction.description && (
                  <div className="detail-row">
                    <span className="label">Description</span>
                    <span className="value">{selectedTransaction.description}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button className="close-modal-btn" onClick={() => setSelectedTransaction(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;
