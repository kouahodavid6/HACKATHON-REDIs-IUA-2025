import { create } from "zustand";
import { etudiantService } from "../services/etudiants.service";

const useEtudiantStore = create((set, get) => ({
    // État initial
    etudiants: [],
    loading: false,
    error: null,
    success: false,
    currentEtudiant: null,
    
    // Actions
    listerEtudiants: async () => {
        set({ loading: true, error: null });
        
        try {
            const response = await etudiantService.ListerEtudiant();

            set({ 
                etudiants: response.data || [],
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

    supprimerEtudiant: async (id) => {
        set({ loading: true, error: null });
        
        try {
            await etudiantService.SupprimerEtudiant(id);

            set(state => ({
                etudiants: state.etudiants.filter(etudiant => etudiant.id !== id),
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

    // Gestion de l'étudiant sélectionné
    setCurrentEtudiant: (etudiant) => set({ currentEtudiant: etudiant }),
    
    // Rechercher un étudiant par ID
    getEtudiantById: (id) => {
        const { etudiants } = get();
        return etudiants.find(etudiant => etudiant.id === id) || null;
    },

    // Filtrer les étudiants par rôle
    getEtudiantsByRole: (role) => {
        const { etudiants } = get();
        return etudiants.filter(etudiant => etudiant.role === role);
    },

    // Compter les étudiants par rôle
    getNombreEtudiantsByRole: (role) => {
        const { etudiants } = get();
        return etudiants.filter(etudiant => etudiant.role === role).length;
    },

    // Statistiques
    getStatistiques: () => {
        const { etudiants } = get();
        const total = etudiants.length;
        const createurs = etudiants.filter(e => e.role === 'createur').length;
        const membres = etudiants.filter(e => e.role === 'membre').length;

        return {
            total,
            createurs,
            membres,
            pourcentageCreateurs: total > 0 ? Math.round((createurs / total) * 100) : 0,
            pourcentageMembres: total > 0 ? Math.round((membres / total) * 100) : 0
        };
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

export default useEtudiantStore;