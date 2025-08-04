const asyncHandler = require('express-async-handler');
const LogEntry = require('../../models/LogEntry');

/**
 * @desc    Get all log entries for the organization, with populated details.
 * @route   GET /api/landlord/logs
 * @access  Private (Landlord Only)
 */
const getLogs = asyncHandler(async (req, res) => {
    const logs = await LogEntry.find({ organization: req.user.organization })
        .sort({ createdAt: -1 })
        .limit(100) // Limit the number of logs returned for performance
        .populate('tenant', 'name') // Populates the 'name' from the User model via the 'tenant' field
        
        // --- THIS IS THE FIX ---
        // We now populate the entire 'address' object from the Property model.
        // This is a more robust way to ensure the nested data is sent correctly.
        .populate('property', 'address');

    res.status(200).json(logs);
});

/**
 * @desc    Create a new communication log entry
 * @route   POST /api/landlord/logs
 * @access  Private (Landlord Only)
 */
const createLog = asyncHandler(async (req, res) => {
    // Assuming you have validation middleware for this route
    const { tenant, property, message } = req.body;

    const newLog = await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'Communication',
        tenant,
        property,
        message,
    });

    // Populate the new log before sending it back, so the UI can display it instantly
    const populatedLog = await LogEntry.findById(newLog._id)
        .populate('tenant', 'name')
        .populate('property', 'address');

    res.status(201).json(populatedLog);
});


module.exports = {
    getLogs,
    createLog,
};

// const asyncHandler = require('express-async-handler');
// const LogEntry = require('../../models/LogEntry');

// /**
//  * @desc    Get all log entries for the landlord's organization
//  * @route   GET /api/landlord/logs
//  * @access  Private (Landlord Only)
//  */
// const getLogs = asyncHandler(async (req, res) => {
//     const logs = await LogEntry.find({ organization: req.user.organization })
//         .sort({ createdAt: -1 })
//         .limit(100) // Limit the number of logs returned
//         .populate('actor', 'name')
//         .populate('tenant', 'name')
//         .populate('property', 'address.street');

//     res.status(200).json(logs);
// });

// /**
//  * @desc    Create a new manual log entry (e.g., communication)
//  * @route   POST /api/landlord/logs
//  * @access  Private (Landlord Only)
//  */
// const createLog = asyncHandler(async (req, res) => {
//     const { message, type, tenant, property } = req.body;

//     if (!message || !type) {
//         res.status(400);
//         throw new Error('Log message and type are required');
//     }

//     const logEntry = await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.id,
//         message,
//         type,
//         tenant,
//         property,
//     });

//     // Populate the new entry to return full details to the frontend
//     const populatedLog = await LogEntry.findById(logEntry._id)
//         .populate('actor', 'name')
//         .populate('tenant', 'name')
//         .populate('property', 'address.street');

//     res.status(201).json(populatedLog);
// });

// module.exports = {
//     getLogs,
//     createLog,
// };