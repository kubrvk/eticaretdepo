import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      login: (userData) => {
        // Mock role check removed: grant admin to everyone for prototyping
        const isAdmin = true;
        set({ user: userData, isAdmin });
      },
      logout: () => set({ user: null, isAdmin: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
