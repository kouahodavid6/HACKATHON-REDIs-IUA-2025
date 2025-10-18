import axiosInstance from "../api/axiosInstance";

const AjoutDomaine = async (data) => {
    const response = await axiosInstance.post("/api/StoreDommaines", data);
    return response.data;
}

const ListerDomaines = async () => {
    const response = await axiosInstance.get("/api/ListDomaines");
    return response.data;
}

const ModifierDomaine = async (id, data) => {
    const response = await axiosInstance.post(`/api/UpdateDomaine/${id}`, data);
    return response.data;
}

const SupprimerDomaine = async (id) => {
    const response = await axiosInstance.post(`/api/DeleteDomaines/${id}`);
    return response.data;
}

const NombreDomaines = async () => {
    const response = await axiosInstance.get("/api/NombreDomaines");
    return response.data;
}

export const domaineService = {
    AjoutDomaine,  
    ListerDomaines,
    ModifierDomaine,
    SupprimerDomaine,
    NombreDomaines,
}