/**
 * Subscription Guard Component
 * Redirects to subscription page if user doesn't have active subscription
 */

import { useNavigate } from 'react-router-dom';
import { Crown, CheckCircle, Zap } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import './SubscriptionGuard.css';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export function SubscriptionGuard({ children }: SubscriptionGuardProps) {
  const navigate = useNavigate();
  const { hasActiveSubscription, isLoading } = useSubscriptionStore();

  // Show loading while checking subscription
  if (isLoading) {
    return (
      <div className="subscription-guard-loading">
        <div className="loading-spinner"></div>
        <p>Checking subscription...</p>
      </div>
    );
  }

  // If no subscription, show upgrade message
  if (!hasActiveSubscription) {
    return (
      <div className="subscription-guard">
        <div className="subscription-guard-content">
          {/* Icon */}
          <div className="guard-icon-container">
            <Crown size={48} />
          </div>

          {/* Title */}
          <h2 className="guard-title">Subscription Required</h2>

          {/* Message */}
          <p className="guard-message">
            Upgrade to Premium to access all learning features, quizzes, and personalized study plans.
          </p>

          {/* Features */}
          <div className="guard-features">
            <div className="guard-feature">
              <CheckCircle size={18} />
              <span>Unlimited AI doubt solving</span>
            </div>
            <div className="guard-feature">
              <CheckCircle size={18} />
              <span>All subjects & chapters</span>
            </div>
            <div className="guard-feature">
              <CheckCircle size={18} />
              <span>Practice quizzes & tests</span>
            </div>
            <div className="guard-feature">
              <CheckCircle size={18} />
              <span>Personalized study plans</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="guard-cta-button" onClick={() => navigate('/subscription')}>
            <Zap size={20} />
            <span>Upgrade Now</span>
          </button>
        </div>
      </div>
    );
  }

  // User has subscription - render children
  return <>{children}</>;
}
