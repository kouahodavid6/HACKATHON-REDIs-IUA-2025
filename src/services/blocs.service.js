import axiosInstance from "../api/axiosInstance";

const creerBloc = async (idTab, data) => {
    try {
        const response = await axiosInstance.post(`/api/StoreBlocs/${idTab}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création du bloc');
    }
}

const listerBlocs = async (idTab) => {
    try {
        const response = await axiosInstance.get(`/api/ListBlocs/${idTab}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des blocs');
    }
}

const modifierBloc = async (idBloc, data) => {
    try {
        const response = await axiosInstance.post(`/api/MajBlocs/${idBloc}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification du bloc');
    }
}

const supprimerBloc = async (idBloc) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteBlocs/${idBloc}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du bloc');
    }
}

export const blocsService = {
    creerBloc,
    listerBlocs,
    modifierBloc,
    supprimerBloc
}