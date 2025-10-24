import { create } from "zustand";
import { blocsService } from "../services/blocs.service";

const useBlocsStore = create((set) => ({
    blocs: [],
    loading: false,
    error: null,
    currentBloc: null,

    creerBloc: async (idTab, data) => {
        set({ loading: true, error: null }); // CORRECTION: "loadimg" → "loading"

        try {
            const response = await blocsService.creerBloc(idTab, data);
            const newBloc = response.data;

            set(state => ({
                blocs: [...state.blocs, newBloc],
                loading: false
            }));

            return newBloc;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    listerBlocs: async (idTab) => {
        set({ loading: true, error: null });

        try {
            const response = await blocsService.listerBlocs(idTab);
            const listBlocs = response.data;

            set({ 
                blocs: listBlocs || [],
                loading: false
            });

            return listBlocs;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    modifierBloc: async (idBloc, data) => {
        set({ loading: true, error: null });

        try {
            const response = await blocsService.modifierBloc(idBloc, data);
            const updateBloc = response.data;

            set(state => ({ 
                blocs: state.blocs.map(bloc =>
                    bloc.id === idBloc ? updateBloc : bloc // CORRECTION: "updateBloc:" → "updateBloc :"
                ),
                loading: false
            }));

            return updateBloc;
        } catch (error) {
            set({ 
                error: error.message, 
                loading: false 
            });
            throw error;
        }
    },

    supprimerBloc: async (idBloc) => {
        set({ loading: true, error: null });

        try {
            await blocsService.supprimerBloc(idBloc);

            set(state => ({
                blocs: state.blocs.filter(bloc => bloc.id !== idBloc), // CORRECTION: "tblocs" → "blocs"
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

    // Sélectionner un bloc
    setCurrentBloc: (bloc) => {
        set({ currentBloc: bloc });
    },

    // Réinitialiser le bloc courant
    clearCurrentBloc: () => {
        set({ currentBloc: null });
    },

    // Réinitialiser les erreurs
    clearError: () => {
        set({ error: null });
    },

    // Réinitialiser le store
    reset: () => {
        set({ 
            blocs: [],
            currentBloc: null,
            error: null,
            loading: false
        });
    }
}));

export default useBlocsStore;