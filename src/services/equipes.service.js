import axiosInstance from "../api/axiosInstance";

const ListerEquipe = async () => {
    try {        
        const response = await axiosInstance.get("/api/ListEquipes");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement des équipes")
    }
}

const SupprimerEquipe = async (id) => {
    try {        
        const response = await axiosInstance.post(`/api/DeleteEquipe/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de l'équipe")
    }
}

export const EquipeService = {
    ListerEquipe,
    SupprimerEquipe
}