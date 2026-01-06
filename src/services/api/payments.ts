/**
 * Payments API Service
 */

import apiClient from './client';

export const paymentsApi = {
  // Get all user payments/transactions
  getAll: async () => {
    const response = await apiClient.get('/payments');
    return response.data;
  },

  // Get payment by ID
  getById: async (id: string) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },

  // Create payment order
  createOrder: async (data: { amount: number; planId: string; description?: string }) => {
    const response = await apiClient.post('/payments/create-order', data);
    return response.data;
  },

  // Verify payment
  verify: async (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
    const response = await apiClient.post('/payments/verify', data);
    return response.data;
  },
};

export default paymentsApi;
