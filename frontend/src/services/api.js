import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

// --- THIS IS THE INTERCEPTOR ---
// This function will run before every single request is sent using the 'api' instance.
api.interceptors.request.use(
  (config) => {
    // 1. Get the user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    // 2. If the user and their token exist, add the Authorization header
    if (user && user.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }

    // 3. IMPORTANT: You must return the config object for the request to proceed
    return config;
  },
  (error) => {
    // Handle any request errors
    return Promise.reject(error);
  }
);

export default api;

// import axios from 'axios';

// // The base URL of your backend API is now read from the environment variable
// const API_URL = import.meta.env.VITE_API_URL;

// // Create a new Axios instance with a dynamic base URL
// const api = axios.create({
//   baseURL: API_URL,
// });

// export default api;

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