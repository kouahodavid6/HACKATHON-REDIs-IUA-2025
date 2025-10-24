import { create } from "zustand";
import { annoncesService } from "../services/annonces.service";

const useAnnoncesStore = create((set) => ({
    annonces: [],
    loading: false,
    error: null,
    currentAnnonce: null,

    creerAnnonce: async (data) => {
        set({ loading: true, error: null });

        try {
            const response = await annoncesService.creerAnnonce(data);
            const newAnnonce = response.data;

            set(state => ({
                annonces: [...state.annonces, newAnnonce],
                loading: false
            }));

            return newAnnonce;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    listerAnnonces: async () => {
        set({ loading: true, error: null });

        try {
            const response = await annoncesService.listerAnnonces();
            const listAnnonces = response.data;

            set({ 
                annonces: listAnnonces || [],
                loading: false
            });

            return listAnnonces;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    modifierAnnonce: async (idAnnonce, data) => {
        set({ loading: true, error: null });

        try {
            const response = await annoncesService.modifierAnnonce(idAnnonce, data);
            const updateAnnonce = response.data;

            set(state => ({ 
                annonces: state.annonces.map(annonce =>
                    annonce.id === idAnnonce ? { ...annonce, ...updateAnnonce } : annonce
                ),
                loading: false
            }));

            return updateAnnonce;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    supprimerAnnonce: async (idAnnonce) => {
        set({ loading: true, error: null });

        try {
            await annoncesService.supprimerAnnonce(idAnnonce);

            set(state => ({
                annonces: state.annonces.filter(annonce => annonce.id !== idAnnonce),
                loading: false
            }));

            return true;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    // Sélectionner une annonce
    setCurrentAnnonce: (annonce) => {
        set({ currentAnnonce: annonce });
    },

    // Réinitialiser l'annonce courante
    clearCurrentAnnonce: () => {
        set({ currentAnnonce: null });
    },

    // Réinitialiser les erreurs
    clearError: () => {
        set({ error: null });
    },

    // Réinitialiser le store
    reset: () => {
        set({ 
            annonces: [],
            currentAnnonce: null,
            error: null,
            loading: false
        });
    }
}));

export default useAnnoncesStore;