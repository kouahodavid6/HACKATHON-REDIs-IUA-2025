import axiosInstance from "../api/axiosInstance";

const AjouterEpreuve = async (formData) => {
    try {
        const response = await axiosInstance.post("/api/StoreEpreuve", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'ajout de l'épreuve");
    }
}

const ListerEpreuves = async () => {
    try {
        const response = await axiosInstance.get("/api/ListEpreuve/Admin");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement des épreuves");
    }
}

const ModifierEpreuve = async (id, formData) => {
    try {
        const response = await axiosInstance.post(`/api/UpdateEpreuve/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification de l'épreuve");
    }
}

const SupprimerEpreuve = async (id) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteEpreuve/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression de l'épreuve");
    }
}

const ClassementEpreuve = async (idEpreuve) => {
    try {
        const response = await axiosInstance.get(`/api/ClassementEpreuve/${idEpreuve}`);

        if (response.data && response.data.succes === true) {
            return response.data;
        } else {
            throw new Error("Structure de réponse invalide");
        }
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement du classement de l'épreuve");
    }
}

export const epreuveService = {
    AjouterEpreuve,
    ListerEpreuves,
    ModifierEpreuve,
    SupprimerEpreuve,
    ClassementEpreuve
}