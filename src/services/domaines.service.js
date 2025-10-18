import axiosInstance from "../api/axiosInstance";

const AjoutDomaine = async (data) => {
    // ❌ SUPPRIMER la vérification du token ici car l'intercepteur le gère déjà
    const response = await axiosInstance.post("/api/StoreDommaines", data);
    return response.data;
}

const ListerDomaines = async () => {
    // ❌ SUPPRIMER la vérification du token ici car l'intercepteur le gère déjà
    const response = await axiosInstance.get("/api/ListDomaines");
    return response.data;
}

const ModifierDomaine = async (id, data) => {
    const response = await axiosInstance.put(`/api/UpdateDomaine/${id}`, data);
    return response.data;
}

const SupprimerDomaine = async (id) => {
    const response = await axiosInstance.delete(`/api/DeleteDomaine/${id}`);
    return response.data;
}

const NombreDomaines = async () => {
    const response = await axiosInstance.get("/api/NombreDomaines");
    return response.data;
}

// Corriger l'export pour utiliser les noms cohérents
export const domaineService = {
    AjoutDomaine,  // Majuscule
    ListerDomaines, // Majuscule
    ModifierDomaine,
    SupprimerDomaine,
    NombreDomaines,
}