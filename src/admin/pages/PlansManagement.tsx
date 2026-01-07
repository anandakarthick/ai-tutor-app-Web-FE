/**
 * Plans Management Page
 */

import { useState } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Check,
  AlertCircle,
  Crown,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Percent,
} from 'lucide-react';
import './AdminPages.css';

interface PlanData {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  duration: number;
  durationUnit: 'days' | 'months' | 'years';
  discount: number;
  features: string[];
  isPopular: boolean;
  subscriberCount: number;
  status: 'active' | 'inactive';
}

export function PlansManagement() {
  const [plans, setPlans] = useState<PlanData[]>([
    { 
      id: 'PLN001', 
      name: 'monthly', 
      displayName: 'Monthly Plan', 
      description: 'Perfect for trying out our platform',
      price: 299, 
      duration: 1, 
      durationUnit: 'months',
      discount: 0,
      features: ['All Subjects', 'Unlimited Questions', 'Progress Tracking', 'Quiz Access'],
      isPopular: false,
      subscriberCount: 3245,
      status: 'active'
    },
    { 
      id: 'PLN002', 
      name: 'yearly', 
      displayName: 'Yearly Plan', 
      description: 'Best value for serious learners',
      price: 3000, 
      duration: 1, 
      durationUnit: 'years',
      discount: 17,
      features: ['All Subjects', 'Unlimited Questions', 'Progress Tracking', 'Quiz Access', 'Priority Support', 'Offline Access'],
      isPopular: true,
      subscriberCount: 5689,
      status: 'active'
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
  const [viewingPlan, setViewingPlan] = useState<PlanData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    price: 0,
    duration: 1,
    durationUnit: 'months' as 'days' | 'months' | 'years',
    discount: 0,
    features: [] as string[],
    isPopular: false,
    status: 'active',
  });

  const filteredPlans = plans.filter(plan =>
    plan.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSubscribers = plans.reduce((acc, p) => acc + p.subscriberCount, 0);
  const totalRevenue = plans.reduce((acc, p) => acc + (p.subscriberCount * p.price), 0);

  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({ 
      name: '', displayName: '', description: '', price: 0, 
      duration: 1, durationUnit: 'months', discount: 0, 
      features: [], isPopular: false, status: 'active' 
    });
    setShowModal(true);
  };

  const handleEditPlan = (plan: PlanData) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description,
      price: plan.price,
      duration: plan.duration,
      durationUnit: plan.durationUnit,
      discount: plan.discount,
      features: [...plan.features],
      isPopular: plan.isPopular,
      status: plan.status,
    });
    setShowModal(true);
  };

  const handleViewPlan = (plan: PlanData) => {
    setViewingPlan(plan);
    setShowViewModal(true);
  };

  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...formData } 
          : p
      ));
    } else {
      const newPlan: PlanData = {
        id: `PLN${String(plans.length + 1).padStart(3, '0')}`,
        ...formData,
        subscriberCount: 0,
        status: formData.status as 'active' | 'inactive',
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
            <Plus size={16} />
            Add Plan
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}>
            <CreditCard size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Plans</p>
            <h3 className="stat-value">{plans.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}>
            <Users size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Total Subscribers</p>
            <h3 className="stat-value">{totalSubscribers.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}>
            <TrendingUp size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Est. Revenue</p>
            <h3 className="stat-value">₹{(totalRevenue / 100000).toFixed(1)}L</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}>
            <Crown size={22} />
          </div>
          <div className="stat-content">
            <p className="stat-title">Active Plans</p>
            <h3 className="stat-value">{plans.filter(p => p.status === 'active').length}</h3>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search plans..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Plans Table */}
      <div className="data-grid">
        <div className="card-header">
          <h3>All Plans ({filteredPlans.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Plan Name</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Discount</th>
                <th>Subscribers</th>
                <th>Popular</th>
                <th>Status</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <span className="id-badge">{plan.id}</span>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: plan.isPopular ? 'linear-gradient(135deg, #F97316, #FB923C)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                        {plan.isPopular ? <Crown size={16} /> : <CreditCard size={16} />}
                      </div>
                      <div>
                        <span className="user-name">{plan.displayName}</span>
                        <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)' }}>{plan.description}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="number-cell success">₹{plan.price.toLocaleString()}</span>
                  </td>
                  <td>
                    {plan.duration} {plan.durationUnit}
                  </td>
                  <td>
                    {plan.discount > 0 ? (
                      <span className="plan-badge yearly">{plan.discount}% OFF</span>
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>-</span>
                    )}
                  </td>
                  <td>
                    <span className="number-cell">{plan.subscriberCount.toLocaleString()}</span>
                  </td>
                  <td>
                    {plan.isPopular ? (
                      <span className="plan-badge yearly"><Crown size={12} /> Yes</span>
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>No</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${plan.status}`}>
                      {plan.status}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="table-action-btn view" 
                        title="View Details"
                        onClick={() => handleViewPlan(plan)}
                      >
                        <Eye size={15} />
                      </button>
                      <button 
                        className="table-action-btn edit" 
                        title="Edit"
                        onClick={() => handleEditPlan(plan)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        className="table-action-btn delete" 
                        title="Delete"
                        onClick={() => setShowDeleteConfirm(plan.id)}
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

        {filteredPlans.length === 0 && (
          <div className="empty-state">
            <CreditCard size={48} />
            <h3>No plans found</h3>
            <p>Create your first subscription plan</p>
          </div>
        )}

        {/* Pagination */}
        <div className="pagination">
          <span className="pagination-info">Showing 1-{filteredPlans.length} of {plans.length} plans</span>
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

      {/* View Plan Modal */}
      {showViewModal && viewingPlan && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal" style={{ maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Plan Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="view-profile">
                <div className="profile-avatar-large" style={{ background: viewingPlan.isPopular ? 'linear-gradient(135deg, #F97316, #FB923C)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                  {viewingPlan.isPopular ? <Crown size={28} /> : <CreditCard size={28} />}
                </div>
                <h3>{viewingPlan.displayName}</h3>
                <span className={`status-badge ${viewingPlan.status}`}>{viewingPlan.status}</span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Plan ID</label>
                  <span>{viewingPlan.id}</span>
                </div>
                <div className="detail-item">
                  <label>Price</label>
                  <span className="highlight">₹{viewingPlan.price.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Duration</label>
                  <span>{viewingPlan.duration} {viewingPlan.durationUnit}</span>
                </div>
                <div className="detail-item">
                  <label>Discount</label>
                  <span>{viewingPlan.discount}%</span>
                </div>
                <div className="detail-item">
                  <label>Subscribers</label>
                  <span className="highlight success">{viewingPlan.subscriberCount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Popular</label>
                  <span>{viewingPlan.isPopular ? 'Yes' : 'No'}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description</label>
                  <span>{viewingPlan.description}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Features ({viewingPlan.features.length})</label>
                  <div className="features-list" style={{ marginTop: '8px' }}>
                    {viewingPlan.features.map((feature, index) => (
                      <span key={index} className="feature-tag">
                        <Check size={12} /> {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowViewModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                setShowViewModal(false);
                handleEditPlan(viewingPlan);
              }}>
                <Edit2 size={14} />
                Edit Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" style={{ maxWidth: '550px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
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
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Plan description"
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹) <span>*</span></label>
                  <input 
                    type="number" 
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                    placeholder="299"
                  />
                </div>
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input 
                    type="number" 
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <input 
                    type="number" 
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value) || 1})}
                    placeholder="1"
                  />
                </div>
                <div className="form-group">
                  <label>Duration Unit</label>
                  <select 
                    value={formData.durationUnit}
                    onChange={(e) => setFormData({...formData, durationUnit: e.target.value as any})}
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
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
                  <label>&nbsp;</label>
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
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Type a feature and press Enter"
                    />
                    <button type="button" className="btn btn-sm btn-primary" onClick={addFeature}>
                      <Plus size={14} />
                    </button>
                  </div>
                  {formData.features.length > 0 && (
                    <div className="features-list">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="feature-tag">
                          {feature}
                          <button type="button" onClick={() => removeFeature(index)}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSavePlan}>
                <Check size={14} />
                {editingPlan ? 'Save Changes' : 'Add Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
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
                <p>Are you sure you want to delete this plan?</p>
                <span>Existing subscriptions will not be affected.</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDeletePlan(showDeleteConfirm)}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlansManagement;
