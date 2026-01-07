/**
 * Site Settings Context
 * Provides site configuration (name, logo, etc.) throughout the app
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteSettings {
  siteName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsappNumber: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  siteName: 'AI Tutor',
  tagline: 'Your Personal AI-Powered Learning Companion',
  supportEmail: 'support@aitutor.com',
  supportPhone: '+91 98765 43210',
  whatsappNumber: '919876543210',
  address: 'Chennai, Tamil Nadu, India',
  facebookUrl: 'https://facebook.com/aitutor',
  twitterUrl: 'https://twitter.com/aitutor',
  instagramUrl: 'https://instagram.com/aitutor',
  linkedinUrl: 'https://linkedin.com/company/aitutor',
  youtubeUrl: 'https://youtube.com/@aitutor',
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  loading: true,
  refreshSettings: async () => {},
});

// Local storage key for caching settings
const SETTINGS_CACHE_KEY = 'site_settings_cache';
const SETTINGS_CACHE_TIME_KEY = 'site_settings_cache_time';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper to clear cached settings
export const clearSettingsCache = () => {
  try {
    localStorage.removeItem(SETTINGS_CACHE_KEY);
    localStorage.removeItem(SETTINGS_CACHE_TIME_KEY);
  } catch {
    // Ignore localStorage errors
  }
};

// Helper to get cached settings
const getCachedSettings = (): SiteSettings | null => {
  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    const cacheTime = localStorage.getItem(SETTINGS_CACHE_TIME_KEY);
    
    if (cached && cacheTime) {
      const isExpired = Date.now() - parseInt(cacheTime) > CACHE_DURATION;
      if (!isExpired) {
        return JSON.parse(cached);
      }
    }
    return null;
  } catch {
    return null;
  }
};

// Helper to cache settings
const cacheSettings = (settings: SiteSettings) => {
  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
    localStorage.setItem(SETTINGS_CACHE_TIME_KEY, Date.now().toString());
  } catch {
    // Ignore localStorage errors
  }
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    // Try to get cached settings first for instant display
    const cached = getCachedSettings();
    return cached || defaultSettings;
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      // Fetch from public API endpoint (no auth required)
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      const response = await fetch(`${API_URL}/settings/public`);
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const data = result.data;
          const newSettings: SiteSettings = {
            siteName: data.siteName || defaultSettings.siteName,
            tagline: data.tagline || defaultSettings.tagline,
            supportEmail: data.supportEmail || defaultSettings.supportEmail,
            supportPhone: data.supportPhone || defaultSettings.supportPhone,
            whatsappNumber: data.whatsappNumber || defaultSettings.whatsappNumber,
            address: data.address || defaultSettings.address,
            facebookUrl: data.facebookUrl || defaultSettings.facebookUrl,
            twitterUrl: data.twitterUrl || defaultSettings.twitterUrl,
            instagramUrl: data.instagramUrl || defaultSettings.instagramUrl,
            linkedinUrl: data.linkedinUrl || defaultSettings.linkedinUrl,
            youtubeUrl: data.youtubeUrl || defaultSettings.youtubeUrl,
          };
          
          setSettings(newSettings);
          cacheSettings(newSettings);
        }
      }
    } catch (error) {
      console.log('Using default/cached settings');
      // Keep using cached or default settings
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const refreshSettings = async () => {
    // Clear cache before refreshing
    clearSettingsCache();
    setLoading(true);
    await fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);

export default SettingsContext;
