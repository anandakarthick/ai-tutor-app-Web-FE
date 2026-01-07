/**
 * Plans Management Page
 */

import { useState, useEffect } from 'react';
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
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPlans, createPlan, updatePlan, deletePlan } from '../../services/api/admin';
import './AdminPages.css';

interface PlanData {
  id: string;
  planName: string;
  displayName: string;
  description?: string;
  price: number;
  originalPrice?: number;
  durationMonths: number;
  features?: string[];
  isPopular?: boolean;
  isActive: boolean;
  displayOrder: number;
  subscriberCount?: number;
}

export function PlansManagement() {
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanData | null>(null);
  const [viewingPlan, setViewingPlan] = useState<PlanData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const [formData, setFormData] = useState({
    planName: '',
    displayName: '',
    description: '',
    price: 0,
    originalPrice: 0,
    durationMonths: 1,
    features: [] as string[],
    isPopular: false,
    isActive: true,
    displayOrder: 0,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await getPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan =>
    plan.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plan.planName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalSubscribers = plans.reduce((acc, p) => acc + (p.subscriberCount || 0), 0);
  const totalRevenue = plans.reduce((acc, p) => acc + ((p.subscriberCount || 0) * p.price), 0);

  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({
      planName: '',
      displayName: '',
      description: '',
      price: 0,
      originalPrice: 0,
      durationMonths: 1,
      features: [],
      isPopular: false,
      isActive: true,
      displayOrder: plans.length + 1,
    });
    setShowModal(true);
  };

  const handleEditPlan = (plan: PlanData) => {
    setEditingPlan(plan);
    setFormData({
      planName: plan.planName,
      displayName: plan.displayName,
      description: plan.description || '',
      price: plan.price,
      originalPrice: plan.originalPrice || 0,
      durationMonths: plan.durationMonths,
      features: plan.features || [],
      isPopular: plan.isPopular || false,
      isActive: plan.isActive,
      displayOrder: plan.displayOrder,
    });
    setShowModal(true);
  };

  const handleViewPlan = (plan: PlanData) => {
    setViewingPlan(plan);
    setShowViewModal(true);
  };

  const handleSavePlan = async () => {
    if (!formData.planName || !formData.displayName || formData.price <= 0) {
      toast.error('Please fill in required fields');
      return;
    }

    setSaving(true);
    try {
      if (editingPlan) {
        const response = await updatePlan(editingPlan.id, formData);
        if (response.success) {
          toast.success('Plan updated successfully');
        }
      } else {
        const response = await createPlan(formData);
        if (response.success) {
          toast.success('Plan created successfully');
        }
      }
      setShowModal(false);
      fetchPlans();
    } catch (error: any) {
      console.error('Error saving plan:', error);
      toast.error(error.response?.data?.message || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      const response = await deletePlan(id);
      if (response.success) {
        toast.success('Plan deleted successfully');
        setShowDeleteConfirm(null);
        fetchPlans();
      }
    } catch (error: any) {
      console.error('Error deleting plan:', error);
      toast.error(error.response?.data?.message || 'Failed to delete plan');
    }
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

  const getDurationText = (months: number) => {
    if (months === 1) return '1 Month';
    if (months === 3) return '3 Months';
    if (months === 6) return '6 Months';
    if (months === 12) return '1 Year';
    return `${months} Months`;
  };

  const getDiscount = (price: number, originalPrice: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Subscription Plans</h1>
          <p>Manage subscription plans and pricing</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchPlans}>
            <RefreshCw size={16} />
            Refresh
          </button>
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
            <h3 className="stat-value">{plans.filter(p => p.isActive).length}</h3>
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

        {loading ? (
          <div className="loading-container" style={{ padding: '60px 20px' }}>
            <Loader2 size={32} className="spinner" />
            <p>Loading plans...</p>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
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
                        <div className="user-cell">
                          <div className="user-avatar" style={{ background: plan.isPopular ? 'linear-gradient(135deg, #F97316, #FB923C)' : 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}>
                            {plan.isPopular ? <Crown size={16} /> : <CreditCard size={16} />}
                          </div>
                          <div>
                            <span className="user-name">{plan.displayName}</span>
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--admin-text-muted)' }}>{plan.planName}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="number-cell success">₹{plan.price.toLocaleString()}</span>
                      </td>
                      <td>{getDurationText(plan.durationMonths)}</td>
                      <td>
                        {getDiscount(plan.price, plan.originalPrice || 0) > 0 ? (
                          <span className="plan-badge yearly">{getDiscount(plan.price, plan.originalPrice || 0)}% OFF</span>
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)' }}>-</span>
                        )}
                      </td>
                      <td>
                        <span className="number-cell">{(plan.subscriberCount || 0).toLocaleString()}</span>
                      </td>
                      <td>
                        {plan.isPopular ? (
                          <span className="plan-badge yearly"><Crown size={12} /> Yes</span>
                        ) : (
                          <span style={{ color: 'var(--admin-text-muted)' }}>No</span>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${plan.isActive ? 'active' : 'inactive'}`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
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
                <button className="pagination-btn" disabled>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
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
                <span className={`status-badge ${viewingPlan.isActive ? 'active' : 'inactive'}`}>{viewingPlan.isActive ? 'Active' : 'Inactive'}</span>
              </div>
              <div className="view-details">
                <div className="detail-item">
                  <label>Plan Name</label>
                  <span>{viewingPlan.planName}</span>
                </div>
                <div className="detail-item">
                  <label>Price</label>
                  <span className="highlight">₹{viewingPlan.price.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Duration</label>
                  <span>{getDurationText(viewingPlan.durationMonths)}</span>
                </div>
                <div className="detail-item">
                  <label>Discount</label>
                  <span>{getDiscount(viewingPlan.price, viewingPlan.originalPrice || 0)}%</span>
                </div>
                <div className="detail-item">
                  <label>Subscribers</label>
                  <span className="highlight success">{(viewingPlan.subscriberCount || 0).toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <label>Popular</label>
                  <span>{viewingPlan.isPopular ? 'Yes' : 'No'}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Description</label>
                  <span>{viewingPlan.description || '-'}</span>
                </div>
                {viewingPlan.features && viewingPlan.features.length > 0 && (
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
                )}
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
                    value={formData.planName}
                    onChange={(e) => setFormData({...formData, planName: e.target.value})}
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
                  <label>Original Price (₹)</label>
                  <input 
                    type="number" 
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({...formData, originalPrice: parseInt(e.target.value) || 0})}
                    placeholder="For discount calculation"
                  />
                </div>
                <div className="form-group">
                  <label>Duration (Months)</label>
                  <select 
                    value={formData.durationMonths}
                    onChange={(e) => setFormData({...formData, durationMonths: parseInt(e.target.value)})}
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months</option>
                    <option value={12}>1 Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select 
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData({...formData, isActive: e.target.value === 'active'})}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input 
                    type="number" 
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({...formData, displayOrder: parseInt(e.target.value) || 0})}
                  />
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
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSavePlan} disabled={saving}>
                {saving ? <Loader2 size={14} className="spinner" /> : <Check size={14} />}
                {saving ? 'Saving...' : (editingPlan ? 'Save Changes' : 'Add Plan')}
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
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancel
              </button>
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
