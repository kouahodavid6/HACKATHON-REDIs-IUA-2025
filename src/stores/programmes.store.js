import { create } from "zustand";
import { programmesService } from "../services/programmes.service";

const useProgrammesStore = create((set) => ({
    programmes: [],
    loading: false,
    error: null,
    currentProgramme: null,

    creerProgramme: async (data) => {
        set({ loading: true, error: null });

        try {
            const response = await programmesService.creerProgramme(data);
            const newProgramme = response.data;

            set(state => ({
                programmes: [...state.programmes, newProgramme],
                loading: false
            }));

            return newProgramme;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    listerProgrammes: async () => {
        set({ loading: true, error: null });

        try {
            const response = await programmesService.listerProgrammes();
            const listProgramme = response.data;

            set({
                programmes: listProgramme || [],
                loading: false
            });

            return listProgramme;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    modifierProgramme: async (idProgramme, data) => {
        set({ loading: true, error: null });

        try {
            const response = await programmesService.modifierProgramme(idProgramme, data);
            const updateProgramme = response.data;

            set(state => ({
                programmes: state.programmes.map(programme => 
                    programme.id === idProgramme ? { ...programme, ...updateProgramme } : programme
                ),
                loading: false
            }));

            return updateProgramme;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    supprimerProgramme: async (idProgramme) => {
        set({ loading: true, error: null });

        try {
            await programmesService.supprimerProgramme(idProgramme);

            set(state => ({
                programmes: state.programmes.filter(programme => programme.id !== idProgramme),
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

    // Sélectionner un programme
    setCurrentProgramme: (programme) => {
        set({ currentProgramme: programme });
    },

    // Réinitialiser le programme courant
    clearCurrentProgramme: () => {
        set({ currentProgramme: null });
    },

    // Réinitialiser les erreurs
    clearError: () => {
        set({ error: null });
    },

    // Réinitialiser le store
    reset: () => {
        set({ 
            programmes: [],
            currentProgramme: null,
            error: null,
            loading: false
        });
    }
}));

export default useProgrammesStore;