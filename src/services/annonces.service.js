import axiosInstance from "../api/axiosInstance";

const creerAnnonce = async (data) => {
    try {
        const response = await axiosInstance.post('/api/StoreAnnonces', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'annonce');
    }
}

const listerAnnonces = async () => {
    try {
        const response = await axiosInstance.get('/api/ListAnnoncesAdmin');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des annonces');
    }
}

const modifierAnnonce = async (idAnnonce, data) => {
    try {
        const response = await axiosInstance.post(`/api/UpdateAnnonce/${idAnnonce}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification de l\'annonce');
    }
}

const supprimerAnnonce = async (idAnnonce) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteAnnonce/${idAnnonce}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de l\'annonce');
    }
}

export const annoncesService = {
    creerAnnonce,
    listerAnnonces,
    modifierAnnonce,
    supprimerAnnonce
}