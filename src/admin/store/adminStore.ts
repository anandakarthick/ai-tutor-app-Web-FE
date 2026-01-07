/**
 * Admin Store - State Management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ADMIN_STORAGE_KEYS } from '../../services/api/admin';

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
  _hasHydrated: boolean;
  
  // Actions
  login: (admin: Admin, token: string) => void;
  logout: () => void;
  updateAdmin: (data: Partial<Admin>) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  checkAuth: () => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      _hasHydrated: false,

      login: (admin, token) => {
        set({
          admin,
          token,
          isAuthenticated: true,
        });
      },

      logout: () => {
        // Clear localStorage
        localStorage.removeItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(ADMIN_STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(ADMIN_STORAGE_KEYS.ADMIN);
        
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

      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },

      // Check authentication from localStorage as fallback
      checkAuth: () => {
        const token = localStorage.getItem(ADMIN_STORAGE_KEYS.ACCESS_TOKEN);
        const adminStr = localStorage.getItem(ADMIN_STORAGE_KEYS.ADMIN);
        
        if (token && adminStr) {
          try {
            const adminData = JSON.parse(adminStr);
            const admin = {
              id: adminData.id,
              name: adminData.fullName || adminData.name,
              email: adminData.email,
              role: adminData.role,
              permissions: adminData.permissions || [],
              avatar: adminData.profileImageUrl,
            };
            
            // Update store if not already authenticated
            const state = get();
            if (!state.isAuthenticated) {
              set({
                admin,
                token,
                isAuthenticated: true,
              });
            }
            return true;
          } catch (e) {
            console.error('Error parsing admin data:', e);
            return false;
          }
        }
        return false;
      },
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
          // Also check localStorage for tokens
          state.checkAuth();
        }
      },
    }
  )
);

export default useAdminStore;
