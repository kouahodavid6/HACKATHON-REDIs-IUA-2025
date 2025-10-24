import axiosInstance from "../api/axiosInstance";

const creerSousProgramme = async (idProgramme, data) => {
    try {
        const response = await axiosInstance.post(`/api/StoreSousProgramme/${idProgramme}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création du sous-programme');
    }
}

const listerSousProgrammes = async () => {
    try {
        const response = await axiosInstance.get('/api/ListSousProgramme');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des sous-programmes');
    }
}

const modifierSousProgramme = async (idSousProgramme, data) => {
    try {
        const response = await axiosInstance.post(`/api/UpdateSousProgramme/${idSousProgramme}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification du sous-programme');
    }
}

const supprimerSousProgramme = async (idSousProgramme) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteSousProramme/${idSousProgramme}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du sous-programme');
    }
}

export const sousProgrammesService = {
    creerSousProgramme,
    listerSousProgrammes,
    modifierSousProgramme,
    supprimerSousProgramme
}