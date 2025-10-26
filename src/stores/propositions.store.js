import { create } from "zustand";
import { propositionsService } from "../services/propositions.service";

const usePropositionsStore = create((set, get) => ({
    propositions: [],
    loading: false,
    error: null,
    currentProposition: null,

    creerProposition: async (idQuestion, propositionData) => {
        set({ loading: true, error: null });

        try {
            const response = await propositionsService.creerProposition(idQuestion, propositionData);
            
            if (response.succes) {
                const newProposition = response.data;

                set(state => ({
                    propositions: [...state.propositions, newProposition],
                    loading: false
                }));

                return newProposition;
            } else {
                throw new Error(response.message || 'Erreur lors de la création');
            }
        } catch (error) {
            set({ 
                error: error.message,
                loading: false,
            });
            throw error;
        }
    },

    listerPropositions: async (idQuestion) => {
        set({ loading: true, error: null });

        try {
            const response = await propositionsService.listerPropositions(idQuestion);
            
            if (response.succes) {
                const listPropositions = response.data || [];

                set({ 
                    propositions: listPropositions,
                    loading: false
                });

                return listPropositions;
            } else {
                throw new Error(response.message || 'Erreur lors du chargement');
            }
        } catch (error) {
            set({ 
                error: error.message,
                loading: false,
            });
            throw error;
        }
    },

    modifierProposition: async (idProposition, propositionData) => {
        set({ loading: true, error: null });

        try {
            const response = await propositionsService.modifierProposition(idProposition, propositionData);
            
            if (response.succes) {
                const updatedProposition = response.data;

                set(state => ({ 
                    propositions: state.propositions.map(proposition =>
                        proposition.id === idProposition ? updatedProposition : proposition
                    ),
                    loading: false
                }));

                return updatedProposition;
            } else {
                throw new Error(response.message || 'Erreur lors de la modification');
            }
        } catch (error) {
            set({ 
                error: error.message,
                loading: false
            });
            throw error;
        }
    },

    supprimerProposition: async (idProposition) => {
        set({ loading: true, error: null });

        try {
            console.log('🗑️ Store: Suppression proposition ID:', idProposition);
            console.log('📋 Propositions avant suppression:', get().propositions.map(p => p.id));
            
            const response = await propositionsService.supprimerProposition(idProposition);
            
            console.log('✅ Store: Réponse suppression reçue', response);
            
            if (response.succes !== false) {
                // Mise à jour IMMÉDIATE de l'état local
                set(state => {
                    const newPropositions = state.propositions.filter(proposition => proposition.id !== idProposition);
                    console.log('🔄 Store: Propositions après suppression:', newPropositions.map(p => p.id));
                    return {
                        propositions: newPropositions,
                        loading: false
                    };
                });

                return true;
            } else {
                throw new Error(response.message || 'Suppression échouée côté serveur');
            }
        } catch (error) {
            console.error('❌ Store: Erreur lors de la suppression', error);
            set({ 
                error: error.message,
                loading: false
            });
            throw error;
        }
    },

    // Sélectionner une proposition
    setCurrentProposition: (proposition) => {
        set({ currentProposition: proposition });
    },

    // Réinitialiser la proposition courante
    clearCurrentProposition: () => {
        set({ currentProposition: null });
    },

    // Réinitialiser les erreurs
    clearError: () => {
        set({ error: null });
    },

    // Réinitialiser le store
    reset: () => {
        set({ 
            propositions: [],
            currentProposition: null,
            error: null,
            loading: false
        });
    }
}));

export default usePropositionsStore;