const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
        index: true, // Index this field for fast lookups
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
    },
    isListed: {
        type: Boolean,
        default: false,
    },
    imageUrl: {
        type: String,
        default: '', // Default to an empty string
    },
    // Other fields: bedrooms, bathrooms, squareFootage, images (array of strings)
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);