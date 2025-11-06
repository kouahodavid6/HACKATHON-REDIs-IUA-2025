import { create } from "zustand";
import { TabsService } from "../services/tabs.service";

const useTabsStore = create((set) => ({
    tabs: [],
    loading: false,
    error: null,
    currentTab: null,

    creerTab: async (idEpreuve, titre) => {
        set({ loading: true, error: null });

        try {
            const response = await TabsService.creerTab(idEpreuve, titre);

            const newTab = response.data;

            set(state => ({
                tabs: [...state.tabs, newTab],
                loading: false
            }));

            return newTab;
        } catch (error) {
            set({ 
                error: error.message,
                loading: false,
            });

            throw error;
        }
    },

    listerTabs: async (idEpreuve) => {
        set({ loading: true, error: null });

        try {
            const response = await TabsService.listerTabs(idEpreuve);

            const listTabs = response.data;

            set({ 
                tabs: listTabs || [],
                loading: false
            });

            return listTabs;
        } catch (error) {
                        set({ 
                error: error.message,
                loading: false,
            });

            throw error;
        }
    },

    modifierTab: async (idTab, titre) => {
        set({ loading: true, error: null });

        try {
            const response = await TabsService.modifierTab(idTab, titre);

            const updateTab = response.data;

            set(state => ({ 
                tabs: state.tabs.map(tab =>
                    tab.id === idTab ? updateTab: tab
                ),
                loading: false
            }));

            return updateTab;
        } catch (error) {
            set({ 
                error: error.message,
                loading: false
            });

            throw error;
        }
    },

    supprimerTab: async (idTab) => {
        set({ loading: true, error: null });

        try {
            await TabsService.supprimerTab(idTab);

            set(state => ({
                tabs: state.tabs.filter(tab => tab.id !== idTab),
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

    // Sélectionner un tab (AJOUT DE CETTE FONCTION)
    setCurrentTab: (tab) => {
        set({ currentTab: tab });
    },

    // Réinitialiser le tab courant
    clearCurrentTab: () => {
        set({ currentTab: null });
    },

    // Réinitialiser les erreurs
    clearError: () => {
        set({ error: null });
    },

    // Réinitialiser le store
    reset: () => {
        set({ 
            tabs: [],
            currentTab: null,
            error: null,
            loading: false
        });
    }
}));

export default useTabsStore;