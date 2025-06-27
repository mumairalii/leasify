import axios from 'axios';

// This is the base URL for tenant-specific lease routes
const API_URL = 'http://localhost:5001/api/tenant/lease/';
const LANDLORD_API_URL = 'http://localhost:5001/api/landlord/leases/'; 
// Get the logged-in tenant's active lease
const getMyLease = async (token) => {
    // We must send the tenant's token to access this protected route
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios.get(API_URL + 'my-lease', config);

    return response.data;
};

// Assign a lease to a property
const assignLease = async (leaseData, token) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.post(LANDLORD_API_URL + 'assign', leaseData, config);
    return response.data;
};

const leaseService = {
    getMyLease,
    assignLease,
};

export default leaseService;