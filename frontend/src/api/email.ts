// src/services/adminService.js
import axios from 'axios';

const API_URL = 'https://your-api-url.com/api/admin';

interface EMail {
    email: string,
    role: string
}

const addEmail = async (email: EMail) => {
    try {
        const response = await axios.post(`${API_URL}/add-email`, { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteEmail = async (email: EMail) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-email`, { data: { email } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllEmails = async () => {
    try {
        const response = await axios.get(`${API_URL}/emails`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { addEmail, deleteEmail, getAllEmails };