/**
 * Subscription API Service
 */

import apiClient from './client';

export const subscriptionApi = {
  // Get all available plans
  getPlans: async () => {
    const response = await apiClient.get('/subscriptions/plans');
    return response.data;
  },

  // Get user's subscriptions
  getAll: async () => {
    const response = await apiClient.get('/subscriptions');
    return response.data;
  },

  // Get active subscription
  getActive: async () => {
    const response = await apiClient.get('/subscriptions/active');
    return response.data;
  },

  // Create subscription after payment
  create: async (data: { planId: string; paymentId: string; couponCode?: string }) => {
    const response = await apiClient.post('/subscriptions', data);
    return response.data;
  },

  // Validate coupon
  validateCoupon: async (couponCode: string, planId: string) => {
    const response = await apiClient.post('/subscriptions/validate-coupon', { couponCode, planId });
    return response.data;
  },
};

export default subscriptionApi;
