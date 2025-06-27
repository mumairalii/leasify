// tenant_manage/backend/models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    lease: { type: mongoose.Schema.Types.ObjectId, ref: 'Lease', required: true },
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, required: true, default: Date.now },
    method: {
        type: String,
        enum: ['Stripe Online', 'Manual - Cash', 'Manual - Check', 'Manual - Other'],
        required: true,
    },
    notes: { type: String, trim: true },
    // Add a field to store the Stripe ID for reconciliation
    stripePaymentIntentId: { type: String, unique: true, sparse: true },
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

// // tenant_manage/backend/models/Payment.js

// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//     property: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Property',
//         required: true,
//     },
//     lease: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Lease',
//         required: true,
//     },
//     tenant: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true,
//     },
//     organization: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Organization',
//         required: true,
//         index: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//     },
//     paymentDate: {
//         type: Date,
//         required: true,
//         default: Date.now,
//     },
//     method: {
//         type: String,
//         enum: ['Bank Transfer', 'Credit Card', 'Cash', 'Other'],
//         default: 'Other',
//     },
//     notes: {
//         type: String,
//         trim: true,
//     },
// }, { timestamps: true });

// module.exports = mongoose.model('Payment', paymentSchema);