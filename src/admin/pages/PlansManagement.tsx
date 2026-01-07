/**
 * Subscription Plans Management Page
 */

import { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  AlertCircle,
  Crown,
  Star,
  Zap,
  Users,
} from 'lucide-react';
import './AdminPages.css';

interface SubscriptionPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  duration: number;
  durationType: 'days' | 'months' | 'years';
  features: string[];
  isPopular: boolean;
  discount: number;
  status: 'active' | 'inactive';
  subscriberCount: number;
}

export function PlansManagement() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([
    {
      id: '1',
      name: 'monthly',
      displayName: 'Monthly Plan',
      description: 'Perfect for trying out AI Tutor',
      price: 299,
      duration: 1,
      durationType: 'months',
      features: ['Unlimited AI Doubt Solving', 'All Subjects Access', 'Smart Quizzes', 'Progress Tracking', 'Study Plans'],
      isPopular: false,
      discount: 0,
      status: 'active',
      subscriberCount: 3245,
    },
    {
      id: '2',
      name: 'yearly',
      displayName: 'Yearly Plan',
      description: 'Best value for serious learners',
      price: 3000,
      duration: 1,
      durationType: 'years',
      features: ['Unlimited AI Doubt Solving', 'All Subjects Access', 'Smart Quizzes', 'Progress Tracking', 'Study Plans', 'Priority Support', 'Offline Access'],
      isPopular: true,
      discount: 17,
      status: 'active',
      subscriberCount: 5689,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    price: 0,
    duration: 1,
    durationType: 'months' as 'days' | 'months' | 'years',
    features: [] as string[],
    isPopular: false,
    discount: 0,
    status: 'active',
  });

  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      displayName: '',
      description: '',
      price: 0,
      duration: 1,
      durationType: 'months',
      features: [],
      isPopular: false,
      discount: 0,
      status: 'active',
    });
    setShowModal(true);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      durationType: plan.durationType,
      features: [...plan.features],
      isPopular: plan.isPopular,
      discount: plan.discount,
      status: plan.status,
    });
    setShowModal(true);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...formData } 
          : p
      ));
    } else {
      const newPlan: SubscriptionPlan = {
        id: Date.now().toString(),
        ...formData,
        status: formData.status as 'active' | 'inactive',
        subscriberCount: 0,
      };
      setPlans([...plans, newPlan]);
    }
    setShowModal(false);
  };

  const handleDeletePlan = (id: string) => {
    setPlans(plans.filter(p => p.id !== id));
    setShowDeleteConfirm(null);
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subscription Plans</h1>
          <p>Manage subscription plans and pricing</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleAddPlan}>
            <Plus size={18} />
            Add Plan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <CreditCard size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Plans</p>
            <h3 className="stat-value">{plans.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <Users size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Subscribers</p>
            <h3 className="stat-value">{plans.reduce((acc, p) => acc + p.subscriberCount, 0).toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Plans</p>
            <h3 className="stat-value">{plans.filter(p => p.status === 'active').length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Crown size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Monthly Revenue</p>
            <h3 className="stat-value">₹{(plans.reduce((acc, p) => acc + (p.price * p.subscriberCount), 0) / 12).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="plans-grid">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
            {plan.isPopular && (
              <div className="popular-badge">
                <Crown size={14} /> Most Popular
              </div>
            )}
            <div className="plan-header">
              <h3>{plan.displayName}</h3>
              <p>{plan.description}</p>
            </div>
            <div className="plan-price">
              <span className="currency">₹</span>
              <span className="amount">{plan.price.toLocaleString()}</span>
              <span className="period">/{plan.durationType === 'months' ? 'month' : plan.durationType === 'years' ? 'year' : 'days'}</span>
            </div>
            {plan.discount > 0 && (
              <div className="plan-discount">
                <Star size={14} /> Save {plan.discount}%
              </div>
            )}
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <Check size={16} /> {feature}
                </li>
              ))}
            </ul>
            <div className="plan-stats">
              <div>
                <span className="stat-num">{plan.subscriberCount.toLocaleString()}</span>
                <span className="stat-label">Subscribers</span>
              </div>
              <span className={`status-badge ${plan.status}`}>{plan.status}</span>
            </div>
            <div className="plan-actions">
              <button className="btn btn-outline btn-sm" onClick={() => handleEditPlan(plan)}>
                <Edit size={14} /> Edit
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => setShowDeleteConfirm(plan.id)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Plan Name (Internal) <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., monthly"
                  />
                </div>
                <div className="form-group">
                  <label>Display Name <span>*</span></label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    placeholder="e.g., Monthly Plan"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <input 
                    type="text" 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Brief description of the plan"
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) <span>*</span></label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    placeholder="299"
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="number" 
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                      style={{ width: '80px' }}
                    />
                    <select 
                      value={formData.durationType}
                      onChange={(e) => setFormData({...formData, durationType: e.target.value as 'days' | 'months' | 'years'})}
                      style={{ flex: 1 }}
                    >
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input 
                    type="number" 
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="checkbox-label-inline">
                    <input 
                      type="checkbox" 
                      checked={formData.isPopular}
                      onChange={(e) => setFormData({...formData, isPopular: e.target.checked})}
                    />
                    Mark as Popular
                  </label>
                </div>
                <div className="form-group full-width">
                  <label>Features</label>
                  <div className="feature-input">
                    <input 
                      type="text" 
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button type="button" className="btn btn-primary btn-sm" onClick={addFeature}>
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="features-list">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="feature-tag">
                        {feature}
                        <button type="button" onClick={() => removeFeature(index)}>
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSavePlan}>
                <Check size={18} />
                {editingPlan ? 'Save Changes' : 'Add Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete</h3>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="delete-confirm">
                <AlertCircle size={48} color="#EF4444" />
                <p>Are you sure you want to delete this plan? Existing subscribers will not be affected.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeletePlan(showDeleteConfirm)}>
                <Trash2 size={18} /> Delete Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlansManagement;
