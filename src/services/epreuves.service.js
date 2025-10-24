import axiosInstance from "../api/axiosInstance";

const AjouterEpreuve = async (formData) => {
    try {
        console.log("Envoi des données à l'API...");
        
        const response = await axiosInstance.post("/api/StoreEpreuve", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log("Réponse de l'API:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur complète dans service:", error);
        console.error("Données d'erreur:", error.response?.data);
        throw error;
    }
}

const ListerEpreuves = async () => {
    try {
        console.log("Chargement des épreuves...");
        const response = await axiosInstance.get("/api/ListEpreuve/Admin");
        console.log("Réponse des épreuves:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors du chargement des épreuves:", error);
        console.error("Détails de l'erreur:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
}

// CORRECTION: Ajout de la fonction manquante pour modifier une épreuve
const ModifierEpreuve = async (id, formData) => {
    try {
        console.log("Modification de l'épreuve ID:", id);
        
        const response = await axiosInstance.post(`/api/UpdateEpreuve/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        console.log("Réponse de modification:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la modification:", error);
        console.error("Détails de l'erreur:", error.response?.data);
        throw error;
    }
}

const SupprimerEpreuve = async (id) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteEpreuve/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        throw error;
    }
}

export const epreuveService = {
    AjouterEpreuve,
    ListerEpreuves,
    ModifierEpreuve, // CORRECTION: Ajout de cette fonction
    SupprimerEpreuve
}