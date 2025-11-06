import axiosInstance from "../api/axiosInstance";

const creerQuestion = async (idEpreuve, questionData) => {
    try {
        const response = await axiosInstance.post(`/api/StoreQuestion/${idEpreuve}`, {
            libelle: questionData.libelle,
            type: questionData.type,
            time_in_seconds: questionData.time_in_seconds
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création de la question');
    }
}

const listerQuestions = async (idEpreuve) => {
    try {
        const response = await axiosInstance.get(`/api/ListQuestions/${idEpreuve}`);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des questions');
    }
}

const modifierQuestion = async (idQuestion, questionData) => {
    try {
        const response = await axiosInstance.post(`/api/UpdtadeQuestion/${idQuestion}`, {
            libelle: questionData.libelle,
            type: questionData.type,
            time_in_seconds: questionData.time_in_seconds
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification de la question');
    }
}

const supprimerQuestion = async (idQuestion) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteQuestions/${idQuestion}`);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la question');
    }
}

export const questionsService = {
    creerQuestion,
    listerQuestions,
    modifierQuestion,
    supprimerQuestion
}