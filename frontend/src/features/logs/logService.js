import api from '../../services/api.js';

const API_URL = 'landlord/logs/';

// The 'token' argument is removed.

const getLogs = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

const createLog = async (logData) => {
    const response = await api.post(API_URL, logData);
    return response.data;
};

const logService = {
    getLogs,
    createLog,
};

export default logService;

// // src/features/logs/logService.js

// import api from '../../services/api';

// const API_URL = 'landlord/logs/';

// // Get all logs for the organization
// const getLogs = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(API_URL, config);
//     return response.data;
// };

// // Create a new manual log entry
// const createLog = async (logData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(API_URL, logData, config);
//     return response.data;
// };

// const logService = {
//     getLogs,
//     createLog,
// };

// export default logService;