// tenant_manage/backend/models/Application.js
const mongoose = require('mongoose');

/**
 * Represents a user's application for a specific property.
 * This schema links a user (the applicant) to a property they wish to rent,
 * capturing the initial request before it becomes a formal lease.
 */
const applicationSchema = new mongoose.Schema({
    property: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Property', 
        required: true 
    },
    // This field represents the user who is applying for the property.
    applicant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    landlord: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    organization: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Organization', 
        required: true,
        index: true // Index for faster lookups by organization
    },
    status: {
        type: String,
        // The enum is expanded to support the full lifecycle of an application.
        enum: ['Pending', 'Approved', 'Denied', 'Completed'],
        default: 'Pending',
    },
    // Optional message from the applicant to the landlord.
    message: { 
        type: String, 
        trim: true 
    },
    // Optional fields for the applicant to specify their desired lease term.
    requestedStartDate: { 
        type: Date 
    },
    requestedEndDate: { 
        type: Date 
    },
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);

// // tenant_manage/backend/models/Application.js
// const mongoose = require('mongoose');

// const applicationSchema = new mongoose.Schema({
//     property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
//     tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     landlord: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
//     status: {
//         type: String,
//         enum: ['Pending', 'Approved', 'Rejected'],
//         default: 'Pending',
//     },
//     message: { type: String, trim: true }, // Optional message from the tenant
//     // --- ADD THESE NEW FIELDS ---
//     requestedStartDate: { type: Date },
//     requestedEndDate: { type: Date },
// }, { timestamps: true });

// module.exports = mongoose.model('Application', applicationSchema);