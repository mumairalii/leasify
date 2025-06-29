const MaintenanceRequest = require('../../models/MaintenanceRequest');
const LogEntry = require('../../models/LogEntry');

// @desc    Get all maintenance requests for a landlord's organization
const getMaintenanceRequests = async (req, res) => {
    try {
        // --- IMPROVEMENT ---
        // Since your MaintenanceRequest model has a direct 'property' field,
        // we can simplify the populate call. No need for nested population.
        const requests = await MaintenanceRequest.find({ organization: req.user.organization })
            .sort({ createdAt: -1 })
            .populate('tenant', 'name email')
            .populate('property', 'address'); // This is now cleaner and more direct

        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching maintenance requests:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a maintenance request's status
const updateMaintenanceRequest = async (req, res) => {
    try {
        const { status } = req.body;

        // --- REFACTOR: Use findOneAndUpdate for an atomic, secure operation ---
        const updatedRequest = await MaintenanceRequest.findOneAndUpdate(
            { _id: req.params.id, organization: req.user.organization }, // Query condition
            { status: status }, // The update to apply
            { new: true } // Return the updated document
        ).populate('tenant', 'name email').populate('property', 'address');

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Request not found or not authorized' });
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
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error: Invalid status value provided.' });
        }
        console.error("Error updating maintenance request:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a maintenance request
const deleteMaintenanceRequest = async (req, res) => {
    try {
        // --- REFACTOR: Use findOneAndDelete for an atomic, secure operation ---
        const request = await MaintenanceRequest.findOneAndDelete({
            _id: req.params.id,
            organization: req.user.organization
        });

        if (!request) {
            return res.status(404).json({ message: 'Request not found or not authorized' });
        }

        res.status(200).json({ id: req.params.id, message: 'Request deleted' });
    } catch (error) {
        console.error("Error deleting maintenance request:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getMaintenanceRequests,
    updateMaintenanceRequest,
    deleteMaintenanceRequest,
};

// // In: tenant_manage/backend/controllers/landlord/maintenanceController.js

// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const LogEntry = require('../../models/LogEntry'); // 1. Import the LogEntry model


// // @desc    Get all maintenance requests for a landlord's organization
// const getMaintenanceRequests = async (req, res) => {
//     try {
//         // --- FIX: Simplified to a direct populate since 'property' is on the model ---
//         const requests = await MaintenanceRequest.find({ organization: req.user.organization })
//             .sort({ createdAt: -1 })
//             .populate('tenant', 'name email')
//             .populate('property', 'address'); // This now works because your model requires it.

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
//         const request = await MaintenanceRequest.findById(req.params.id);

//         if (!request) { /* ... */ }
//         if (request.organization.toString() !== req.user.organization.toString()) { /* ... */ }
        
//         request.status = status;
//         await request.save();

//         // --- 2. ADD THIS LOGIC ---
//         // Create a log entry after successfully updating the status
//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'Maintenance',
//             message: `Updated maintenance request status to "${status}"`,
//             property: request.property,
//             tenant: request.tenant,
//         });
//         // --- END OF NEW LOGIC ---

//         const populatedRequest = await MaintenanceRequest.findById(request._id)
//             .populate('tenant', 'name email')
//             .populate('property', 'address');

//         res.status(200).json(populatedRequest);
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
//         const request = await MaintenanceRequest.findById(req.params.id);

//         if (!request) { return res.status(404).json({ message: 'Request not found' }); }
//         if (request.organization.toString() !== req.user.organization.toString()) {
//             return res.status(403).json({ message: 'User not authorized' });
//         }

//         await MaintenanceRequest.findByIdAndDelete(req.params.id);
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

// // tenant_manage/backend/controllers/landlord/maintenanceController.js

// const MaintenanceRequest = require('../../models/MaintenanceRequest');

// // @desc    Get all maintenance requests for a landlord's organization
// // @route   GET /api/landlord/maintenance-requests
// // @access  Private (Landlord Only)
// const getMaintenanceRequests = async (req, res) => {
//     try {
//         // Correctly populates property details through the lease
//         const requests = await MaintenanceRequest.find({ organization: req.user.organization })
//             .sort({ createdAt: -1 })
//             .populate('tenant', 'name email')
//             .populate({
//                 path: 'lease',
//                 select: 'property -_id',
//                 populate: {
//                     path: 'property',
//                     select: 'address -_id'
//                 }
//             });
        
//         // This step simplifies the data structure for the frontend
//         const formattedRequests = requests.map(req => ({
//             _id: req._id,
//             description: req.description,
//             status: req.status,
//             createdAt: req.createdAt,
//             tenant: req.tenant,
//             property: req.lease?.property,
//         }));

//         res.status(200).json(formattedRequests);
//     } catch (error) {
//         console.error("Error fetching maintenance requests:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Update a maintenance request's status
// // @route   PUT /api/landlord/maintenance-requests/:id
// // @access  Private (Landlord Only)
// const updateMaintenanceRequest = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const request = await MaintenanceRequest.findById(req.params.id);

//         if (!request) { return res.status(404).json({ message: 'Request not found' }); }
//         if (request.organization.toString() !== req.user.organization.toString()) {
//             return res.status(403).json({ message: 'User not authorized' });
//         }
        
//         request.status = status;
//         await request.save();

//         // Populates the request after saving to ensure the frontend receives the full, correct data
//         const populatedRequest = await MaintenanceRequest.findById(request._id)
//             .populate('tenant', 'name email')
//             .populate({ path: 'lease', select: 'property -_id', populate: { path: 'property', select: 'address -_id' } });
        
//         // Formats the response to be consistent
//         const formattedRequest = {
//             _id: populatedRequest._id,
//             description: populatedRequest.description,
//             status: populatedRequest.status,
//             createdAt: populatedRequest.createdAt,
//             tenant: populatedRequest.tenant,
//             property: populatedRequest.lease?.property,
//         };

//         res.status(200).json(formattedRequest);
//     } catch (error) {
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ message: 'Validation Error: Invalid status value provided.' });
//         }
//         console.error("Error updating maintenance request:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Delete a maintenance request
// // @route   DELETE /api/landlord/maintenance-requests/:id
// // @access  Private (Landlord Only)
// const deleteMaintenanceRequest = async (req, res) => {
//     try {
//         const request = await MaintenanceRequest.findById(req.params.id);

//         if (!request) { return res.status(404).json({ message: 'Request not found' }); }
//         if (request.organization.toString() !== req.user.organization.toString()) {
//             return res.status(403).json({ message: 'User not authorized' });
//         }

//         await MaintenanceRequest.findByIdAndDelete(req.params.id);
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
