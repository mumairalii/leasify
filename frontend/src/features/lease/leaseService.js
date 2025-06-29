import api from '../../services/api.js';

const TENANT_API_URL = 'tenant/lease/';
const LANDLORD_API_URL = 'landlord/leases/';

// The 'token' argument is removed from all functions.

const getMyLease = async () => {
    const response = await api.get(TENANT_API_URL + 'my-lease');
    return response.data;
};

const assignLease = async (leaseData) => {
    const response = await api.post(LANDLORD_API_URL + 'assign', leaseData);
    return response.data;
};

const leaseService = {
    getMyLease,
    assignLease,
};

export default leaseService;

// import api from '../../services/api';

// // Relative paths for the different route groups
// const TENANT_API_URL = 'tenant/lease/';
// const LANDLORD_API_URL = 'landlord/leases/';

// // Get the logged-in tenant's active lease
// const getMyLease = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(TENANT_API_URL + 'my-lease', config);
//     return response.data;
// };

// // Assign a lease to a property
// const assignLease = async (leaseData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(LANDLORD_API_URL + 'assign', leaseData, config);
//     return response.data;
// };

// const leaseService = {
//     getMyLease,
//     assignLease,
// };

// export default leaseService;
// import axios from 'axios';

// // This is the base URL for tenant-specific lease routes
// const API_URL = 'http://localhost:5001/api/tenant/lease/';
// const LANDLORD_API_URL = 'http://localhost:5001/api/landlord/leases/'; 
// // Get the logged-in tenant's active lease
// const getMyLease = async (token) => {
//     // We must send the tenant's token to access this protected route
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };

//     const response = await axios.get(API_URL + 'my-lease', config);

//     return response.data;
// };

// // Assign a lease to a property
// const assignLease = async (leaseData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.post(LANDLORD_API_URL + 'assign', leaseData, config);
//     return response.data;
// };

// const leaseService = {
//     getMyLease,
//     assignLease,
// };

// export default leaseService;