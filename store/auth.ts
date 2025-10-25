import { create } from "zustand";
import api from "@/lib/api";

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  role_display: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("access") : null,
  loading: false,
  error: null,

  login: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post("/token/", { username, password });
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);
      set({ token: res.data.access, loading: false });
      await useAuth.getState().fetchUser();
      return true;
    } catch (err: any) {
      set({
        error: err.response?.data?.detail || "Error de autenticación",
        loading: false,
      });
      return false;
    }
  },

  fetchUser: async () => {
    try {
      const res = await api.get("/users/me/");
      set({ user: res.data });
    } catch (err) {
      console.error("Error al obtener usuario:", err);
    }
  },

  refreshToken: async () => {
    try {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return;
      const res = await api.post("/token/refresh/", { refresh });
      localStorage.setItem("access", res.data.access);
      set({ token: res.data.access });
    } catch {
      useAuth.getState().logout();
    }
  },

  logout: () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    set({ user: null, token: null });
  },
}));
