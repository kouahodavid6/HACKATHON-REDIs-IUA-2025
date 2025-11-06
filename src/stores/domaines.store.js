import { create } from "zustand";
import { domaineService } from "../services/domaines.service";

const useDomaineStore = create((set) => ({
    domaines: [],
    loading: false,
    error: null,
    success: false,
    currentDomaine: null,
    nombreDomaines: 0,

    ajouterDomaine: async (titre) => {
        set({ loading: true, error: null, success: false });

        try {
            const data = { titre };

            const response = await domaineService.AjoutDomaine(data);

            const nouveauDomaine = response.data || response;

            set(state => ({ 
                domaines: [...state.domaines, nouveauDomaine],
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

    listerDomaines: async () => {
        set({ loading: true, error: null });

        try {
            const response = await domaineService.ListerDomaines();

            const domainesData = response.data || response || [];
            
            set({ 
                domaines: domainesData,
                loading: false 
            });

            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;

            set({ error: errorMessage, loading: false });

            throw error;
        }
    },

    modifierDomaine: async (id, titre) => {
        set({ loading: true, error: null, success: false });

        try {
            const response = await domaineService.ModifierDomaine(id, { titre });

            const domaineModifie = response.data || response;

            set(state => ({
                domaines: state.domaines.map(d => 
                    d.id === id ? { ...d, ...domaineModifie } : d
                ),
                loading: false,
                success: true
            }));

            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;

            set({ error: errorMessage, loading: false, success: false });

            throw error;
        }
    },

    supprimerDomaine: async (id) => {
        set({ loading: true, error: null });

        try {
            await domaineService.SupprimerDomaine(id);

            set(state => ({
                domaines: state.domaines.filter(d => d.id !== id),
                loading: false,
                success: true
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;

            set({ error: errorMessage, loading: false });

            throw error;
        }
    },

    getNombreDomaines: async () => {
        set({ loading: true, error: null });

        try {
            const response = await domaineService.NombreDomaines();

            const nombre = response.data?.NbrDomaines || response?.NbrDomaines || 0;

            set({ nombreDomaines: nombre, loading: false });

            return nombre;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.response?.message || error.message;

            set({ error: errorMessage, loading: false });

            throw error;
        }
    },

    setCurrentDomaine: (domaine) => set({ currentDomaine: domaine }),

    resetState: () => set({ loading: false, error: null, success: false }),

    clearError: () => set({ error: null }),

    clearSuccess: () => set({ success: false }),
}));

export default useDomaineStore;