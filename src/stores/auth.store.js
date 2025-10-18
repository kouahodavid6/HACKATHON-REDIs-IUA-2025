import { create } from "zustand";
import { authAdminService } from "../services/auth.service";

// Fonctions utilitaires pour le localStorage
const getStoredUser = () => {
    try {
        return localStorage.getItem("admin_user") 
            ? JSON.parse(localStorage.getItem("admin_user"))
            : null;
    } catch {
        return null;
    }
};

const getStoredToken = () => localStorage.getItem("admin_token") || null;

const useAuthAdminStore = create((set, get) => ({
    // État initial
    user: getStoredUser(),
    token: getStoredToken(),
    loading: false,
    error: null,
    showError: false,

    // Actions
    setError: (error) => set({ error, showError: true }),
    clearError: () => set({ error: null, showError: false }),

    setAuth: (userData, token) => {
        localStorage.setItem("admin_user", JSON.stringify(userData));
        localStorage.setItem("admin_token", token);
        set({ user: userData, token, error: null, showError: false });
    },

    isAuthenticated: () => {
        const token = localStorage.getItem("admin_token");
        return !!token;
    },

    initializeAuth: () => {
        const user = getStoredUser();
        const token = getStoredToken();
        if (user && token) {
            set({ user, token });
        }
    },

    registerAdmin: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await authAdminService.registerAdmin(data);
            const userData = { id: response.id, email: response.email };
            get().setAuth(userData, response.token);
            set({ loading: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, showError: true, loading: false });
            throw error;
        }
    },

    loginAdmin: async (credentials) => {
        set({ loading: true, error: null });
        try {
            const response = await authAdminService.loginAdmin(credentials);
            const userData = { id: response.id, email: response.email };
            get().setAuth(userData, response.token);
            set({ loading: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, showError: true, loading: false });
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
        set({ user: null, token: null, error: null, showError: false });
    },
}));

export default useAuthAdminStore;