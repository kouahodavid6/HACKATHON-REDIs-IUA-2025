import axiosInstance from "../api/axiosInstance";

const registerAdmin = async (data) => {
    const response = await axiosInstance.post("/api/registerAdmin", data);
    return response.data;
}

const loginAdmin = async (credentials) => {
    const response = await axiosInstance.post("/api/loginAdmin", credentials);
    return response.data;
}

export const authAdminService = {
    registerAdmin,
    loginAdmin
}