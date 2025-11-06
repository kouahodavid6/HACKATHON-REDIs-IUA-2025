import axiosInstance from "../api/axiosInstance";

const ListerEtudiant = async () => {
    try {
        const response = await axiosInstance.get("/api/ListeEtudiants");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement des étudiants");
    }
}

const SupprimerEtudiant = async (id) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteEtudiant/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de l'étudiant");
    }
}

export const etudiantService = {
    ListerEtudiant,
    SupprimerEtudiant,
}