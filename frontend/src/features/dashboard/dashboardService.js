// src/features/dashboard/dashboardService.js

import api from '../../services/api';

// Get dashboard stats for the logged-in landlord
const getDashboardStats = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await api.get('landlord/dashboard/stats', config);
    return response.data;
};

const dashboardService = {
    getDashboardStats,
};

export default dashboardService;