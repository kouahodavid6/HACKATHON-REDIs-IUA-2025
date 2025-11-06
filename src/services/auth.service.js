import axiosInstance from "../api/axiosInstance";

const registerAdmin = async (data) => {
    try {
        const response = await axiosInstance.post("/api/registerAdmin", data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Erreur lors de l'inscription");
    }
};

const loginAdmin = async (credentials) => {
    try {
        const response = await axiosInstance.post("/api/loginAdmin", credentials);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
};

export const authAdminService = {
    registerAdmin,
    loginAdmin
};