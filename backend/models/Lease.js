const mongoose = require('mongoose');

const leaseSchema = new mongoose.Schema({
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
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    rentAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active',
    },
    // We could add an array of payment records here in the future
}, { timestamps: true });

module.exports = mongoose.model('Lease', leaseSchema);