import axiosInstance from "../api/axiosInstance";

const registerAdmin = async (data) => {
    try {
        console.log("📤 Envoi inscription:", data);
        const response = await axiosInstance.post("/api/registerAdmin", data);
        console.log("✅ Réponse inscription:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur inscription:", error.response?.data || error.message);
        throw error;
    }
};

const loginAdmin = async (credentials) => {
    try {
        console.log("📤 Envoi connexion:", { email: credentials.email, password: "***" });
        const response = await axiosInstance.post("/api/loginAdmin", credentials);
        console.log("✅ Réponse connexion:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Erreur connexion:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

export const authAdminService = {
    registerAdmin,
    loginAdmin
};