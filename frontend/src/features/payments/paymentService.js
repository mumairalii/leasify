import api from '../../services/api.js';

// Use relative paths that will be appended to the baseURL from the api instance
const LANDLORD_API_URL = 'landlord/payments/';
const TENANT_API_URL = 'tenant/payments/';

// The 'token' argument is removed from all functions.

const logOfflinePayment = async (paymentData) => {
    const response = await api.post(LANDLORD_API_URL + 'log-offline', paymentData);
    return response.data;
};

const getPaymentsForLease = async (leaseId) => {
    const response = await api.get(LANDLORD_API_URL + `lease/${leaseId}`);
    return response.data;
};

const getMyPayments = async () => {
    const response = await api.get(TENANT_API_URL + 'my-payments');
    return response.data;
};

const paymentService = {
    logOfflinePayment,
    getPaymentsForLease,
    getMyPayments,
};

export default paymentService;
// // src/features/payments/paymentService.js
// import api from '../../services/api';

// // This URL is for landlord-specific payment actions
// const LANDLORD_API_URL = 'landlord/payments/';
// // This URL is for tenant-specific payment actions
// const TENANT_API_URL = 'tenant/payments/';

// const logOfflinePayment = async (paymentData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(LANDLORD_API_URL + 'log-offline', paymentData, config);
//     return response.data;
// };

// // --- ADD THIS NEW FUNCTION ---
// // For a landlord to get all payments for a specific lease
// const getPaymentsForLease = async (leaseId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(LANDLORD_API_URL + `lease/${leaseId}`, config);
//     return response.data;
// };

// // --- ADD THIS NEW FUNCTION ---
// // For a tenant to get their own payment history
// const getMyPayments = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(TENANT_API_URL + 'my-payments', config);
//     return response.data;
// };

// const paymentService = {
//     logOfflinePayment,
//     getPaymentsForLease,
//     getMyPayments,
// };

// export default paymentService;
// import api from '../../services/api';

// // This path combines with the base URL to form '.../api/landlord/payments/log-offline'
// const API_URL = 'landlord/payments/';

// const logOfflinePayment = async (paymentData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(API_URL + 'log-offline', paymentData, config);
//     return response.data;
// };

// const paymentService = {
//     logOfflinePayment,
// };

// export default paymentService;

// // src/features/payments/paymentService.js
// import api from '../../services/api';

// const API_URL = 'landlord/payments/';

// // Log an offline payment
// const logOfflinePayment = async (paymentData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(API_URL + 'log-offline', paymentData, config);
//     return response.data;
// };

// const paymentService = {
//     logOfflinePayment,
// };

// export default paymentService;