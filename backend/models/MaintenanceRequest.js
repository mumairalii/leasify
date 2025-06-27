const mongoose = require('mongoose');

const maintenanceRequestSchema = new mongoose.Schema({
    lease: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lease',
        required: true,
    },
    // --- THIS IS THE CRUCIAL ADDITION/FIX ---
    // We must have a direct reference to the Property model to populate it.
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        index: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed'],
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);

// const mongoose = require('mongoose');

// const maintenanceRequestSchema = new mongoose.Schema({
//     lease: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Lease',
//         required: true,
//     },
//     tenant: { // Denormalized for easy lookup
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     organization: { // Denormalized for easy lookup
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Organization',
//         required: true,
//         index: true,
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     status: {
//         type: String,
//         enum: ['Pending', 'In Progress', 'Completed'],
//         default: 'Pending',
//     },
//     // We could add an array of comments or logs here
// }, { timestamps: true });

// module.exports = mongoose.model('MaintenanceRequest', maintenanceRequestSchema);