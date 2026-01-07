/**
 * Plans List Page
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Search, Plus, Edit2, Trash2, Eye, X, AlertCircle,
  Crown, Users, Loader2, RefreshCw, CheckCircle, IndianRupee,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPlans, deletePlan } from '../../services/api/admin';
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
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await getPlans({ search: searchQuery });
      if (response.success) setPlans(response.data);
    } catch (error) {
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlans();
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const response = await deletePlan(id);
      if (response.success) {
        toast.success('Plan deleted');
        setShowDeleteConfirm(null);
        fetchPlans();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Plans Management</h1>
          <p>Manage subscription plans</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchPlans}><RefreshCw size={16} /> Refresh</button>
          <button className="btn btn-primary" onClick={() => navigate('/admin/plans/add')}><Plus size={16} /> Add Plan</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3B82F615', color: '#3B82F6' }}><CreditCard size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Total Plans</p>
            <h3 className="stat-value">{plans.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#22C55E15', color: '#22C55E' }}><CheckCircle size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Active</p>
            <h3 className="stat-value">{plans.filter(p => p.isActive).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#F9731615', color: '#F97316' }}><Crown size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Popular</p>
            <h3 className="stat-value">{plans.filter(p => p.isPopular).length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8B5CF615', color: '#8B5CF6' }}><Users size={22} /></div>
          <div className="stat-content">
            <p className="stat-title">Subscribers</p>
            <h3 className="stat-value">{plans.reduce((sum, p) => sum + (p.subscriberCount || 0), 0).toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-wrapper">
            <Search size={18} />
            <input type="text" placeholder="Search plans..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            {searchQuery && <button type="button" className="clear-btn" onClick={() => { setSearchQuery(''); fetchPlans(); }}><X size={16} /></button>}
          </div>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {/* Table */}
      <div className="data-table-container">
        {loading ? (
          <div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div>
        ) : plans.length === 0 ? (
          <div className="empty-state">
            <CreditCard size={64} />
            <h3>No plans found</h3>
            <button className="btn btn-primary" onClick={() => navigate('/admin/plans/add')} style={{ marginTop: '16px' }}><Plus size={16} /> Add Plan</button>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Subscribers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar" style={{ background: plan.isPopular ? '#F97316' : '#3B82F6' }}>
                        {plan.isPopular ? <Crown size={16} /> : <CreditCard size={16} />}
                      </div>
                      <div>
                        <span className="user-name">{plan.planName}</span>
                        {plan.displayName && <small>{plan.displayName}</small>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="price-cell">
                      <span className="price-current">{formatPrice(plan.price)}</span>
                      {plan.originalPrice && plan.originalPrice > plan.price && (
                        <small className="price-original">{formatPrice(plan.originalPrice)}</small>
                      )}
                    </div>
                  </td>
                  <td>{plan.durationMonths} {plan.durationMonths === 1 ? 'month' : 'months'}</td>
                  <td><span className="count-badge">{plan.subscriberCount || 0}</span></td>
                  <td>
                    <div className="status-group">
                      <span className={`status-badge ${plan.isActive ? 'success' : 'inactive'}`}>
                        {plan.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {plan.isPopular && <span className="status-badge warning">Popular</span>}
                    </div>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn view" onClick={() => navigate(`/admin/plans/${plan.id}`)}><Eye size={16} /></button>
                      <button className="action-btn edit" onClick={() => navigate(`/admin/plans/${plan.id}/edit`)}><Edit2 size={16} /></button>
                      <button className="action-btn delete" onClick={() => setShowDeleteConfirm(plan.id)}><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal modal-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header"><h2>Delete Plan</h2><button className="modal-close" onClick={() => setShowDeleteConfirm(null)}><X size={20} /></button></div>
            <div className="modal-body">
              <div className="delete-warning"><AlertCircle size={48} /><h3>Are you sure?</h3><p>This will delete the plan.</p></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)} disabled={deleting}>
                {deleting ? <><Loader2 size={16} className="spinner" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlansManagement;
