// tenant_manage/backend/controllers/tenant/maintenanceController.js

const { validationResult } = require('express-validator');
const MaintenanceRequest = require('../../models/MaintenanceRequest');
const Lease = require('../../models/Lease');

// @desc    Create a new maintenance request
// @route   POST /api/tenant/maintenance-requests
// @access  Private (Tenant Only)
// const createMaintenanceRequest = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { description } = req.body;

//     try {
//         const activeLease = await Lease.findOne({ tenant: req.user.id, status: 'active' });

//         if (!activeLease) {
//             return res.status(400).json({ message: 'You must have an active lease to submit a maintenance request.' });
//         }

//         // --- FIX: The incorrect 'property' field has been removed ---
//         // The relationship is correctly handled via the 'lease' field.
//         const newRequest = await MaintenanceRequest.create({
//             lease: activeLease._id,
//             tenant: req.user.id,
//             organization: activeLease.organization,
//             description,
//         });

//         res.status(201).json(newRequest);

//     } catch (error) {
//         console.error("Error creating maintenance request:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };
const createMaintenanceRequest = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { description } = req.body;

    try {
        // Find the active lease for the logged-in tenant
        const activeLease = await Lease.findOne({ tenant: req.user.id, status: 'active' });

        if (!activeLease) {
            return res.status(400).json({ message: 'You must have an active lease to submit a maintenance request.' });
        }

        // --- FIX: Add the required 'property' field ---
        // Your model requires this field, so we add it from the active lease.
        const newRequest = await MaintenanceRequest.create({
            lease: activeLease._id,
            property: activeLease.property, // This line provides the required property ID
            tenant: req.user.id,
            organization: activeLease.organization,
            description,
        });

        res.status(201).json(newRequest);

    } catch (error) {
        // This console.error will now clearly show the validation error you provided
        console.error("Error creating maintenance request:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all of the logged-in tenant's requests
// @route   GET /api/tenant/maintenance-requests
// @access  Private (Tenant Only)
const getTenantRequests = async (req, res) => {
    try {
        // --- FIX: Using nested populate to get the property address correctly ---
        const requests = await MaintenanceRequest.find({ tenant: req.user.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'lease',
                select: 'property',
                populate: {
                    path: 'property',
                    select: 'address'
                }
            });
        
        // Flatten the data for easier use on the frontend
        const formattedRequests = requests.map(req => ({
            _id: req._id,
            description: req.description,
            status: req.status,
            createdAt: req.createdAt,
            property: req.lease?.property,
        }));
        
        res.status(200).json(formattedRequests);
    } catch (error) {
        console.error("Error fetching tenant's maintenance requests:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createMaintenanceRequest, getTenantRequests };


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

