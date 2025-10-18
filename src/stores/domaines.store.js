import { create } from "zustand";
import { domaineService } from "../services/domaines.service";

const useDomaineStore = create((set) => ({
    domaines: [], // ✅ Corriger : "domaines" au lieu de "domaine"
    loading: false,
    error: null,
    success: false,
    currentDomaine: null, // ✅ Ajouter cette propriété manquante
    nombreDomaines: 0,

    ajouterDomaine: async (titre) => {
        set({ loading: true, error: null, success: false });
        
        try {
            const data = { titre };
            // ✅ Utiliser le bon nom (Majuscule)
            const response = await domaineService.AjoutDomaine(data);
            
            // Ajouter le nouveau domaine à la liste
            set(state => ({ 
                domaines: [...state.domaines, response],
                loading: false, 
                success: true
            }));
            
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ 
                error: errorMessage, 
                loading: false, 
                success: false 
            });
            throw error;
        }
    },

    // ✅ Corriger le nom de la fonction (Majuscule)
    listerDomaines: async () => {
        set({ loading: true, error: null });
        
        try {
            // ✅ Utiliser le bon nom (Majuscule)
            const response = await domaineService.ListerDomaines();
            set({ 
                domaines: response.domaines || response || [], // S'adapter à la réponse de l'API
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

    modifierDomaine: async (id, titre) => {
        set({ loading: true, error: null, success: false });
        try {
            // Vous devrez créer cette fonction dans domaineService
            const response = await domaineService.ModifierDomaine(id, { titre });
            set(state => ({
                domaines: state.domaines.map(d => 
                    d.id === id ? { ...d, ...response } : d
                ),
                loading: false,
                success: true
            }));
            return response;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, loading: false, success: false });
            throw error;
        }
    },

    // ✅ Ajouter les fonctions manquantes utilisées dans le composant
    supprimerDomaine: async (id) => {
        set({ loading: true, error: null });
        try {
            // Vous devrez créer cette fonction dans domaineService
            await domaineService.SupprimerDomaine(id);
            set(state => ({
                domaines: state.domaines.filter(d => d.id !== id),
                loading: false,
                success: true
            }));
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    getNombreDomaines: async () => {
        set({ loading: true, error: null });

        try {
            const response = await domaineService.NombreDomaines();
            const nombre = response.NbrDomaines || 0;
            set({ nombreDomaines: nombre, loading: false });
            return nombre;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            set({ error: errorMessage, loading: false });
            throw error;
        }
    },

    setCurrentDomaine: (domaine) => set({ currentDomaine: domaine }),

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

export default useDomaineStore;