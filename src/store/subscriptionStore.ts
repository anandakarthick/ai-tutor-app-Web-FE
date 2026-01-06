/**
 * Subscription Store
 * Manages subscription status and access control
 */

import { create } from 'zustand';
import { subscriptionApi } from '../services/api';

interface SubscriptionState {
  hasActiveSubscription: boolean;
  subscription: any | null;
  isLoading: boolean;
  expiresAt: string | null;
  daysRemaining: number;
  
  // Actions
  checkSubscription: () => Promise<void>;
  clearSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  hasActiveSubscription: false,
  subscription: null,
  isLoading: true,
  expiresAt: null,
  daysRemaining: 0,

  checkSubscription: async () => {
    try {
      set({ isLoading: true });
      const response = await subscriptionApi.getActive();
      
      if (response.success && response.data) {
        const sub = response.data;
        const now = new Date();
        const expiry = new Date(sub.expiresAt);
        const isActive = sub.status === 'active' && expiry > now;
        
        let days = 0;
        if (isActive) {
          const diff = expiry.getTime() - now.getTime();
          days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        }
        
        set({
          subscription: sub,
          hasActiveSubscription: isActive,
          expiresAt: sub.expiresAt,
          daysRemaining: days,
        });
      } else {
        set({
          hasActiveSubscription: false,
          subscription: null,
          expiresAt: null,
          daysRemaining: 0,
        });
      }
    } catch (error: any) {
      // Don't show error for 401 - handled by auth
      if (error?.response?.status !== 401) {
        console.error('Failed to check subscription:', error);
      }
      set({
        hasActiveSubscription: false,
        subscription: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearSubscription: () => {
    set({
      hasActiveSubscription: false,
      subscription: null,
      expiresAt: null,
      daysRemaining: 0,
      isLoading: false,
    });
  },
}));
