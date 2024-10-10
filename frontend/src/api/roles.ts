// src/services/adminService.js
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ense701-g6.vercel.app/api'
  : 'http://localhost:8000/api';

interface EMail {
    email: string,
    role: string
}

const addRole = async (email: EMail) => {
    try {
        const response = await axios.post(`${API_URL}/roles`,email);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteRole = async (email: string) => {
    try {
        const response = await axios.delete(`${API_URL}/roles/${email}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const getAllRoles = async () => {
    try {
        const response = await axios.get(`${API_URL}/roles`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { addRole , deleteRole , getAllRoles  };