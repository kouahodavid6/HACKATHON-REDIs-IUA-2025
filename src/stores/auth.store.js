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

    // Inscription - AMÉLIORÉE
    registerAdmin: async (data) => {
        set({ loading: true, error: null, showError: false });
        try {
            const response = await authAdminService.registerAdmin(data);
            
            // ✅ Vérifier que la réponse contient bien les données attendues
            if (!response.token) {
                throw new Error("Token manquant dans la réponse du serveur");
            }
            
            const userData = { id: response.id, email: response.email };
            const token = response.token;
            
            localStorage.setItem("admin_user", JSON.stringify(userData));
            localStorage.setItem("admin_token", token);
            set({ user: userData, token, loading: false, error: null });
            return response;
        } catch (error) {
            // ✅ Meilleure gestion des erreurs
            let errorMessage = "Une erreur est survenue lors de l'inscription";
            
            if (error.response?.status === 409 || error.response?.status === 400) {
                // Compte déjà existant ou données invalides
                errorMessage = error.response?.data?.message || "Un compte avec cet email existe déjà. Veuillez vous connecter.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            set({ error: errorMessage, showError: true, loading: false });
            throw new Error(errorMessage);
        }
    },

    // Connexion - AMÉLIORÉE
    loginAdmin: async (credentials) => {
        set({ loading: true, error: null, showError: false });
        try {
            const response = await authAdminService.loginAdmin(credentials);
            
            // ✅ Vérifier que la réponse contient bien les données attendues
            if (!response.token) {
                throw new Error("Token manquant dans la réponse du serveur");
            }
            
            const userData = { id: response.id, email: response.email };
            const token = response.token;
            
            localStorage.setItem("admin_user", JSON.stringify(userData));
            localStorage.setItem("admin_token", token);
            set({ user: userData, token, loading: false, error: null });
            return response;
        } catch (error) {
            let errorMessage = "Erreur de connexion";
            
            if (error.response?.status === 401) {
                errorMessage = "Email ou mot de passe incorrect";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            set({ error: errorMessage, showError: true, loading: false });
            throw new Error(errorMessage);
        }
    },

    // Déconnexion - AMÉLIORÉE
    logout: () => {
        localStorage.removeItem("admin_user");
        localStorage.removeItem("admin_token");
        set({ user: null, token: null, error: null, showError: false });
        
        // ✅ Redirection après déconnexion
        window.location.href = "/login";
    },
}));

export default useAuthAdminStore;