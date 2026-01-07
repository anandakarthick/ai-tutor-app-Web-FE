/**
 * Admin Settings Page
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Settings,
  CreditCard,
  Key,
  Smartphone,
  Bell,
  Globe,
  Shield,
  Database,
  Mail,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import './AdminPages.css';

export function AdminSettings() {
  const location = useLocation();
  const currentPath = location.pathname;

  const settingsNav = [
    { id: 'general', label: 'General Settings', icon: Settings, path: '/admin/settings' },
    { id: 'payment', label: 'Payment Gateway', icon: CreditCard, path: '/admin/settings/payment' },
    { id: 'api-keys', label: 'API Keys', icon: Key, path: '/admin/settings/api-keys' },
    { id: 'app-config', label: 'App Configuration', icon: Smartphone, path: '/admin/settings/app-config' },
    { id: 'notifications', label: 'Notifications', icon: Bell, path: '/admin/settings/notifications' },
    { id: 'security', label: 'Security', icon: Shield, path: '/admin/settings/security' },
    { id: 'email', label: 'Email Settings', icon: Mail, path: '/admin/settings/email' },
    { id: 'database', label: 'Database', icon: Database, path: '/admin/settings/database' },
  ];

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'AI Tutor',
    siteDescription: 'AI-powered educational platform',
    siteUrl: 'https://aitutor.com',
    supportEmail: 'support@aitutor.com',
    supportPhone: '+91 98765 43210',
    timezone: 'Asia/Kolkata',
    language: 'en',
    maintenanceMode: false,
  });

  // Payment Gateway Settings
  const [paymentSettings, setPaymentSettings] = useState({
    razorpayEnabled: true,
    razorpayKeyId: 'rzp_test_xxxxxxxxxxxxx',
    razorpayKeySecret: '••••••••••••••••••••',
    razorpayWebhookSecret: '••••••••••••••••••••',
    paytmEnabled: false,
    paytmMerchantId: '',
    paytmMerchantKey: '',
    stripeEnabled: false,
    stripePublishableKey: '',
    stripeSecretKey: '',
    testMode: true,
  });

  // API Keys Settings
  const [apiSettings, setApiSettings] = useState({
    claudeApiKey: 'sk-ant-api03-••••••••••••••••••••',
    claudeModel: 'claude-3-sonnet-20240229',
    openaiApiKey: '',
    googleApiKey: '',
    firebaseApiKey: 'AIzaSy••••••••••••••••••••',
    firebaseProjectId: 'ai-tutor-app',
    smsApiKey: '',
    smsProvider: 'twilio',
  });

  // App Configuration
  const [appConfig, setAppConfig] = useState({
    appVersion: '1.0.0',
    minAppVersion: '1.0.0',
    forceUpdate: false,
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.aitutor',
    appStoreUrl: 'https://apps.apple.com/app/ai-tutor/id123456789',
    maxLoginDevices: 2,
    sessionTimeout: 30,
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableAnalytics: true,
    enableCrashReporting: true,
    freeTrialDays: 7,
    maxQuestionsPerDay: 50,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    newUserNotification: true,
    paymentNotification: true,
    subscriptionExpiryNotification: true,
    dailyReportEmail: true,
    weeklyReportEmail: true,
    reportEmailRecipients: 'admin@aitutor.com',
  });

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);

  const toggleSecret = (key: string) => {
    setShowSecrets({ ...showSecrets, [key]: !showSecrets[key] });
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Settings saved successfully!');
    setIsSaving(false);
  };

  const renderGeneralSettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Site Information</h3>
        <p>Basic information about your platform</p>
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
        </div>
      </div>

      <div className="settings-section">
        <h3>Contact Information</h3>
        <p>Support contact details displayed to users</p>
        <div className="form-grid">
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
        </div>
      </div>

      <div className="settings-section">
        <h3>Regional Settings</h3>
        <div className="form-grid">
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
            <label>Default Language</label>
            <select 
              value={generalSettings.language}
              onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Maintenance Mode</h3>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Enable Maintenance Mode</h4>
            <p>When enabled, users will see a maintenance page</p>
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
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Razorpay Configuration</h3>
        <p>Configure Razorpay payment gateway</p>
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
        {paymentSettings.razorpayEnabled && (
          <div className="form-grid" style={{ marginTop: '16px' }}>
            <div className="form-group">
              <label>Razorpay Key ID</label>
              <div className="input-with-action">
                <input 
                  type={showSecrets['razorpayKeyId'] ? 'text' : 'password'}
                  value={paymentSettings.razorpayKeyId}
                  onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeyId: e.target.value})}
                />
                <button type="button" onClick={() => toggleSecret('razorpayKeyId')}>
                  {showSecrets['razorpayKeyId'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Razorpay Key Secret</label>
              <div className="input-with-action">
                <input 
                  type={showSecrets['razorpayKeySecret'] ? 'text' : 'password'}
                  value={paymentSettings.razorpayKeySecret}
                  onChange={(e) => setPaymentSettings({...paymentSettings, razorpayKeySecret: e.target.value})}
                />
                <button type="button" onClick={() => toggleSecret('razorpayKeySecret')}>
                  {showSecrets['razorpayKeySecret'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group full-width">
              <label>Webhook Secret</label>
              <div className="input-with-action">
                <input 
                  type={showSecrets['razorpayWebhook'] ? 'text' : 'password'}
                  value={paymentSettings.razorpayWebhookSecret}
                  onChange={(e) => setPaymentSettings({...paymentSettings, razorpayWebhookSecret: e.target.value})}
                />
                <button type="button" onClick={() => toggleSecret('razorpayWebhook')}>
                  {showSecrets['razorpayWebhook'] ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Test Mode</h3>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Enable Test Mode</h4>
            <p>Use test credentials for payments (no real charges)</p>
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
            <AlertCircle size={18} />
            <span>Test mode is enabled. No real payments will be processed.</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Claude AI Configuration</h3>
        <p>Configure Claude API for AI-powered features</p>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Claude API Key</label>
            <div className="input-with-action">
              <input 
                type={showSecrets['claudeApiKey'] ? 'text' : 'password'}
                value={apiSettings.claudeApiKey}
                onChange={(e) => setApiSettings({...apiSettings, claudeApiKey: e.target.value})}
                placeholder="sk-ant-api03-..."
              />
              <button type="button" onClick={() => toggleSecret('claudeApiKey')}>
                {showSecrets['claudeApiKey'] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <span className="input-hint">Get your API key from console.anthropic.com</span>
          </div>
          <div className="form-group">
            <label>Claude Model</label>
            <select 
              value={apiSettings.claudeModel}
              onChange={(e) => setApiSettings({...apiSettings, claudeModel: e.target.value})}
            >
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
              <option value="claude-3-sonnet-20240229">Claude 3 Sonnet</option>
              <option value="claude-3-haiku-20240307">Claude 3 Haiku</option>
            </select>
          </div>
          <div className="form-group">
            <label>Test Connection</label>
            <button type="button" className="btn btn-outline">
              <RefreshCw size={16} /> Test API
            </button>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>Firebase Configuration</h3>
        <p>Configure Firebase for push notifications and analytics</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Firebase API Key</label>
            <div className="input-with-action">
              <input 
                type={showSecrets['firebaseApiKey'] ? 'text' : 'password'}
                value={apiSettings.firebaseApiKey}
                onChange={(e) => setApiSettings({...apiSettings, firebaseApiKey: e.target.value})}
              />
              <button type="button" onClick={() => toggleSecret('firebaseApiKey')}>
                {showSecrets['firebaseApiKey'] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Firebase Project ID</label>
            <input 
              type="text" 
              value={apiSettings.firebaseProjectId}
              onChange={(e) => setApiSettings({...apiSettings, firebaseProjectId: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>SMS Configuration</h3>
        <p>Configure SMS provider for OTP and notifications</p>
        <div className="form-grid">
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
            <div className="input-with-action">
              <input 
                type={showSecrets['smsApiKey'] ? 'text' : 'password'}
                value={apiSettings.smsApiKey}
                onChange={(e) => setApiSettings({...apiSettings, smsApiKey: e.target.value})}
              />
              <button type="button" onClick={() => toggleSecret('smsApiKey')}>
                {showSecrets['smsApiKey'] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppConfig = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>App Version Management</h3>
        <p>Manage mobile app versions and updates</p>
        <div className="form-grid">
          <div className="form-group">
            <label>Current App Version</label>
            <input 
              type="text" 
              value={appConfig.appVersion}
              onChange={(e) => setAppConfig({...appConfig, appVersion: e.target.value})}
            />
          </div>
          <div className="form-group">
            <label>Minimum Required Version</label>
            <input 
              type="text" 
              value={appConfig.minAppVersion}
              onChange={(e) => setAppConfig({...appConfig, minAppVersion: e.target.value})}
            />
          </div>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Force Update</h4>
            <p>Force users to update to the minimum version</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={appConfig.forceUpdate}
              onChange={(e) => setAppConfig({...appConfig, forceUpdate: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      <div className="settings-section">
        <h3>Store URLs</h3>
        <div className="form-grid">
          <div className="form-group full-width">
            <label>Play Store URL</label>
            <input 
              type="url" 
              value={appConfig.playStoreUrl}
              onChange={(e) => setAppConfig({...appConfig, playStoreUrl: e.target.value})}
            />
          </div>
          <div className="form-group full-width">
            <label>App Store URL</label>
            <input 
              type="url" 
              value={appConfig.appStoreUrl}
              onChange={(e) => setAppConfig({...appConfig, appStoreUrl: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>App Limits</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>Max Login Devices</label>
            <input 
              type="number" 
              value={appConfig.maxLoginDevices}
              onChange={(e) => setAppConfig({...appConfig, maxLoginDevices: parseInt(e.target.value) || 1})}
            />
          </div>
          <div className="form-group">
            <label>Session Timeout (days)</label>
            <input 
              type="number" 
              value={appConfig.sessionTimeout}
              onChange={(e) => setAppConfig({...appConfig, sessionTimeout: parseInt(e.target.value) || 30})}
            />
          </div>
          <div className="form-group">
            <label>Free Trial Days</label>
            <input 
              type="number" 
              value={appConfig.freeTrialDays}
              onChange={(e) => setAppConfig({...appConfig, freeTrialDays: parseInt(e.target.value) || 7})}
            />
          </div>
          <div className="form-group">
            <label>Max Questions/Day (Free)</label>
            <input 
              type="number" 
              value={appConfig.maxQuestionsPerDay}
              onChange={(e) => setAppConfig({...appConfig, maxQuestionsPerDay: parseInt(e.target.value) || 50})}
            />
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>App Features</h3>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Offline Mode</h4>
            <p>Allow users to access downloaded content offline</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={appConfig.enableOfflineMode}
              onChange={(e) => setAppConfig({...appConfig, enableOfflineMode: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Push Notifications</h4>
            <p>Enable push notifications in the app</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={appConfig.enablePushNotifications}
              onChange={(e) => setAppConfig({...appConfig, enablePushNotifications: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Analytics</h4>
            <p>Collect usage analytics for improvements</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={appConfig.enableAnalytics}
              onChange={(e) => setAppConfig({...appConfig, enableAnalytics: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Crash Reporting</h4>
            <p>Send crash reports for debugging</p>
          </div>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={appConfig.enableCrashReporting}
              onChange={(e) => setAppConfig({...appConfig, enableCrashReporting: e.target.checked})}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>Notification Channels</h3>
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
            <p>Send push notifications to mobile apps</p>
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
      </div>

      <div className="settings-section">
        <h3>Admin Notifications</h3>
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
            <p>Notify when a payment is received</p>
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
            <p>Notify when subscriptions are about to expire</p>
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
      </div>

      <div className="settings-section">
        <h3>Report Emails</h3>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Daily Report</h4>
            <p>Send daily summary report</p>
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
            <p>Send weekly summary report</p>
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
          <label>Report Email Recipients</label>
          <input 
            type="text" 
            value={notificationSettings.reportEmailRecipients}
            onChange={(e) => setNotificationSettings({...notificationSettings, reportEmailRecipients: e.target.value})}
            placeholder="email1@example.com, email2@example.com"
          />
          <span className="input-hint">Comma-separated email addresses</span>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentPath) {
      case '/admin/settings/payment':
        return renderPaymentSettings();
      case '/admin/settings/api-keys':
        return renderApiSettings();
      case '/admin/settings/app-config':
        return renderAppConfig();
      case '/admin/settings/notifications':
        return renderNotificationSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>Configure your platform settings</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <RefreshCw size={18} className="spinner" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="settings-grid">
        <nav className="settings-nav">
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || 
              (item.path === '/admin/settings' && currentPath === '/admin/settings');
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`settings-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {renderContent()}
      </div>
    </div>
  );
}

export default AdminSettings;
