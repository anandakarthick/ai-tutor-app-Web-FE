/**
 * Admin Settings Page
 */

import { useState } from 'react';
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
  Globe,
  Clock,
  AlertTriangle,
  Check,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminPages.css';

export function AdminSettings() {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showRazorpayKey, setShowRazorpayKey] = useState(false);
  const [showWebhookSecret, setShowWebhookSecret] = useState(false);

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

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (section === 'general') {
      navigate('/admin/settings');
    } else {
      navigate(`/admin/settings/${section}`);
    }
  };

  // Form states
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'AI Tutor',
    siteDescription: 'Your AI-powered learning companion',
    siteUrl: 'https://aitutor.com',
    supportEmail: 'support@aitutor.com',
    supportPhone: '+91 1800-123-4567',
    timezone: 'Asia/Kolkata',
    language: 'en',
    maintenanceMode: false,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: true,
    razorpayKeyId: 'rzp_test_xxxxxxxxxxxx',
    razorpayKeySecret: 'xxxxxxxxxxxxxxxxxxxx',
    webhookSecret: 'whsec_xxxxxxxxxxxx',
    testMode: true,
  });

  const [apiSettings, setApiSettings] = useState({
    claudeApiKey: 'sk-ant-xxxxxxxxxxxx',
    claudeModel: 'claude-3-sonnet',
    firebaseApiKey: 'AIzaSyxxxxxxxxxx',
    firebaseProjectId: 'ai-tutor-app',
    smsProvider: 'twilio',
    smsApiKey: 'xxxxxxxxxxxx',
  });

  const [appSettings, setAppSettings] = useState({
    currentVersion: '1.0.0',
    minVersion: '1.0.0',
    forceUpdate: false,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.aitutor.app',
    appStoreUrl: 'https://apps.apple.com/app/ai-tutor/id123456789',
    maxLoginDevices: 3,
    sessionTimeout: 30,
    freeTrialDays: 7,
    maxQuestionsPerDay: 50,
    offlineMode: true,
    pushNotifications: true,
    analyticsEnabled: true,
    crashReporting: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    newUserNotification: true,
    paymentNotification: true,
    subscriptionExpiryNotification: true,
    dailyReportEmail: false,
    weeklyReportEmail: true,
    reportRecipients: 'admin@aitutor.com',
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    toast.success('Settings saved successfully!');
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

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your platform configuration</p>
        </div>
        <div className="header-actions">
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
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Site URL</label>
                  <input 
                    type="url" 
                    value={generalSettings.siteUrl}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Site Description</label>
                  <textarea 
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Support Email</label>
                  <input 
                    type="email" 
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Support Phone</label>
                  <input 
                    type="tel" 
                    value={generalSettings.supportPhone}
                    onChange={(e) => setGeneralSettings({...generalSettings, supportPhone: e.target.value})}
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
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
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
                    checked={paymentSettings.razorpayEnabled}
                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpayEnabled: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-grid" style={{ marginTop: '16px' }}>
                <div className="form-group">
                  <label>Razorpay Key ID</label>
                  <div className="input-with-action">
                    <input 
                      type={showRazorpayKey ? 'text' : 'password'} 
                      value={paymentSettings.razorpayKeyId}
                      onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeyId: e.target.value})}
                    />
                    <button type="button" onClick={() => setShowRazorpayKey(!showRazorpayKey)}>
                      {showRazorpayKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Razorpay Key Secret</label>
                  <div className="input-with-action">
                    <input 
                      type="password" 
                      value={paymentSettings.razorpayKeySecret}
                      onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeySecret: e.target.value})}
                    />
                    <button type="button">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
                <div className="form-group full-width">
                  <label>Webhook Secret</label>
                  <div className="input-with-action">
                    <input 
                      type={showWebhookSecret ? 'text' : 'password'} 
                      value={paymentSettings.webhookSecret}
                      onChange={(e) => setPaymentSettings({...paymentSettings, webhookSecret: e.target.value})}
                    />
                    <button type="button" onClick={() => setShowWebhookSecret(!showWebhookSecret)}>
                      {showWebhookSecret ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    checked={paymentSettings.testMode}
                    onChange={(e) => setPaymentSettings({...paymentSettings, testMode: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              {paymentSettings.testMode && (
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
                      value={apiSettings.claudeApiKey}
                      onChange={(e) => setApiSettings({...apiSettings, claudeApiKey: e.target.value})}
                    />
                    <button type="button" onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Claude Model</label>
                  <select 
                    value={apiSettings.claudeModel}
                    onChange={(e) => setApiSettings({...apiSettings, claudeModel: e.target.value})}
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
                    value={apiSettings.firebaseApiKey}
                    onChange={(e) => setApiSettings({...apiSettings, firebaseApiKey: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Firebase Project ID</label>
                  <input 
                    type="text" 
                    value={apiSettings.firebaseProjectId}
                    onChange={(e) => setApiSettings({...apiSettings, firebaseProjectId: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>SMS Provider</label>
                  <select 
                    value={apiSettings.smsProvider}
                    onChange={(e) => setApiSettings({...apiSettings, smsProvider: e.target.value})}
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
                    value={apiSettings.smsApiKey}
                    onChange={(e) => setApiSettings({...apiSettings, smsApiKey: e.target.value})}
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
                    value={appSettings.currentVersion}
                    onChange={(e) => setAppSettings({...appSettings, currentVersion: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Version</label>
                  <input 
                    type="text" 
                    value={appSettings.minVersion}
                    onChange={(e) => setAppSettings({...appSettings, minVersion: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Play Store URL</label>
                  <input 
                    type="url" 
                    value={appSettings.playStoreUrl}
                    onChange={(e) => setAppSettings({...appSettings, playStoreUrl: e.target.value})}
                  />
                </div>
                <div className="form-group full-width">
                  <label>App Store URL</label>
                  <input 
                    type="url" 
                    value={appSettings.appStoreUrl}
                    onChange={(e) => setAppSettings({...appSettings, appStoreUrl: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Login Devices</label>
                  <input 
                    type="number" 
                    value={appSettings.maxLoginDevices}
                    onChange={(e) => setAppSettings({...appSettings, maxLoginDevices: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    value={appSettings.sessionTimeout}
                    onChange={(e) => setAppSettings({...appSettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Free Trial Days</label>
                  <input 
                    type="number" 
                    value={appSettings.freeTrialDays}
                    onChange={(e) => setAppSettings({...appSettings, freeTrialDays: parseInt(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Max Questions/Day (Free)</label>
                  <input 
                    type="number" 
                    value={appSettings.maxQuestionsPerDay}
                    onChange={(e) => setAppSettings({...appSettings, maxQuestionsPerDay: parseInt(e.target.value)})}
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
                    checked={appSettings.forceUpdate}
                    onChange={(e) => setAppSettings({...appSettings, forceUpdate: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Offline Mode</h4>
                  <p>Allow users to access content offline</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.offlineMode}
                    onChange={(e) => setAppSettings({...appSettings, offlineMode: e.target.checked})}
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
                    checked={appSettings.pushNotifications}
                    onChange={(e) => setAppSettings({...appSettings, pushNotifications: e.target.checked})}
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
                    checked={appSettings.analyticsEnabled}
                    onChange={(e) => setAppSettings({...appSettings, analyticsEnabled: e.target.checked})}
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
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
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
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, smsNotifications: e.target.checked})}
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
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings({...notificationSettings, pushNotifications: e.target.checked})}
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
                    checked={notificationSettings.newUserNotification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, newUserNotification: e.target.checked})}
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
                    checked={notificationSettings.paymentNotification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, paymentNotification: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Subscription Expiry</h4>
                  <p>Notify before subscription expires</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={notificationSettings.subscriptionExpiryNotification}
                    onChange={(e) => setNotificationSettings({...notificationSettings, subscriptionExpiryNotification: e.target.checked})}
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
                    checked={notificationSettings.dailyReportEmail}
                    onChange={(e) => setNotificationSettings({...notificationSettings, dailyReportEmail: e.target.checked})}
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
                    checked={notificationSettings.weeklyReportEmail}
                    onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReportEmail: e.target.checked})}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Report Recipients (comma separated)</label>
                <input 
                  type="text" 
                  value={notificationSettings.reportRecipients}
                  onChange={(e) => setNotificationSettings({...notificationSettings, reportRecipients: e.target.value})}
                  placeholder="admin@aitutor.com, manager@aitutor.com"
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
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>IP Whitelisting</h4>
                  <p>Restrict admin access to specific IPs</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Session Logging</h4>
                  <p>Log all admin session activities</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Password Policy</label>
                <select>
                  <option value="basic">Basic (8 characters)</option>
                  <option value="medium">Medium (8 chars + numbers)</option>
                  <option value="strong">Strong (8 chars + numbers + symbols)</option>
                </select>
              </div>
              <div className="form-group">
                <label>Auto Logout After (minutes)</label>
                <input type="number" defaultValue={30} />
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
                  <input type="text" placeholder="smtp.gmail.com" />
                </div>
                <div className="form-group">
                  <label>SMTP Port</label>
                  <input type="number" placeholder="587" />
                </div>
                <div className="form-group">
                  <label>SMTP Username</label>
                  <input type="text" placeholder="noreply@aitutor.com" />
                </div>
                <div className="form-group">
                  <label>SMTP Password</label>
                  <input type="password" placeholder="••••••••" />
                </div>
                <div className="form-group">
                  <label>From Email</label>
                  <input type="email" placeholder="noreply@aitutor.com" />
                </div>
                <div className="form-group">
                  <label>From Name</label>
                  <input type="text" placeholder="AI Tutor" />
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h4>Use TLS</h4>
                  <p>Enable TLS encryption for emails</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
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
                  <input type="checkbox" defaultChecked />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Backup Time</label>
                <input type="time" defaultValue="02:00" />
              </div>
              <div className="form-group">
                <label>Retention Period (days)</label>
                <input type="number" defaultValue={30} />
              </div>
              <div className="form-group">
                <label>Backup Storage</label>
                <select>
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
