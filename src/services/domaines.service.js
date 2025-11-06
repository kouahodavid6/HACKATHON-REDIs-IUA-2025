import axiosInstance from "../api/axiosInstance";

const AjoutDomaine = async (data) => {
    try {
        const response = await axiosInstance.post("/api/StoreDommaines", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la création du domaine");
    }
}

const ListerDomaines = async () => {
    try {
        const response = await axiosInstance.get("/api/ListDomaines");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement des domaines");
    }
}

const ModifierDomaine = async (id, data) => {
    try {        
        const response = await axiosInstance.post(`/api/UpdateDomaine/${id}`, data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la modification du domaine")
    }
}

const SupprimerDomaine = async (id) => {
    try {        
        const response = await axiosInstance.post(`/api/DeleteDomaines/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de la suppression du domaine")
    }
}

const NombreDomaines = async () => {
    try {        
        const response = await axiosInstance.get("/api/NombreDomaines");
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors du chargement du nombre de domaine")
    }
}

export const domaineService = {
    AjoutDomaine,  
    ListerDomaines,
    ModifierDomaine,
    SupprimerDomaine,
    NombreDomaines,
}