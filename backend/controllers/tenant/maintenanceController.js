const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const MaintenanceRequest = require('../../models/MaintenanceRequest');
const Lease = require('../../models/Lease');

const createRequest = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }

    const { description } = req.body;
    const activeLease = await Lease.findOne({ 
        tenant: req.user.id, 
        status: 'active' 
    });

    if (!activeLease) {
        res.status(404);
        throw new Error('No active lease found for this tenant. Cannot create a maintenance request.');
    }

    const request = await MaintenanceRequest.create({
        tenant: req.user.id,
        property: activeLease.property,
        organization: activeLease.organization,
        description,
        lease: activeLease._id,
        status: 'Pending' // Explicitly set status
    });

    res.status(201).json(request);
});

const getRequests = asyncHandler(async (req, res) => {
    const requests = await MaintenanceRequest.find({ tenant: req.user.id })
        .sort({ createdAt: -1 })
        .populate('property', 'address')
        .populate('lease', 'property status'); // Include lease with necessary fields

    res.status(200).json(requests);
});

module.exports = { 
    createRequest, 
    getRequests 
};
// const asyncHandler = require('express-async-handler');
// const { validationResult } = require('express-validator');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const Lease = require('../../models/Lease');

// const createRequest = asyncHandler(async (req, res) => {
//     // Check for validation errors first
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         res.status(400);
//         throw new Error('Validation failed', { cause: errors.array() });
//     }

//     const { description } = req.body;
//     const activeLease = await Lease.findOne({ tenant: req.user.id, status: 'active' });

//     if (!activeLease) {
//         res.status(404);
//         throw new Error('No active lease found for this tenant. Cannot create a maintenance request.');
//     }

//     const request = await MaintenanceRequest.create({
//         tenant: req.user.id,
//         property: activeLease.property,
//         organization: activeLease.organization,
//         description,
//         lease: activeLease._id,
//     });

//     res.status(201).json(request);
// });

// const getRequests = asyncHandler(async (req, res) => {
//     const requests = await MaintenanceRequest.find({ tenant: req.user.id })
//         .sort({ createdAt: -1 })
//         .populate('property', 'address');

//     res.status(200).json(requests);
// });

// module.exports = {  createRequest, 
//     getRequests  };


// const getTenantRequests = async (req, res) => {
//     try {
//         // --- FIX: Using nested populate to get the property address correctly ---
//         const requests = await MaintenanceRequest.find({ tenant: req.user.id })
//             .sort({ createdAt: -1 })
//             .populate({
//                 path: 'lease',
//                 select: 'property',
//                 populate: {
//                     path: 'property',
//                     select: 'address'
//                 }
//             });
        
//         // Flatten the data for easier use on the frontend
//         const formattedRequests = requests.map(req => ({
//             _id: req._id,
//             description: req.description,
//             status: req.status,
//             createdAt: req.createdAt,
//             property: req.lease?.property,
//         }));
        
//         res.status(200).json(formattedRequests);
//     } catch (error) {
//         console.error("Error fetching tenant's maintenance requests:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { createRequest, 
//     getRequests  };


// const { validationResult } = require('express-validator');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const Lease = require('../../models/Lease');

// // @desc    Create a new maintenance request
// const createMaintenanceRequest = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const activeLease = await Lease.findOne({ tenant: req.user.id, status: 'active' });
//         if (!activeLease) {
//             return res.status(400).json({ message: 'You must have an active lease to submit a request.' });
//         }

//         const newRequest = await MaintenanceRequest.create({
//             lease: activeLease._id,
//             property: activeLease.property,
//             tenant: req.user.id,
//             organization: activeLease.organization,
//             description: req.body.description,
//         });

//         res.status(201).json(newRequest);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Get all maintenance requests for the logged-in tenant
// const getTenantRequests = async (req, res) => {
//     try {
//         const requests = await MaintenanceRequest.find({ tenant: req.user.id }).sort({ createdAt: -1 });
//         res.status(200).json(requests);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // Ensure both functions are exported
// module.exports = {
//     createMaintenanceRequest,
//     getTenantRequests
// };

