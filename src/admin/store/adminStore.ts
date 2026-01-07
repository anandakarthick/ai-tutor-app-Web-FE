/**
 * Admin Store - State Management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  avatar?: string;
}

interface AdminState {
  admin: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (admin: Admin, token: string) => void;
  logout: () => void;
  updateAdmin: (data: Partial<Admin>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (admin, token) => {
        set({
          admin,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          admin: null,
          token: null,
          isAuthenticated: false,
        });
      },

      updateAdmin: (data) => {
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...data } : null,
        }));
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'admin-storage',
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAdminStore;
