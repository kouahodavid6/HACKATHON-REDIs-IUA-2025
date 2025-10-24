import { create } from "zustand";
import { sousProgrammesService } from "../services/sousProgrammes.service";

const useSousProgrammesStore = create((set) => ({
    sousProgrammes: [],
    loading: false,
    error: null,
    currentSousProgramme: null,

    creerSousProgramme: async (idProgramme, data) => {
        set({ loading: true, error: null });

        try {
            const response = await sousProgrammesService.creerSousProgramme(idProgramme, data);
            const newSousProgramme = response.data;

            set(state => ({
                sousProgrammes: [...state.sousProgrammes, newSousProgramme],
                loading: false
            }));

            return newSousProgramme;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    listerSousProgrammes: async () => {
        set({ loading: true, error: null });

        try {
            const response = await sousProgrammesService.listerSousProgrammes();
            const listSousProgrammes = response.data;

            set({ 
                sousProgrammes: listSousProgrammes || [],
                loading: false
            });

            return listSousProgrammes;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    modifierSousProgramme: async (idSousProgramme, data) => {
        set({ loading: true, error: null });

        try {
            const response = await sousProgrammesService.modifierSousProgramme(idSousProgramme, data);
            const updateSousProgramme = response.data;

            set(state => ({ 
                sousProgrammes: state.sousProgrammes.map(sousProgramme =>
                    sousProgramme.id === idSousProgramme ? { ...sousProgramme, ...updateSousProgramme } : sousProgramme
                ),
                loading: false
            }));

            return updateSousProgramme;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    supprimerSousProgramme: async (idSousProgramme) => {
        set({ loading: true, error: null });

        try {
            await sousProgrammesService.supprimerSousProgramme(idSousProgramme);

            set(state => ({
                sousProgrammes: state.sousProgrammes.filter(sousProgramme => sousProgramme.id !== idSousProgramme),
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

    // Filtrer les sous-programmes par programme
    getSousProgrammesByProgramme: (idProgramme) => {
        return useSousProgrammesStore.getState().sousProgrammes.filter(
            sp => sp.id_programme === idProgramme
        );
    },

    // Sélectionner un sous-programme
    setCurrentSousProgramme: (sousProgramme) => {
        set({ currentSousProgramme: sousProgramme });
    },

    // Réinitialiser le sous-programme courant
    clearCurrentSousProgramme: () => {
        set({ currentSousProgramme: null });
    },

    // Réinitialiser les erreurs
    clearError: () => {
        set({ error: null });
    },

    // Réinitialiser le store
    reset: () => {
        set({ 
            sousProgrammes: [],
            currentSousProgramme: null,
            error: null,
            loading: false
        });
    }
}));

export default useSousProgrammesStore;