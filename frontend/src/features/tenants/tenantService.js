import api from '../../services/api.js';

const LANDLORD_API_URL = '/landlord/tenants';

const getOverdueTenants = async () => {
    const response = await api.get(`${LANDLORD_API_URL}/overdue`);
    return response.data;
};

const getTenants = async () => {
    const response = await api.get(LANDLORD_API_URL);
    return response.data;
};

const getTenantById = async (tenantId) => {
    const response = await api.get(`${LANDLORD_API_URL}/${tenantId}`);
    return response.data;
};

const getTenantReliabilityScore = async (tenantId) => {
    const response = await api.get(`/landlord/tenants/${tenantId}/reliability-score`);
    return response.data;
};

const getUpcomingPayments = async () => {
    const response = await api.get(`${LANDLORD_API_URL}/upcoming`);
    return response.data;
};

const tenantService = {
    getOverdueTenants,
    getTenants,
    getTenantById,
    getUpcomingPayments,
    getTenantReliabilityScore,
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