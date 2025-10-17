import { create } from "zustand";
import { authAdminService } from "../services/auth.service";

const initialUser = localStorage.getItem("admin_user")
    ? JSON.parse(localStorage.getItem("admin_user"))
    : null;

const initialToken = localStorage.getItem("admin_token") || null;

const useAuthAdminStore = create((set) => ({
    user: initialUser,
    token: initialToken,
    loading: false,
    error: null,
    showError: false,

    // Gestion erreurs
    setError: (error) => set({ error, showError: true }),
    clearError: () => set({ error: null, showError: false }),

  // Sauvegarde utilisateur + token
    setAuth: (userData, token) => {
        localStorage.setItem("admin_user", JSON.stringify(userData));
        localStorage.setItem("admin_token", token);
        set({ user: userData, token });
    },

    // Vérifie la présence du token
    isAuthenticated: () => !!localStorage.getItem("admin_token"),

  // Initialise les données depuis le localStorage
    initializeAuth: () => {
        const user = localStorage.getItem("admin_user");
        const token = localStorage.getItem("admin_token");
        if (user && token) {
            set({ user: JSON.parse(user), token });
        }
    },

    // Inscription
    registerAdmin: async (data) => {
        set({ loading: true });
        try {
            const response = await authAdminService.registerAdmin(data);
            const userData = { id: response.id, email: response.email };
            const token = response.token; // Assurez-vous que l'API retourne un token
            
            localStorage.setItem("admin_user", JSON.stringify(userData));
            localStorage.setItem("admin_token", token);
            set({ user: userData, token, loading: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, showError: true, loading: false });
            throw error;
        }
    },

    // Connexion
    loginAdmin: async (credentials) => {
        set({ loading: true });
        try {
            const response = await authAdminService.loginAdmin(credentials);
            const userData = { id: response.id, email: response.email };
            const token = response.token;
            localStorage.setItem("admin_user", JSON.stringify(userData));
            localStorage.setItem("admin_token", token);
            set({ user: userData, token, loading: false });
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, showError: true, loading: false });
            throw error;
        }
    },

    // Déconnexion
    logout: () => {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
        set({ user: null, token: null });
    },
}));

export default useAuthAdminStore;
