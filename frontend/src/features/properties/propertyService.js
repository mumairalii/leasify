import api from '../../services/api';

const API_URL = 'landlord/properties/';

// The 'token' argument is no longer needed
const getProperties = async ({ page = 1, limit = 9 } = {}) => {
    // The config object is no longer needed because the interceptor handles the header
    const response = await api.get(API_URL, { params: { page, limit } });
    return response.data;
};

// All other functions are simplified as well
const createProperty = async (propertyData) => {
    const response = await api.post(API_URL, propertyData);
    return response.data;
};

const updateProperty = async (propertyData) => {
    const response = await api.put(API_URL + propertyData._id, propertyData);
    return response.data;
};

const deleteProperty = async (propertyId) => {
    const response = await api.delete(API_URL + propertyId);
    return response.data;
};

const propertyService = {
    createProperty,
    getProperties,
    updateProperty,
    deleteProperty,
};

export default propertyService;
// import api from '../../services/api';

// const API_URL = 'landlord/properties/';

// // Create a property
// const createProperty = async (propertyData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(API_URL, propertyData, config);
//     return response.data;
// };

// // Get all of a landlord's properties
// // Get all of a landlord's properties (NOW WITH PAGINATION)
// const getProperties = async (token, { page = 1, limit = 9 } = {}) => {
//     const config = {
//         headers: { Authorization: `Bearer ${token}` },
//         // Axios will automatically convert this to query params: ?page=X&limit=Y
//         params: { page, limit } 
//     };
//     const response = await api.get(API_URL, config);
//     return response.data;
// };

// // Update a property
// const updateProperty = async (propertyData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.put(API_URL + propertyData._id, propertyData, config);
//     return response.data;
// };

// // Delete a property
// const deleteProperty = async (propertyId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.delete(API_URL + propertyId, config);
//     return response.data;
// };

// const propertyService = {
//     createProperty,
//     getProperties,
//     updateProperty,
//     deleteProperty,
// };

// export default propertyService;

// import axios from 'axios';

// const API_URL = 'http://localhost:5001/api/landlord/properties/';

// // Create a property
// const createProperty = async (propertyData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.post(API_URL, propertyData, config);
//     return response.data;
// };

// // Get all of a landlord's properties
// const getProperties = async (token) => {
//     console.log('Making API call to get properties with token:', token);
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     try {
//         const response = await axios.get(API_URL, config);
//         console.log('API Response:', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error fetching properties:', error.response || error);
//         throw error;
//     }
// };


// // Update a property
// const updateProperty = async (propertyData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     // We send the ID in the URL and the data to update in the body
//     const response = await axios.put(API_URL + propertyData._id, propertyData, config);
//     return response.data;
// };

// // Delete a property
// const deleteProperty = async (propertyId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.delete(API_URL + propertyId, config);
//     return response.data;
// };

// const propertyService = {
//     createProperty,
//     getProperties,
//     updateProperty,
//     deleteProperty,
// };

// export default propertyService;
// import axios from 'axios';

// const API_URL = 'http://localhost:5001/api/landlord/properties/';

// // Create new property
// const createProperty = async (propertyData, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.post(API_URL, propertyData, config);
//     return response.data;
// };

// // Get landlord properties
// const getProperties = async (token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.get(API_URL, config);
//     return response.data;
// };


// const deleteProperty = async (propertyId, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     // Send a DELETE request to the specific property's URL
//     const response = await axios.delete(API_URL + propertyId, config);
//     return response.data;
// };

// const propertyService = {
//     createProperty,
//     getProperties,
//     deleteProperty,
// };

// export default propertyService;














// import axios from 'axios';

// const API_URL = 'http://localhost:5001/api/landlord/properties/';

// // Create a property
// const createProperty = async (propertyData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.post(API_URL, propertyData, config);
//     return response.data;
// };

// // Get all of a landlord's properties
// const getProperties = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.get(API_URL, config);
//     // --- THIS IS THE CRITICAL LOG ---
//     // Let's inspect the entire raw response object from Axios
//     console.log('--- PROPERTY SERVICE: Full Axios response object: ---', response);
//     return response.data;
    
// };


// // Update a property
// const updateProperty = async (propertyData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     // We send the ID in the URL and the data to update in the body
//     const response = await axios.put(API_URL + propertyData._id, propertyData, config);
//     return response.data;
// };

// // Delete a property
// const deleteProperty = async (propertyId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await axios.delete(API_URL + propertyId, config);
//     return response.data;
// };

// const propertyService = {
//     createProperty,
//     getProperties,
//     updateProperty,
//     deleteProperty,
// };

// export default propertyService;
// import axios from 'axios';

// const API_URL = 'http://localhost:5001/api/landlord/properties/';

// // Create new property
// const createProperty = async (propertyData, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.post(API_URL, propertyData, config);
//     return response.data;
// };

// // Get landlord properties
// const getProperties = async (token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.get(API_URL, config);
//     return response.data;
// };


// const deleteProperty = async (propertyId, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     // Send a DELETE request to the specific property's URL
//     const response = await axios.delete(API_URL + propertyId, config);
//     return response.data;
// };

// const propertyService = {
//     createProperty,
//     getProperties,
//     deleteProperty,
// };

// export default propertyService;