import api from '../../services/api';

// This service is purely for making HTTP requests and dealing with data in localStorage.

// Register user
const register = async (userData) => {
    // Make a POST request to the /auth/register endpoint
    const response = await api.post('auth/register', userData);

    // If the request is successful, store the user data (including token) in localStorage
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Login user
const login = async (userData) => {
    const response = await api.post('auth/login', userData);

    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;