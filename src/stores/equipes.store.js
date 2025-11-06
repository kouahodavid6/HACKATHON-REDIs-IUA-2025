import { create } from "zustand";
import { EquipeService } from "../services/equipes.service";

const useEquipeStore = create((set, get) => ({
    equipes: [],
    loading: false,
    error: null,
    success: false,
    currentEquipe: null,

    // Actions
    listerEquipes: async () => {
        set({ loading: true, error: null });

        try {
            const response = await EquipeService.ListerEquipe();

            set({ 
                equipes: response.data?.Liste_equipe || [],
                loading: false 
            });

            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;

            set({ 
                error: errorMessage, 
                loading: false 
            });

            throw error;
        }
    },

    supprimerEquipe: async (id) => {
        set({ loading: true, error: null });
        
        try {
            await EquipeService.SupprimerEquipe(id);

            set(state => ({
                equipes: state.equipes.filter(equipe => equipe.id !== id),
                loading: false,
                success: true
            }));

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;

            set({ 
                error: errorMessage, 
                loading: false 
            });

            throw error;
        }
    },

    // Gestion de l'équipe sélectionnée
    setCurrentEquipe: (equipe) => set({ currentEquipe: equipe }),
    
    // Rechercher une équipe par ID
    getEquipeById: (id) => {
        const { equipes } = get();
        return equipes.find(equipe => equipe.id === id) || null;
    },

    // Compter le nombre total d'équipes
    getNombreEquipes: () => {
        const { equipes } = get();
        return equipes.length;
    },

    // Réinitialiser les états
    resetState: () => set({ 
        loading: false, 
        error: null, 
        success: false 
    }),

    // Effacer les erreurs
    clearError: () => set({ error: null }),

    // Effacer le succès
    clearSuccess: () => set({ success: false }),
}));

export default useEquipeStore;