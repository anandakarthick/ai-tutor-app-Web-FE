/**
 * Edit Plan Page
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, CreditCard, Plus, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getPlanById, updatePlan } from '../../services/api/admin';
import './AdminPages.css';

export function PlanEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
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
    fetchPlan();
  }, [id]);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const response = await getPlanById(id!);
      if (response.success && response.data) {
        const p = response.data;
        setFormData({
          planName: p.planName || '',
          displayName: p.displayName || '',
          description: p.description || '',
          price: p.price || 0,
          originalPrice: p.originalPrice || 0,
          durationMonths: p.durationMonths || 1,
          features: p.features || [],
          isPopular: p.isPopular ?? false,
          isActive: p.isActive ?? true,
          displayOrder: p.displayOrder || 0,
        });
      } else {
        setNotFound(true);
      }
    } catch (error) {
      setNotFound(true);
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.planName || !formData.price) {
      toast.error('Plan name and price are required');
      return;
    }

    setSaving(true);
    try {
      const response = await updatePlan(id!, formData);
      if (response.success) {
        toast.success('Plan updated successfully');
        navigate('/admin/plans');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update plan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-page"><div className="loading-container"><Loader2 size={40} className="spinner" /><p>Loading...</p></div></div>;
  if (notFound) return <div className="admin-page"><div className="not-found-container"><AlertCircle size={64} /><h2>Not Found</h2><button className="btn btn-primary" onClick={() => navigate('/admin/plans')}><ArrowLeft size={16} /> Back</button></div></div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div className="page-header-with-back">
          <button className="back-btn" onClick={() => navigate('/admin/plans')}><ArrowLeft size={20} /></button>
          <div><h1>Edit Plan</h1><p>Update plan details</p></div>
        </div>
      </div>

      <div className="form-page-container">
        <form onSubmit={handleSubmit} className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon" style={{ background: 'linear-gradient(135deg, #3B82F6, #60A5FA)' }}><CreditCard size={24} /></div>
            <div><h2>Plan Information</h2><p>Update plan details</p></div>
          </div>

          <div className="form-card-body">
            <div className="form-section">
              <h3 className="form-section-title">Basic Details</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Plan Name <span className="required">*</span></label>
                  <input type="text" value={formData.planName} onChange={(e) => setFormData({ ...formData, planName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input type="text" value={formData.displayName} onChange={(e) => setFormData({ ...formData, displayName: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
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
                  <span className="toggle-text"><strong>Active</strong><small>Plan is available</small></span>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                    <span className="toggle-slider"></span>
                  </label>
                </label>
              </div>
              <div className="form-group">
                <label className="toggle-label">
                  <span className="toggle-text"><strong>Popular</strong><small>Highlight as recommended</small></span>
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
              {saving ? <><Loader2 size={16} className="spinner" /> Saving...</> : <><Save size={16} /> Save Changes</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlanEdit;
