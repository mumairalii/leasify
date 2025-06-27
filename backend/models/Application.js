// tenant_manage/backend/models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending',
    },
    message: { type: String, trim: true }, // Optional message from the tenant
    // --- ADD THESE NEW FIELDS ---
    requestedStartDate: { type: Date },
    requestedEndDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);