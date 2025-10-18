// 📁 src/stores/auth.store.js
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
    // ✅ Supprimé 'error' car non utilisé

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

    // Inscription - SIMPLIFIÉE
    registerAdmin: async (data) => {
        set({ loading: true });
        try {
            const response = await authAdminService.registerAdmin(data);
            
            const userData = { id: response.id, email: response.email };
            const token = response.token;
            
            localStorage.setItem("admin_user", JSON.stringify(userData));
            localStorage.setItem("admin_token", token);
            set({ user: userData, token, loading: false });
            return response;
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },

    // Connexion - SIMPLIFIÉE
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
            set({ loading: false });
            throw error;
        }
    },

    // Déconnexion - SIMPLIFIÉE
    logout: () => {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
        set({ user: null, token: null });
        
        // Redirection vers la page de connexion
        window.location.href = "/login";
    },
}));

export default useAuthAdminStore;