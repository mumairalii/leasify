// src/features/logs/logService.js

import api from '../../services/api';

const API_URL = 'landlord/logs/';

// Get all logs for the organization
const getLogs = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get(API_URL, config);
    return response.data;
};

// Create a new manual log entry
const createLog = async (logData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post(API_URL, logData, config);
    return response.data;
};

const logService = {
    getLogs,
    createLog,
};

export default logService;