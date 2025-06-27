import axios from 'axios';

// The base URL of your backend API is now read from the environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Create a new Axios instance with a dynamic base URL
const api = axios.create({
  baseURL: API_URL,
});

export default api;

// import axios from 'axios';

// // The base URL of your backend API
// const API_URL = 'http://localhost:5001/api/';

// // Create a new Axios instance with a base URL
// const api = axios.create({
//   baseURL: API_URL,
// });

// // We will enhance this file later to automatically include the auth token.
// // For now, this is all we need.

// export default api;