import api from '../../services/api.js';

const API_URL = 'landlord/tenants/';

// The 'token' argument is removed from all functions.
// The interceptor will handle authentication.

const getOverdueTenants = async () => {
    const response = await api.get(API_URL + 'overdue');
    return response.data;
};

const getTenants = async () => {
    const response = await api.get(API_URL);
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
// // --- ADD THIS NEW FUNCTION ---
// // Get all tenants for the landlord
// const getTenants = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(API_URL, config);
//     return response.data;
// };

// const tenantService = {
//     getOverdueTenants,
//     getTenants,
// };

// export default tenantService;

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