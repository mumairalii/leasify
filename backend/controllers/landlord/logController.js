// // tenant_manage/backend/controllers/landlord/logController.js

// const LogEntry = require('../../models/LogEntry');


// const getLogs = async (req, res) => {
//     try {
//         const logs = await LogEntry.find({ organization: req.user.organization })
//             .sort({ createdAt: -1 })
//             .limit(20)
//             // --- ADD THIS POPULATE LOGIC ---
//             .populate('tenant', 'name')
//             .populate('property', 'address.street');

//         res.status(200).json(logs);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Create a new manual log entry (e.g., a phone call)
// // @route   POST /api/landlord/logs
// const createLog = async (req, res) => {
//     try {
//         const { message, type = 'Communication', tenant, property } = req.body;

//         if (!message) {
//             return res.status(400).json({ message: 'Message is required' });
//         }

//         const newLog = await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name, // The logged-in landlord is the actor
//             message,
//             type,
//             tenant,
//             property,
//         });

//         res.status(201).json(newLog);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getLogs, createLog };

const asyncHandler = require('express-async-handler');
const LogEntry = require('../../models/LogEntry');

/**
 * @desc    Get all log entries for the landlord's organization
 * @route   GET /api/landlord/logs
 * @access  Private (Landlord Only)
 */
const getLogs = asyncHandler(async (req, res) => {
    const logs = await LogEntry.find({ organization: req.user.organization })
        .sort({ createdAt: -1 })
        .limit(100) // Limit the number of logs returned
        .populate('actor', 'name')
        .populate('tenant', 'name')
        .populate('property', 'address.street');

    res.status(200).json(logs);
});

/**
 * @desc    Create a new manual log entry (e.g., communication)
 * @route   POST /api/landlord/logs
 * @access  Private (Landlord Only)
 */
const createLog = asyncHandler(async (req, res) => {
    const { message, type, tenant, property } = req.body;

    if (!message || !type) {
        res.status(400);
        throw new Error('Log message and type are required');
    }

    const logEntry = await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.id,
        message,
        type,
        tenant,
        property,
    });

    // Populate the new entry to return full details to the frontend
    const populatedLog = await LogEntry.findById(logEntry._id)
        .populate('actor', 'name')
        .populate('tenant', 'name')
        .populate('property', 'address.street');

    res.status(201).json(populatedLog);
});

module.exports = {
    getLogs,
    createLog,
};