import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      login: (userData) => {
        // Mock role check
        const isAdmin = userData.email === 'admin@eticaretdepo.com';
        set({ user: userData, isAdmin });
      },
      logout: () => set({ user: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
