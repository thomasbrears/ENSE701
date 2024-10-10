// src/services/adminService.js
import axios from 'axios';

const API_URL = 'https://your-api-url.com/api/admin';

interface Score {
    email: string,
    role: string
}

const addScore = async (email: Score) => {
    try {
        const response = await axios.post(`${API_URL}/add-email`, { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteScore = async (email: Score) => {
    try {
        const response = await axios.delete(`${API_URL}/delete-email`, { data: { email } });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllScores = async () => {
    try {
        const response = await axios.get(`${API_URL}/emails`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { addScore, deleteScore, getAllScores };