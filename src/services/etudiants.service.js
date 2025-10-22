import axiosInstance from "../api/axiosInstance";

const ListerEtudiant = async () => {
    const response = await axiosInstance.get("/api/ListeEtudiants");
    return response.data;
}

const SupprimerEtudiant = async (id) => {
    const response = await axiosInstance.post(`/api/DeleteEtudiant/${id}`);
    return response.data;
}

export const etudiantService = {
    ListerEtudiant,
    SupprimerEtudiant,
}