/**
 * Add Plan Page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, CreditCard, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { createPlan } from '../../services/api/admin';
import './AdminPages.css';

export function PlanAdd() {
  const navigate = useNavigate();
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

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.planName || !formData.price) {
      toast.error('Plan name and price are required');
      return;
    }

    setSaving(true);
    try {
      const response = await createPlan(formData);
      if (response.success) {
        toast.success('Plan created successfully');
        navigate('/admin/plans');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create plan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/plans')}><ArrowLeft size={20} /></button>
          <div><h1>Add New Plan</h1><p>Create a subscription plan</p></div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}><CreditCard size={24} /></div>
            <div><h2>Plan Information</h2><p>Enter plan details</p></div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Plan Name <span className="required">*</span></label>
                  <input type="text" value={formData.planName} onChange={(e) => setFormData({ ...formData, planName: e.target.value })} placeholder="e.g., Basic, Pro, Premium" required />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input type="text" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} placeholder="e.g., Monthly Basic" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} placeholder="Plan description..." />
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Pricing</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Price (₹) <span className="required">*</span></label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} min="0" required />
                </div>
                <div className="form-group">
                  <label>Original Price (₹)</label>
                  <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })} min="0" />
                  <span className="form-hint">For showing discount</span>
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Duration (Months)</label>
                  <input type="number" value={formData.durationMonths} onChange={(e) => setFormData({ ...formData, durationMonths: parseInt(e.target.value) || 1 })} min="1" />
                </div>
                <div className="form-group">
                  <label>Display Order</label>
                  <input type="number" value={formData.displayOrder} onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })} min="0" />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Features</h3>
              <div className="form-group">
                <label>Plan Features</label>
                <div className="feature-input">
                  <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} placeholder="Add a feature..." onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                  <button type="button" className="btn btn-outline" onClick={addFeature}><Plus size={16} /> Add</button>
                </div>
                {formData.features.length > 0 && (
                  <div className="features-list">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="feature-tag">
                        <span>{feature}</span>
                        <button type="button" onClick={() => removeFeature(index)}><X size={14} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3 className="form-section-title">Status</h3>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text"><strong>Active</strong><small>Plan is available for purchase</small></span>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="toggle-slider"></span>
                  </label>
                </label>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text"><strong>Popular</strong><small>Highlight as recommended plan</small></span>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={formData.isPopular} onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })} />
                    <span className="toggle-slider"></span>
                  </label>
                </label>
              </div>
            </div>
          </div>

          <div className="form-card-footer">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/admin/plans')}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><Loader2 size={16} className="spinner" /> Creating...</> : <><Save size={16} /> Create Plan</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanAdd;
