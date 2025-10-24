import axiosInstance from "../api/axiosInstance";

const creerProgramme = async (data) => {
    try {
        const response = await axiosInstance.post("/api/StoreProgramme", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création du programme');
    }
}

const listerProgrammes = async () => {
    try {
        const response = await axiosInstance.get("/api/ListProgrammeAdmin");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des programmes');
    }
}

const modifierProgramme = async (idProgramme, data) => {
    try {
        const response = await axiosInstance.post(`/api/UpdateProgramme/${idProgramme}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification du programme');
    }
}

const supprimerProgramme = async (idProgramme) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteProgramme/${idProgramme}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du programme');
    }
}

export const programmesService = {
    creerProgramme,
    listerProgrammes,
    modifierProgramme,
    supprimerProgramme
}