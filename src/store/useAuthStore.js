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
