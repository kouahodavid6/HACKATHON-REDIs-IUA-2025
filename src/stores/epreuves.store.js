import { create } from "zustand";
import { epreuveService } from "../services/epreuves.service";

const useEpreuveStore = create((set, get) => ({
    epreuves: [],
    loading: false,
    error: null,
    success: false,
    currentEpreuve: null,

    // Actions
    ajouterEpreuve: async (formData) => {
        set({ loading: true, error: null, success: false });
        
        try {
            const response = await epreuveService.AjouterEpreuve(formData);
            
            // CORRECTION: La réponse de l'API contient directement les données
            const nouvelleEpreuve = response.data || response;
            
            set(state => ({ 
                epreuves: [...state.epreuves, nouvelleEpreuve],
                loading: false, 
                success: true
            }));
            
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;
            set({ 
                error: errorMessage, 
                loading: false, 
                success: false 
            });
            throw error;
        }
    },

    listerEpreuves: async () => {
        set({ loading: true, error: null });
        
        try {
            const response = await epreuveService.ListerEpreuves();
            
            // CORRECTION: La réponse de l'API contient directement le tableau
            const epreuvesData = response.data || response || [];
            
            set({ 
                epreuves: epreuvesData,
                loading: false 
            });
            
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;
            set({ 
                error: errorMessage, 
                loading: false 
            });
            throw error;
        }
    },

    supprimerEpreuve: async (id) => {
        set({ loading: true, error: null });
        
        try {
            await epreuveService.SupprimerEpreuve(id);
            
            set(state => ({
                epreuves: state.epreuves.filter(epreuve => epreuve.id !== id),
                loading: false,
                success: true
            }));
            
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;
            set({ 
                error: errorMessage, 
                loading: false 
            });
            throw error;
        }
    },

    // CORRECTION: Ajout de la fonction modifierEpreuve manquante
    modifierEpreuve: async (id, formData) => {
        set({ loading: true, error: null, success: false });
        
        try {
            // NOTE: Vous devrez créer cette fonction dans epreuveService
            const response = await epreuveService.ModifierEpreuve(id, formData);
            
            const epreuveModifiee = response.data || response;
            
            set(state => ({
                epreuves: state.epreuves.map(epreuve => 
                    epreuve.id === id ? { ...epreuve, ...epreuveModifiee } : epreuve
                ),
                loading: false,
                success: true
            }));
            
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;
            set({ 
                error: errorMessage, 
                loading: false, 
                success: false 
            });
            throw error;
        }
    },

    // Gestion de l'épreuve sélectionnée
    setCurrentEpreuve: (epreuve) => set({ currentEpreuve: epreuve }),
    
    // Rechercher une épreuve par ID
    getEpreuveById: (id) => {
        const { epreuves } = get();
        return epreuves.find(epreuve => epreuve.id === id) || null;
    },

    // Compter le nombre total d'épreuves
    getNombreEpreuves: () => {
        const { epreuves } = get();
        return epreuves.length;
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

export default useEpreuveStore;