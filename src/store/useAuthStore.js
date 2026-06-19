import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      role: "guest",
      isAdmin: false,
      login: (userData) => {
        const role = userData?.role || "customer";
        set({
          user: userData,
          role,
          isAdmin: role === "admin",
        });
      },
      updateUser: (patch) =>
        set((state) => {
          if (!state.user) return state;
          const nextUser = { ...state.user, ...patch };
          return {
            user: nextUser,
            role: nextUser.role || state.role,
            isAdmin: (nextUser.role || state.role) === "admin",
          };
        }),
      logout: () =>
        set({
          user: null,
          role: "guest",
          isAdmin: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
);
