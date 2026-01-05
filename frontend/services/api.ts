import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const uploadDocument = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    // Return the promise directly
    return axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const chatWithBot = async (question: string) => {
    return axios.post(`${API_URL}/chat`, { question });
};

export const getCollectionStats = async () => {
    return axios.get(`${API_URL}/debug/stats`);
};

export const getDebugDocuments = async () => {
    return axios.get(`${API_URL}/debug/documents`);
};
