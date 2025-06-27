import api from '../../services/api';

const TENANT_API_URL = 'tenant/maintenance-requests/';
const LANDLORD_API_URL = 'landlord/maintenance-requests/';

// --- Tenant Actions ---
const createRequest = async (requestData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.post(TENANT_API_URL, requestData, config);
    return response.data;
};

const getTenantRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get(TENANT_API_URL, config);
    return response.data;
};

// --- Landlord Actions ---
const getLandlordRequests = async (token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.get(LANDLORD_API_URL, config);
    return response.data;
};

const updateRequest = async (requestData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { id, status } = requestData;
    const response = await api.put(LANDLORD_API_URL + id, { status }, config);
    return response.data;
};

const deleteRequest = async (requestId, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await api.delete(LANDLORD_API_URL + requestId, config);
    return response.data;
};

const maintenanceService = {
    createRequest,
    getTenantRequests,
    getLandlordRequests,
    updateRequest,
    deleteRequest,
};

export default maintenanceService;
// import axios from 'axios';

// const TENANT_API_URL = 'http://localhost:5001/api/tenant/maintenance-requests/';
// const LANDLORD_API_URL = 'http://localhost:5001/api/landlord/maintenance-requests/';

// // --- Tenant Actions ---
// const createRequest = async (requestData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.post(TENANT_API_URL, requestData, config);
//     return response.data;
// };

// const getTenantRequests = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.get(TENANT_API_URL, config);
//     return response.data;
// };

// // --- Landlord Actions ---
// const getLandlordRequests = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.get(LANDLORD_API_URL, config);
//     return response.data;
// };

// const updateRequest = async (requestData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const { id, status } = requestData;
//     const response = await axios.put(LANDLORD_API_URL + id, { status }, config);
//     return response.data;
// };

// const deleteRequest = async (requestId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.delete(LANDLORD_API_URL + requestId, config);
//     return response.data;
// };

// const maintenanceService = {
//     createRequest,
//     getTenantRequests,
//     getLandlordRequests,
//     updateRequest,
//     deleteRequest,
// };

// export default maintenanceService;
// import axios from 'axios';

// const TENANT_API_URL = 'http://localhost:5001/api/tenant/maintenance-requests/';
// const LANDLORD_API_URL = 'http://localhost:5001/api/landlord/maintenance-requests/';

// // Tenant Action
// const createRequest = async (requestData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.post(TENANT_API_URL, requestData, config);
//     return response.data;
// };

// // Tenant Action: Renamed for clarity
// const getTenantRequests = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.get(TENANT_API_URL, config);
//     return response.data;
// };

// // Landlord Action: Renamed for clarity
// const getLandlordRequests = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.get(LANDLORD_API_URL, config);
//     return response.data;
// };

// // Landlord Action
// const updateRequest = async (requestData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const { id, status } = requestData;
//     const response = await axios.put(LANDLORD_API_URL + id, { status }, config);
//     return response.data;
// };

// // Landlord Action
// const deleteRequest = async (requestId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.delete(LANDLORD_API_URL + requestId, config);
//     return response.data;
// };

// const maintenanceService = {
//     createRequest,
//     getTenantRequests,    // <-- Use new name
//     getLandlordRequests,  // <-- Use new name
//     updateRequest,
//     deleteRequest
// };

// export default maintenanceService;

// import axios from 'axios';

// const TENANT_API_URL = 'http://localhost:5001/api/tenant/maintenance-requests/';
// const LANDLORD_API_URL = 'http://localhost:5001/api/landlord/maintenance-requests/';

// // --- Tenant Action ---
// const createRequest = async (requestData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.post(TENANT_API_URL, requestData, config);
//     return response.data;
// };

// // --- Landlord Actions ---
// // Get all requests for a landlord
// const getRequests = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.get(LANDLORD_API_URL, config);
//     return response.data;
// };




// // Update a request's status
// const updateRequest = async (requestData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.put(LANDLORD_API_URL + requestData.id, { status: requestData.status }, config);
//     return response.data;
// };

// const deleteRequest = async (requestId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.delete(LANDLORD_API_URL + requestId, config);
//     return response.data;
// };

// const maintenanceService = {
//     createRequest,
//     getRequests,      // <-- Add this
//     updateRequest,
//     deleteRequest,    // <-- Add this
// };

// export default maintenanceService;



// // This is the base URL for tenant-specific maintenance routes
// const API_URL = 'http://localhost:5001/api/tenant/maintenance-requests/';

// // Create a new maintenance request
// const createRequest = async (requestData, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.post(API_URL, requestData, config);
//     return response.data;
// };

// const maintenanceService = {
//     createRequest,
// };

// export default maintenanceService;