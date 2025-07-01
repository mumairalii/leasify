const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        index: true,
    },
    // --- THIS IS THE CRUCIAL ADDITION ---
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address: {
        street: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        zipCode: { type: String, required: true, trim: true },
    },
    rentAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    isListed: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        default: '',
    },
    // --- ADDITIONAL USEFUL FIELDS ---
    description: {
        type: String,
        trim: true,
    },
    propertyType: {
        type: String,
        enum: ['Apartment', 'House', 'Condo', 'Townhouse', 'Other'],
        default: 'Other',
    },
    bedrooms: {
        type: Number,
        min: 0,
        default: 0,
    },
    bathrooms: {
        type: Number,
        min: 0,
        default: 0,
    },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);

// const mongoose = require('mongoose');

// const propertySchema = new mongoose.Schema({
//     organization: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Organization',
//         required: true,
//         index: true, // Index this field for fast lookups
//     },
//     address: {
//         street: { type: String, required: true, trim: true },
//         city: { type: String, required: true, trim: true },
//         state: { type: String, required: true, trim: true },
//         zipCode: { type: String, required: true, trim: true },
//     },
//     rentAmount: {
//         type: Number,
//         required: true,
//     },
//     isListed: {
//         type: Boolean,
//         default: false,
//     },
//     imageUrl: {
//         type: String,
//         default: '', // Default to an empty string
//     },
//     // Other fields: bedrooms, bathrooms, squareFootage, images (array of strings)
// }, { timestamps: true });

// module.exports = mongoose.model('Property', propertySchema);