// tenant_manage/backend/controllers/landlord/logController.js

const LogEntry = require('../../models/LogEntry');

// // @desc    Get all logs for the landlord's organization
// // @route   GET /api/landlord/logs
// const getLogs = async (req, res) => {
//     try {
//         const logs = await LogEntry.find({ organization: req.user.organization })
//             .sort({ createdAt: -1 })
//             .limit(20); // Limit to the most recent 20 for the dashboard
//         res.status(200).json(logs);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };
const getLogs = async (req, res) => {
    try {
        const logs = await LogEntry.find({ organization: req.user.organization })
            .sort({ createdAt: -1 })
            .limit(20)
            // --- ADD THIS POPULATE LOGIC ---
            .populate('tenant', 'name')
            .populate('property', 'address.street');

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new manual log entry (e.g., a phone call)
// @route   POST /api/landlord/logs
const createLog = async (req, res) => {
    try {
        const { message, type = 'Communication', tenant, property } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const newLog = await LogEntry.create({
            organization: req.user.organization,
            actor: req.user.name, // The logged-in landlord is the actor
            message,
            type,
            tenant,
            property,
        });

        res.status(201).json(newLog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getLogs, createLog };