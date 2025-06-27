// tenant_manage/backend/models/LogEntry.js

const mongoose = require('mongoose');

const logEntrySchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        index: true,
    },
    // The person or system performing the action
    actor: {
        type: String,
        required: true,
    },
    // The type of event, for easy filtering
    type: {
        type: String,
        enum: ['Communication', 'System', 'Payment', 'Maintenance', 'Lease'],
        required: true,
    },
    // The main content of the log
    message: {
        type: String,
        required: true,
    },
    // Optional links to other documents for context
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
    }
}, { timestamps: true });

module.exports = mongoose.model('LogEntry', logEntrySchema);