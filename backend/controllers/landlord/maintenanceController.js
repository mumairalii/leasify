const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const MaintenanceRequest = require('../../models/MaintenanceRequest');
const LogEntry = require('../../models/LogEntry');

const getMaintenanceRequests = asyncHandler(async (req, res) => {
    const requests = await MaintenanceRequest.find({ organization: req.user.organization })
        .sort({ createdAt: -1 })
        .populate('tenant', 'name email')
        .populate('property', 'address');
    res.status(200).json(requests);
});

const updateMaintenanceRequest = asyncHandler(async (req, res) => {
    // Check for validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }

    const { status } = req.body;
    const updatedRequest = await MaintenanceRequest.findOneAndUpdate(
        { _id: req.params.id, organization: req.user.organization },
        { status: status },
        { new: true, runValidators: true }
    ).populate('tenant', 'name email').populate('property', 'address');

    if (!updatedRequest) {
        res.status(404);
        throw new Error('Request not found or not authorized');
    }

    await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'Maintenance',
        message: `Updated maintenance request status to "${status}"`,
        property: updatedRequest.property._id,
        tenant: updatedRequest.tenant._id,
    });

    res.status(200).json(updatedRequest);
});

const deleteMaintenanceRequest = asyncHandler(async (req, res) => {
    const request = await MaintenanceRequest.findOneAndDelete({
        _id: req.params.id,
        organization: req.user.organization
    });
    if (!request) {
        res.status(404);
        throw new Error('Request not found or not authorized');
    }
    res.status(200).json({ id: req.params.id, message: 'Request deleted' });
});

module.exports = {
    getMaintenanceRequests,
    updateMaintenanceRequest,
    deleteMaintenanceRequest,
};

// const asyncHandler = require('express-async-handler');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const LogEntry = require('../../models/LogEntry');

// /**
//  * @desc    Get all maintenance requests for a landlord's organization
//  * @route   GET /api/landlord/maintenance-requests
//  * @access  Private (Landlord Only)
//  */
// const getMaintenanceRequests = asyncHandler(async (req, res) => {
//     const requests = await MaintenanceRequest.find({ organization: req.user.organization })
//         .sort({ createdAt: -1 })
//         .populate('tenant', 'name email')
//         .populate('property', 'address');

//     res.status(200).json(requests);
// });

// /**
//  * @desc    Update a maintenance request's status
//  * @route   PUT /api/landlord/maintenance-requests/:id
//  * @access  Private (Landlord Only)
//  */
// const updateMaintenanceRequest = asyncHandler(async (req, res) => {
//     const { status } = req.body;

//     const updatedRequest = await MaintenanceRequest.findOneAndUpdate(
//         { _id: req.params.id, organization: req.user.organization },
//         { status: status },
//         { new: true, runValidators: true }
//     ).populate('tenant', 'name email').populate('property', 'address');

//     if (!updatedRequest) {
//         res.status(404);
//         throw new Error('Request not found or not authorized');
//     }

//     await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.name,
//         type: 'Maintenance',
//         message: `Updated maintenance request status to "${status}"`,
//         property: updatedRequest.property._id,
//         tenant: updatedRequest.tenant._id,
//     });

//     res.status(200).json(updatedRequest);
// });

// /**
//  * @desc    Delete a maintenance request
//  * @route   DELETE /api/landlord/maintenance-requests/:id
//  * @access  Private (Landlord Only)
//  */
// const deleteMaintenanceRequest = asyncHandler(async (req, res) => {
//     const request = await MaintenanceRequest.findOneAndDelete({
//         _id: req.params.id,
//         organization: req.user.organization
//     });

//     if (!request) {
//         res.status(404);
//         throw new Error('Request not found or not authorized');
//     }

//     res.status(200).json({ id: req.params.id, message: 'Request deleted' });
// });

// module.exports = {
//     getMaintenanceRequests,
//     updateMaintenanceRequest,
//     deleteMaintenanceRequest,
// };

// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const LogEntry = require('../../models/LogEntry');

// // @desc    Get all maintenance requests for a landlord's organization
// const getMaintenanceRequests = async (req, res) => {
//     try {
//         // --- IMPROVEMENT ---
//         // Since your MaintenanceRequest model has a direct 'property' field,
//         // we can simplify the populate call. No need for nested population.
//         const requests = await MaintenanceRequest.find({ organization: req.user.organization })
//             .sort({ createdAt: -1 })
//             .populate('tenant', 'name email')
//             .populate('property', 'address'); // This is now cleaner and more direct

//         res.status(200).json(requests);
//     } catch (error) {
//         console.error("Error fetching maintenance requests:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Update a maintenance request's status
// const updateMaintenanceRequest = async (req, res) => {
//     try {
//         const { status } = req.body;

//         // --- REFACTOR: Use findOneAndUpdate for an atomic, secure operation ---
//         const updatedRequest = await MaintenanceRequest.findOneAndUpdate(
//             { _id: req.params.id, organization: req.user.organization }, // Query condition
//             { status: status }, // The update to apply
//             { new: true } // Return the updated document
//         ).populate('tenant', 'name email').populate('property', 'address');

//         if (!updatedRequest) {
//             return res.status(404).json({ message: 'Request not found or not authorized' });
//         }
        
//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'Maintenance',
//             message: `Updated maintenance request status to "${status}"`,
//             property: updatedRequest.property._id,
//             tenant: updatedRequest.tenant._id,
//         });

//         res.status(200).json(updatedRequest);
//     } catch (error) {
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ message: 'Validation Error: Invalid status value provided.' });
//         }
//         console.error("Error updating maintenance request:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Delete a maintenance request
// const deleteMaintenanceRequest = async (req, res) => {
//     try {
//         // --- REFACTOR: Use findOneAndDelete for an atomic, secure operation ---
//         const request = await MaintenanceRequest.findOneAndDelete({
//             _id: req.params.id,
//             organization: req.user.organization
//         });

//         if (!request) {
//             return res.status(404).json({ message: 'Request not found or not authorized' });
//         }

//         res.status(200).json({ id: req.params.id, message: 'Request deleted' });
//     } catch (error) {
//         console.error("Error deleting maintenance request:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = {
//     getMaintenanceRequests,
//     updateMaintenanceRequest,
//     deleteMaintenanceRequest,
// };

