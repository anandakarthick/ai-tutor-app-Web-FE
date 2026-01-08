/**
 * Admin Settings Page
 * With API Integration
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Settings,
  CreditCard,
  Key,
  Smartphone,
  Bell,
  Shield,
  Mail,
  Database,
  Save,
  Eye,
  EyeOff,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getSettings, updateSettingsByCategory } from '../../services/api/admin';
import { useSettings, clearSettingsCache } from '../../context/SettingsContext';
import './AdminPages.css';

export function AdminSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshSettings } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showRazorpayKey, setShowRazorpayKey] = useState(false);

  // Determine active section from URL
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.includes('payment')) return 'payment';
    if (path.includes('api-keys')) return 'api-keys';
    if (path.includes('app-config')) return 'app-config';
    if (path.includes('notifications')) return 'notifications';
    if (path.includes('security')) return 'security';
    if (path.includes('email')) return 'email';
    if (path.includes('database')) return 'database';
    return 'general';
  };

  const [activeSection, setActiveSection] = useState(getActiveSection());

  // Update active section when URL changes
  useEffect(() => {
    setActiveSection(getActiveSection());
  }, [location.pathname]);

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === 'general') {
      navigate('/admin/settings');
    } else {
      navigate(`/admin/settings/${section}`);
    }
  };

  // Form states - defaults will be overwritten by API data
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    site_description: '',
    site_url: '',
    support_email: '',
    support_phone: '',
    timezone: 'Asia/Kolkata',
    language: 'en',
    maintenance_mode: false,
    maintenance_message: '',
  });

  const [paymentSettings, setPaymentSettings] = useState({
    razorpay_enabled: true,
    razorpay_key_id: '',
    razorpay_test_mode: true,
  });

  const [apiSettings, setApiSettings] = useState({
    claude_api_key: '',
    claude_model: 'claude-3-sonnet',
    firebase_api_key: '',
    firebase_project_id: '',
    sms_provider: 'twilio',
    sms_api_key: '',
  });

  const [appSettings, setAppSettings] = useState({
    app_current_version: '1.0.0',
    app_min_version: '1.0.0',
    app_force_update: false,
    app_update_message: '',
    play_store_url: '',
    app_store_url: '',
    max_login_devices: 3,
    session_timeout: 30,
    free_trial_days: 7,
    max_questions_per_day: 50,
    offline_mode: true,
    push_notifications: true,
    analytics_enabled: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    new_user_notification: true,
    payment_notification: true,
    subscription_expiry_notification: true,
    daily_report_email: false,
    weekly_report_email: true,
    report_recipients: '',
  });

  const [securitySettings, setSecuritySettings] = useState({
    two_factor_auth: false,
    ip_whitelisting: false,
    session_logging: true,
    password_policy: 'medium',
    auto_logout_minutes: 30,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: '',
    smtp_port: 587,
    smtp_username: '',
    smtp_from_email: '',
    smtp_from_name: '',
    smtp_use_tls: true,
  });

  const [databaseSettings, setDatabaseSettings] = useState({
    auto_backup: true,
    backup_time: '02:00',
    backup_retention_days: 30,
    backup_storage: 'local',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await getSettings();
      if (response.success && response.data) {
        const data = response.data;
        
        // Update general settings
        if (data.general) {
          setGeneralSettings(prev => ({ ...prev, ...data.general }));
        }
        
        // Update payment settings
        if (data.payment) {
          setPaymentSettings(prev => ({ ...prev, ...data.payment }));
        }
        
        // Update API settings
        if (data.api) {
          setApiSettings(prev => ({ ...prev, ...data.api }));
        }
        
        // Update app settings
        if (data.app) {
          setAppSettings(prev => ({ ...prev, ...data.app }));
        }
        
        // Update notification settings
        if (data.notifications) {
          setNotificationSettings(prev => ({ ...prev, ...data.notifications }));
        }
        
        // Update security settings
        if (data.security) {
          setSecuritySettings(prev => ({ ...prev, ...data.security }));
        }
        
        // Update email settings
        if (data.email) {
          setEmailSettings(prev => ({ ...prev, ...data.email }));
        }
        
        // Update database settings
        if (data.database) {
          setDatabaseSettings(prev => ({ ...prev, ...data.database }));
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determine which category to save
      let data: Record<string, any> = {};
      let category = activeSection;

      switch (activeSection) {
        case 'general':
          data = generalSettings;
          break;
        case 'payment':
          data = paymentSettings;
          break;
        case 'api-keys':
          data = apiSettings;
          category = 'api';
          break;
        case 'app-config':
          data = appSettings;
          category = 'app';
          break;
        case 'notifications':
          data = notificationSettings;
          break;
        case 'security':
          data = securitySettings;
          break;
        case 'email':
          data = emailSettings;
          break;
        case 'database':
          data = databaseSettings;
          break;
        default:
          data = generalSettings;
          category = 'general';
      }

      await updateSettingsByCategory(category, data);
      
      // Clear cache and refresh global settings context
      clearSettingsCache();
      await refreshSettings();
      
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'app-config', label: 'App Configuration', icon: Smartphone },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'database', label: 'Database', icon: Database },
  ];

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading-container">
          <Loader2 size={40} className="spinner" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your platform configuration</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={fetchSettings} disabled={loading}>
            <RefreshCw size={16} />
            Refresh
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 size={16} className="spinner" /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`settings-nav-item ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavigate(item.id)}
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div className="settings-section">
              <h3>General Settings</h3>
              <p>Basic platform configuration</p>
              <div className="form-grid">
                <div className="form-group">
                  <label>Site Name</label>
                  <input 
                    type="text" 
                    value={generalSettings.site_name}
                    onChange={(e) => setGeneralSettings({...generalSettings, site_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Site URL</label>
                  <input 
                    type="url" 
                    value={generalSettings.site_url}
                    onChange={(e) => setGeneralSettings({...generalSettings, site_url: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Site Description</label>
                  <textarea 
                    value={generalSettings.site_description}
                    onChange={(e) => setGeneralSettings({...generalSettings, site_description: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Support Email</label>
                  <input 
                    type="email" 
                    value={generalSettings.support_email}
                    onChange={(e) => setGeneralSettings({...generalSettings, support_email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Support Phone</label>
                  <input 
                    type="tel" 
                    value={generalSettings.support_phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, support_phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Timezone</label>
                  <select 
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <select 
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Maintenance Mode</h4>
                  <p>Temporarily disable access to the platform</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={generalSettings.maintenance_mode}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenance_mode: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {generalSettings.maintenance_mode && (
                <div className="form-group full-width" style={{ marginTop: '16px' }}>
                  <label>Maintenance Message</label>
                  <textarea 
                    value={generalSettings.maintenance_message}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenance_message: e.target.value})}
                    placeholder="We are currently under maintenance. Please check back soon."
                    rows={3}
                  />
                </div>
              )}
              {generalSettings.maintenance_mode && (
                <div className="alert alert-warning" style={{ marginTop: '16px' }}>
                  <AlertTriangle size={16} />
                  Maintenance mode is ON. Users will not be able to access the web app and mobile app.
                </div>
              )}
            </div>
          )}

          {/* Payment Gateway Settings */}
          {activeSection === 'payment' && (
            <div className="settings-section">
              <h3>Payment Gateway</h3>
              <p>Configure Razorpay payment integration</p>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Enable Razorpay</h4>
                  <p>Accept payments via Razorpay</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.razorpay_enabled}
                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_enabled: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-grid" style={{ marginTop: '16px' }}>
                <div className="form-group full-width">
                  <label>Razorpay Key ID</label>
                  <div className="input-with-action">
                    <input 
                      type={showRazorpayKey ? 'text' : 'password'} 
                      value={paymentSettings.razorpay_key_id}
                      onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_key_id: e.target.value})}
                      placeholder="rzp_test_xxxxxxxxxxxx"
                    />
                    <button type="button" onClick={() => setShowRazorpayKey(!showRazorpayKey)}>
                      {showRazorpayKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Test Mode</h4>
                  <p>Use test credentials for development</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={paymentSettings.razorpay_test_mode}
                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_test_mode: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {paymentSettings.razorpay_test_mode && (
                <div className="alert alert-warning" style={{ marginTop: '16px' }}>
                  <AlertTriangle size={16} />
                  Test mode is enabled. Real payments will not be processed.
                </div>
              )}
            </div>
          )}

          {/* API Keys Settings */}
          {activeSection === 'api-keys' && (
            <div className="settings-section">
              <h3>API Keys</h3>
              <p>Manage third-party API integrations</p>
              <div className="form-grid">
                <div className="form-group">
                  <label>Claude API Key</label>
                  <div className="input-with-action">
                    <input 
                      type={showApiKey ? 'text' : 'password'} 
                      value={apiSettings.claude_api_key}
                      onChange={(e) => setApiSettings({...apiSettings, claude_api_key: e.target.value})}
                      placeholder="sk-ant-xxxxxxxxxxxx"
                    />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Claude Model</label>
                  <select 
                    value={apiSettings.claude_model}
                    onChange={(e) => setApiSettings({...apiSettings, claude_model: e.target.value})}
                  >
                    <option value="claude-3-sonnet">Claude 3 Sonnet</option>
                    <option value="claude-3-opus">Claude 3 Opus</option>
                    <option value="claude-3-haiku">Claude 3 Haiku</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Firebase API Key</label>
                  <input 
                    type="password" 
                    value={apiSettings.firebase_api_key}
                    onChange={(e) => setApiSettings({...apiSettings, firebase_api_key: e.target.value})}
                    placeholder="AIzaSyxxxxxxxxxx"
                  />
                </div>
                <div className="form-group">
                  <label>Firebase Project ID</label>
                  <input 
                    type="text" 
                    value={apiSettings.firebase_project_id}
                    onChange={(e) => setApiSettings({...apiSettings, firebase_project_id: e.target.value})}
                    placeholder="your-project-id"
                  />
                </div>
                <div className="form-group">
                  <label>SMS Provider</label>
                  <select 
                    value={apiSettings.sms_provider}
                    onChange={(e) => setApiSettings({...apiSettings, sms_provider: e.target.value})}
                  >
                    <option value="twilio">Twilio</option>
                    <option value="msg91">MSG91</option>
                    <option value="textlocal">Textlocal</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>SMS API Key</label>
                  <input 
                    type="password" 
                    value={apiSettings.sms_api_key}
                    onChange={(e) => setApiSettings({...apiSettings, sms_api_key: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {/* App Configuration */}
          {activeSection === 'app-config' && (
            <div className="settings-section">
              <h3>App Configuration</h3>
              <p>Mobile app settings and limits</p>
              <div className="form-grid">
                <div className="form-group">
                  <label>Current Version</label>
                  <input 
                    type="text" 
                    value={appSettings.app_current_version}
                    onChange={(e) => setAppSettings({...appSettings, app_current_version: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Version</label>
                  <input 
                    type="text" 
                    value={appSettings.app_min_version}
                    onChange={(e) => setAppSettings({...appSettings, app_min_version: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Play Store URL</label>
                  <input 
                    type="url" 
                    value={appSettings.play_store_url}
                    onChange={(e) => setAppSettings({...appSettings, play_store_url: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>App Store URL</label>
                  <input 
                    type="url" 
                    value={appSettings.app_store_url}
                    onChange={(e) => setAppSettings({...appSettings, app_store_url: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Login Devices</label>
                  <input 
                    type="number" 
                    value={appSettings.max_login_devices}
                    onChange={(e) => setAppSettings({...appSettings, max_login_devices: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    value={appSettings.session_timeout}
                    onChange={(e) => setAppSettings({...appSettings, session_timeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Free Trial Days</label>
                  <input 
                    type="number" 
                    value={appSettings.free_trial_days}
                    onChange={(e) => setAppSettings({...appSettings, free_trial_days: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Questions/Day (Free)</label>
                  <input 
                    type="number" 
                    value={appSettings.max_questions_per_day}
                    onChange={(e) => setAppSettings({...appSettings, max_questions_per_day: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Force Update</h4>
                  <p>Require users to update to minimum version</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.app_force_update}
                    onChange={(e) => setAppSettings({...appSettings, app_force_update: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {appSettings.app_force_update && (
                <div className="form-group full-width" style={{ marginTop: '16px' }}>
                  <label>Update Message</label>
                  <textarea 
                    value={appSettings.app_update_message}
                    onChange={(e) => setAppSettings({...appSettings, app_update_message: e.target.value})}
                    placeholder="A new version is available. Please update to continue using the app."
                    rows={3}
                  />
                </div>
              )}
              {appSettings.app_force_update && (
                <div className="alert alert-warning" style={{ marginTop: '16px' }}>
                  <AlertTriangle size={16} />
                  Force update is ON. Users with app version below {appSettings.app_min_version} will be forced to update.
                </div>
              )}
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Offline Mode</h4>
                  <p>Allow users to access content offline</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.offline_mode}
                    onChange={(e) => setAppSettings({...appSettings, offline_mode: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Push Notifications</h4>
                  <p>Enable push notifications for users</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.push_notifications}
                    onChange={(e) => setAppSettings({...appSettings, push_notifications: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Analytics</h4>
                  <p>Collect usage analytics</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.analytics_enabled}
                    onChange={(e) => setAppSettings({...appSettings, analytics_enabled: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeSection === 'notifications' && (
            <div className="settings-section">
              <h3>Notifications</h3>
              <p>Configure notification preferences</p>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Email Notifications</h4>
                  <p>Send notifications via email</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.email_notifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, email_notifications: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>SMS Notifications</h4>
                  <p>Send notifications via SMS</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.sms_notifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, sms_notifications: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Push Notifications</h4>
                  <p>Send push notifications to mobile app</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.push_notifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, push_notifications: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <h4 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '14px', color: 'var(--admin-text)' }}>Admin Notifications</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>New User Registration</h4>
                  <p>Notify when a new user registers</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.new_user_notification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, new_user_notification: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Payment Received</h4>
                  <p>Notify on successful payments</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.payment_notification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, payment_notification: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <h4 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '14px', color: 'var(--admin-text)' }}>Report Emails</h4>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Daily Report</h4>
                  <p>Receive daily summary report</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.daily_report_email}
                    onChange={(e) => setNotificationSettings({...notificationSettings, daily_report_email: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Weekly Report</h4>
                  <p>Receive weekly summary report</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.weekly_report_email}
                    onChange={(e) => setNotificationSettings({...notificationSettings, weekly_report_email: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Report Recipients (comma separated)</label>
                <input 
                  type="text" 
                  value={notificationSettings.report_recipients}
                  onChange={(e) => setNotificationSettings({...notificationSettings, report_recipients: e.target.value})}
                  placeholder="admin@example.com, manager@example.com"
                />
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <div className="settings-section">
              <h3>Security Settings</h3>
              <p>Configure security and access controls</p>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Require 2FA for admin login</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.two_factor_auth}
                    onChange={(e) => setSecuritySettings({...securitySettings, two_factor_auth: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>IP Whitelisting</h4>
                  <p>Restrict admin access to specific IPs</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.ip_whitelisting}
                    onChange={(e) => setSecuritySettings({...securitySettings, ip_whitelisting: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Session Logging</h4>
                  <p>Log all admin session activities</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={securitySettings.session_logging}
                    onChange={(e) => setSecuritySettings({...securitySettings, session_logging: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Password Policy</label>
                <select
                  value={securitySettings.password_policy}
                  onChange={(e) => setSecuritySettings({...securitySettings, password_policy: e.target.value})}
                >
                  <option value="basic">Basic (8 characters)</option>
                  <option value="medium">Medium (8 chars + numbers)</option>
                  <option value="strong">Strong (8 chars + numbers + symbols)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Auto Logout After (minutes)</label>
                <input 
                  type="number" 
                  value={securitySettings.auto_logout_minutes}
                  onChange={(e) => setSecuritySettings({...securitySettings, auto_logout_minutes: parseInt(e.target.value)})}
                />
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeSection === 'email' && (
            <div className="settings-section">
              <h3>Email Configuration</h3>
              <p>SMTP and email template settings</p>
              <div className="form-grid">
                <div className="form-group">
                  <label>SMTP Host</label>
                  <input 
                    type="text" 
                    value={emailSettings.smtp_host}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_host: e.target.value})}
                    placeholder="smtp.gmail.com" 
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Port</label>
                  <input 
                    type="number" 
                    value={emailSettings.smtp_port}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_port: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>SMTP Username</label>
                  <input 
                    type="text" 
                    value={emailSettings.smtp_username}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_username: e.target.value})}
                    placeholder="noreply@example.com" 
                  />
                </div>
                <div className="form-group">
                  <label>From Email</label>
                  <input 
                    type="email" 
                    value={emailSettings.smtp_from_email}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_from_email: e.target.value})}
                    placeholder="noreply@example.com" 
                  />
                </div>
                <div className="form-group">
                  <label>From Name</label>
                  <input 
                    type="text" 
                    value={emailSettings.smtp_from_name}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_from_name: e.target.value})}
                    placeholder="Your Site Name" 
                  />
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Use TLS</h4>
                  <p>Enable TLS encryption for emails</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={emailSettings.smtp_use_tls}
                    onChange={(e) => setEmailSettings({...emailSettings, smtp_use_tls: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* Database Settings */}
          {activeSection === 'database' && (
            <div className="settings-section">
              <h3>Database & Backup</h3>
              <p>Database management and backup settings</p>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Auto Backup</h4>
                  <p>Automatically backup database daily</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={databaseSettings.auto_backup}
                    onChange={(e) => setDatabaseSettings({...databaseSettings, auto_backup: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Backup Time</label>
                <input 
                  type="time" 
                  value={databaseSettings.backup_time}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, backup_time: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Retention Period (days)</label>
                <input 
                  type="number" 
                  value={databaseSettings.backup_retention_days}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, backup_retention_days: parseInt(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label>Backup Storage</label>
                <select
                  value={databaseSettings.backup_storage}
                  onChange={(e) => setDatabaseSettings({...databaseSettings, backup_storage: e.target.value})}
                >
                  <option value="local">Local Storage</option>
                  <option value="s3">AWS S3</option>
                  <option value="gcs">Google Cloud Storage</option>
                </select>
              </div>
              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <button className="btn btn-outline">
                  <Database size={16} />
                  Backup Now
                </button>
                <button className="btn btn-outline">
                  <Database size={16} />
                  Restore Backup
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminSettings;
