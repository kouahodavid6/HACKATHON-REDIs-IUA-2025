import axiosInstance from "../api/axiosInstance";

const ListerEquipe = async () => {
    const response = await axiosInstance.get("/api/ListEquipes");
    return response.data;
}

const SupprimerEquipe = async (id) => {
    const response = await axiosInstance.post(`/api/DeleteEquipe/${id}`);
    return response.data;
}

export const EquipeService = {
    ListerEquipe,
    SupprimerEquipe
}