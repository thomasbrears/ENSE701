// src/services/adminService.js
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

interface EMail {
    email: string,
    role: string
}

const addEmail = async (email: EMail) => {
    try {
        const response = await axios.post(`${API_URL}/emails`,email);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteEmail = async (email: string) => {
    try {
        const response = await axios.delete(`${API_URL}/emails/${email}`);
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