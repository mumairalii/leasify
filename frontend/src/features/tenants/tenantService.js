// src/features/tenants/tenantService.js

import api from '../../services/api';

const API_URL = 'landlord/tenants/';

// Get tenants with overdue rent from the backend
const getOverdueTenants = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get(API_URL + 'overdue', config);
    return response.data;
};
// --- ADD THIS NEW FUNCTION ---
// Get all tenants for the landlord
const getTenants = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get(API_URL, config);
    return response.data;
};

const tenantService = {
    getOverdueTenants,
    getTenants,
};

export default tenantService;

// // src/features/tenants/tenantService.js

// import api from '../../services/api';

// const API_URL = 'landlord/tenants/';

// // Get tenants with overdue rent from the backend
// const getOverdueTenants = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(API_URL + 'overdue', config);
//     return response.data;
// };

// const tenantService = {
//     getOverdueTenants,
// };

// export default tenantService;