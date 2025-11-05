import axiosInstance from "../api/axiosInstance";

const AjouterEpreuve = async (formData) => {
    const response = await axiosInstance.post("/api/StoreEpreuve", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    return response.data;
}

const ListerEpreuves = async () => {
    const response = await axiosInstance.get("/api/ListEpreuve/Admin");
    return response.data;
}

const ModifierEpreuve = async (id, formData) => {
    const response = await axiosInstance.post(`/api/UpdateEpreuve/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    return response.data;
}

const SupprimerEpreuve = async (id) => {
    const response = await axiosInstance.post(`/api/DeleteEpreuve/${id}`);
    return response.data;
}

const ClassementEpreuve = async (idEpreuve) => {
    const response = await axiosInstance.get(`/api/ClassementEpreuve/${idEpreuve}`);

    if (response.data && response.data.succes === true) {
        return response.data;
    } else {
        throw new Error("Structure de réponse invalide");
    }
}

export const epreuveService = {
    AjouterEpreuve,
    ListerEpreuves,
    ModifierEpreuve,
    SupprimerEpreuve,
    ClassementEpreuve
}