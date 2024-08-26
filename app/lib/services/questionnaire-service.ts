import axios from "axios";

const apiUrl = process.env.API_URL || "http://localhost:4000/api";
const userId = "clzyfzfg300002y2l8a7du5lf"; //TODO: Get the user ID from the auth context

export const saveQuestionnaireData = async (questionnaireId: string, questions: any[], logic: any[], questionnaireData: {
    userId?: string;
    name?: string;
    obj?: any;
    testUrl?: string;
    pubUrl?: string;
    status?: string;
}) => {
    questionnaireData.userId = userId;
    questionnaireData.obj = { name: questionnaireData.name, questions: questions, logic: logic };
    questionnaireData.status = "DRAFT";

    try {
        const response = await axios.put(`${apiUrl}/questionnaires/${questionnaireId}`, questionnaireData);
        return response;
    } catch (error) {
        console.error("Error saving questionnaire:", error);
        throw error; // Re-throw the error for handling in the component
    }
};


export const createEmptyQuestionnaire = async () => {
    const postQuestionnaireData = {
        userId: userId,
        status: "NEW",
        obj: {
            name: "Untitled Questionnaire",
            questions: []
        }
    }

    try {
        const response = await axios.post(`${apiUrl}/questionnaires/`, postQuestionnaireData);
        return response.data.id;
    } catch (error) {
        console.error("Error creating questionnaire:", error);
        throw error; // Re-throw the error for handling in the component
    }
}

export const fetchQuestionnaires = async () => {
    axios.get(`${apiUrl}/questionnaires/`)
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.error(error);
        });
}

export const fetchQuestionnaire = async (id: string) => {
    try {
        const response = await axios.get(`${apiUrl}/questionnaires/${id}`);
        return response;
    } catch (error) {
        console.error("Error fetching questionnaire:", error);
        throw error; // Re-throw the error for handling in the component
    }
}


export const fetchQuestionnairesByUser = async (userId: string) => {
    try {
        const response = await axios.get(`${apiUrl}/questionnaires/user/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching questionnaires by user:", error);
        throw error; // Re-throw the error for handling in the component
    }
};
