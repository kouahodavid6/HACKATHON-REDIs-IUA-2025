import axiosInstance from "../api/axiosInstance";

const creerProposition = async (idQuestion, propositionData) => {
    try {
        const response = await axiosInstance.post(`/api/StoreProposition/${idQuestion}`, {
            libelle_propositions: propositionData.libelle_propositions,
            is_correct: propositionData.is_correct
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la création de la proposition');
    }
}

const listerPropositions = async (idQuestion) => {
    try {
        const response = await axiosInstance.get(`/api/ListePropositions/${idQuestion}`);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors du chargement des propositions');
    }
}

const modifierProposition = async (idProposition, propositionData) => {
    try {
        const response = await axiosInstance.post(`/api/UpdtateProposition/${idProposition}`, {
            libelle_propositions: propositionData.libelle_propositions,
            is_correct: propositionData.is_correct
        });

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la modification de la proposition');
    }
}

const supprimerProposition = async (idProposition) => {
    try {
        const response = await axiosInstance.post(`/api/DeleteProposition/${idProposition}`);

        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Erreur lors de la suppression de la proposition');
    }
}

export const propositionsService = {
    creerProposition,
    listerPropositions,
    modifierProposition,
    supprimerProposition
}