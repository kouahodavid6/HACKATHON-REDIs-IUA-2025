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

const SupprimerEpreuve = async (id) => {
    const response = await axiosInstance.post(`/api/DeleteEpreuve/${id}`);
    return response.data;
}

export const epreuveService = {
    AjouterEpreuve,
    ListerEpreuves,
    SupprimerEpreuve
}