import { create } from "zustand";
import { questionsService } from "../services/questions.service";

const useQuestionsStore = create((set) => ({
    questions: [],
    loading: false,
    error: null,
    currentQuestion: null,

    creerQuestion: async (idEpreuve, questionData) => {
        set({ loading: true, error: null });

        try {
            const response = await questionsService.creerQuestion(idEpreuve, questionData);
            
            if (response.succes) {
                const newQuestion = response.data;

                set(state => ({
                    questions: [...state.questions, newQuestion],
                    loading: false
                }));

                return newQuestion;
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

    listerQuestions: async (idEpreuve) => {
        set({ loading: true, error: null });

        try {
            const response = await questionsService.listerQuestions(idEpreuve);
            
            if (response.succes) {
                const listQuestions = response.data || [];

                set({ 
                    questions: listQuestions,
                    loading: false
                });

                return listQuestions;
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

    modifierQuestion: async (idEpreuve, idQuestion, questionData) => {
        set({ loading: true, error: null });

        try {
            const response = await questionsService.modifierQuestion(idEpreuve, idQuestion, questionData);
            
            if (response.succes) {
                const updateQuestion = response.data;

                set(state => ({ 
                    questions: state.questions.map(question =>
                        question.id === idQuestion ? updateQuestion : question
                    ),
                    loading: false
                }));

                return updateQuestion;
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

    supprimerQuestion: async (idQuestion) => {
        set({ loading: true, error: null });

        try {
            const response = await questionsService.supprimerQuestion(idQuestion);

            if (response.succes !== false) {
                // Mise à jour optimiste de l'état local
                set(state => ({
                    questions: state.questions.filter(q => q.id !== idQuestion),
                    loading: false
                }));
                
                return true;
            } else {
                throw new Error(response.message || 'Suppression échouée côté serveur');
            }
            
        } catch (error) {
            set({ 
                error: error.message,
                loading: false
            });
            
            throw error;
        }
    },

    // Sélectionner une question
    setCurrentQuestion: (question) => {
        set({ currentQuestion: question });
    },

    // Réinitialiser la question courante
    clearCurrentQuestion: () => {
        set({ currentQuestion: null });
    },

    // Réinitialiser les erreurs
    clearError: () => {
        set({ error: null });
    },

    // Réinitialiser le store
    reset: () => {
        set({ 
            questions: [],
            currentQuestion: null,
            error: null,
            loading: false
        });
    }
}));

export default useQuestionsStore;