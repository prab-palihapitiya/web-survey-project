import axios from "axios";
import { DefaultTemplate } from "../config/template-config";

const apiUrl = process.env.API_URL || "http://localhost:4000/api";
const userId = "clzyfzfg300002y2l8a7du5lf"; //TODO: Get the user ID from the auth context

export const createTemplate = async (templateData: any) => {
    console.log('Template data:', templateData);

    const templateDataWithUserId = {
        name: templateData.templateName,
        obj: templateData,
        userId
    };

    try {
        const response = await axios.post(`${apiUrl}/templates/`, templateDataWithUserId);
        return response.data.id;
    } catch (error) {
        console.error("Error creating template:", error);
        throw error; // Re-throw the error for handling in the component
    }
};

export const saveTemplate = async (templateId: string, templateData: any) => {
    const templateDataWithUserId = {
        name: templateData.templateName,
        obj: templateData,
        userId
    };

    try {
        const response = await axios.put(`${apiUrl}/templates/${templateId}`, templateDataWithUserId);
        return response;
    } catch (error) {
        console.error("Error saving template:", error);
        throw error; // Re-throw the error for handling in the component
    }
};

export const fetchTemplatesByUser = async () => {
    try {
        const response = await axios.get(`${apiUrl}/templates/user/${userId}`);
        return response;
    } catch (error) {
        console.error("Error fetching templates:", error);
        throw error; // Re-throw the error for handling in the component
    }
};

export const deleteTemplate = async (templateId: string) => {
    try {
        const response = await axios.delete(`${apiUrl}/templates/${templateId}`);
        return response;
    } catch (error) {
        console.error("Error deleting template:", error);
        throw error; // Re-throw the error for handling in the component
    }
};