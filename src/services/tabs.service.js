import axiosInstance from "../api/axiosInstance";

const creerTab = async (idEpreuve, titre) => {
    try {
        const response = await axiosInstance.post(`/api/StoreTab/${idEpreuve}`, {
            titre
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création du tab');
    }
}

const listerTabs = async (idEpreuve) => {
    try {
        const response = await axiosInstance.get(`/api/ListTabs/${idEpreuve}`);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des tabs');
    }
}

const modifierTab = async (idTab, titre) => {
    try {
        const response = await axiosInstance.post(`/api/MajTab/${idTab}`, {
            titre
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification de la tab');
    }
}

const supprimerTab = async (idTab) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteTabs/${idTab}`);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la tab');
    }
}

export const TabsService = {
    creerTab,
    listerTabs,
    modifierTab,
    supprimerTab
}