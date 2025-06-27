// const Lease = require('../../models/Lease');

// // @desc    Get the active lease for the logged-in tenant
// // @route   GET /api/tenant/lease/my-lease
// const getMyLease = async (req, res) => {
//     try {
//         // Find the lease where the tenant field matches the logged-in user's ID
//         const lease = await Lease.findOne({ tenant: req.user._id, status: 'active' })
//             .populate('property', 'address rentAmount'); // Populate with property details

//         if (!lease) {
//             return res.status(404).json({ message: 'No active lease found.' });
//         }
//         res.status(200).json(lease);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve lease details', error: error.message });
//     }
// };

// module.exports = { getMyLease };

const Lease = require('../../models/Lease');

// @desc    Get the active lease for the currently logged-in tenant
// @route   GET /api/tenant/lease/my-lease
// @access  Private (Tenant Only)
const getMyLease = async (req, res) => {
    try {
        // Find the lease where the `tenant` field matches the ID of the user making the request.
        // The user's ID is securely provided by our `protect` middleware from the JWT payload.
        // We also ensure we only retrieve the lease if its status is 'active'.
        const lease = await Lease.findOne({ tenant: req.user.id, status: 'active' })
            .populate('property', 'address rentAmount'); // This powerful Mongoose feature finds the related Property
                                                        // and includes its address and rentAmount in the response.

        // If no active lease is found for this user, it's not an error, but a valid "not found" case.
        if (!lease) {
            return res.status(404).json({ message: 'No active lease found for this user.' });
        }
        
        // If a lease is found, send it back with a 200 OK status.
        res.status(200).json(lease);

    } catch (error) {
        console.error('Error fetching tenant lease:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMyLease };