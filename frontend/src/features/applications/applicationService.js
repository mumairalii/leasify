import api from '../../services/api.js';

const API_URL_LANDLORD = '/applications/landlord';
const API_URL_PUBLIC = '/applications';

// Get all applications for the landlord hub
const getApplications = async () => {
    const response = await api.get(API_URL_LANDLORD);
    return response.data;
};

// Get the dashboard summary of recent applications
const getApplicationSummary = async () => {
    const response = await api.get(`${API_URL_LANDLORD}/summary`);
    return response.data;
};

// Update an application's status (Approve/Deny)
const updateApplicationStatus = async (appData) => {
    const { id, status } = appData;
    const response = await api.put(`${API_URL_LANDLORD}/${id}`, { status });
    return response.data;
};

// Create a new application (for tenants)
const createApplication = async (appData) => {
    const response = await api.post(API_URL_PUBLIC, appData);
    return response.data;
};


const applicationService = {
    getApplications,
    getApplicationSummary,
    updateApplicationStatus,
    createApplication,
};

export default applicationService;

// import api from '../../services/api.js';

// // The 'token' argument is removed from all functions.

// const createApplication = async (applicationData) => {
//     const response = await api.post('applications', applicationData);
//     return response.data;
// };

// const getApplications = async () => {
//     const response = await api.get('applications');
//     return response.data;
// };

// const getApplicationSummary = async () => {
//     // We no longer need the 'token' argument or the 'config' object.
//     // The Axios interceptor in api.js handles the Authorization header automatically.
//     const response = await api.get('/applications/summary');
//     return response.data;
// };

// const updateApplicationStatus = async (data) => {
//     const { id, status } = data;
//     const response = await api.put(`applications/${id}`, { status });
//     return response.data;
// };

// const applicationService = {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
//     getApplicationSummary,
// };

// export default applicationService;

// // src/features/applications/applicationService.js
// import api from '../../services/api';

// // --- THIS IS THE CORRECTED CODE ---
// // We now use relative paths (e.g., 'applications') instead of absolute paths ('/api/applications')

// const createApplication = async (applicationData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post('applications', applicationData, config);
//     return response.data;
// };

// const getApplications = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get('applications', config);
//     return response.data;
// };

// const updateApplicationStatus = async (data, token) => {
//     const { id, status } = data;
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     // FIX: The path is now `applications/${id}` which correctly appends to the base URL
//     const response = await api.put(`applications/${id}`, { status }, config);
//     return response.data;
// };

// const applicationService = {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
// };

// export default applicationService;
// // src/features/applications/applicationService.js
// import api from '../../services/api';

// // --- THIS IS THE CORRECTED CODE ---
// // We now use relative paths (e.g., 'applications') instead of absolute paths ('/api/applications')

// // For a tenant to create an application
// const createApplication = async (applicationData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     // FIX: The path is now 'applications', which correctly appends to the baseURL
//     const response = await api.post('applications', applicationData, config);
//     return response.data;
// };

// // For a landlord to get all their applications
// const getApplications = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     // FIX: The path is now 'applications'
//     const response = await api.get('applications', config);
//     return response.data;
// };

// // For a landlord to update an application (approve/reject)
// const updateApplicationStatus = async (data, token) => {
//     const { id, status } = data;
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     // FIX: The path is now `applications/${id}`
//     const response = await api.put(`applications/${id}`, { status }, config);
//     return response.data;
// };

// const applicationService = {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
// };

// export default applicationService;
// // src/features/applications/applicationService.js
// import api from '../../services/api';

// // --- THIS IS THE CORRECTED CODE ---
// // We now use relative paths (e.g., 'applications') instead of absolute paths ('/api/applications')

// // For a tenant to create an application
// const createApplication = async (applicationData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post('applications', applicationData, config); // FIX: Removed '/api/'
//     return response.data;
// };

// // For a landlord to get all their applications
// const getApplications = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get('applications', config); // FIX: Removed '/api/'
//     return response.data;
// };

// // For a landlord to update an application (approve/reject)
// const updateApplicationStatus = async (data, token) => {
//     const { id, status } = data;
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.put(`applications/${id}`, { status }, config); // FIX: Removed '/api/'
//     return response.data;
// };

// const applicationService = {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
// };

// export default applicationService;

// // src/features/applications/applicationService.js
// import api from '../../services/api';

// // For a tenant to create an application
// const createApplication = async (applicationData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post('/api/applications', applicationData, config);
//     return response.data;
// };

// // For a landlord to get all their applications
// const getApplications = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get('/api/applications', config);
//     return response.data;
// };

// // For a landlord to update an application (approve/reject)
// const updateApplicationStatus = async (data, token) => {
//     const { id, status } = data;
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.put(`/api/applications/${id}`, { status }, config);
//     return response.data;
// };

// const applicationService = {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
// };

// export default applicationService;