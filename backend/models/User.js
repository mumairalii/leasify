const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures no two users can have the same email
        lowercase: true, // Stores emails in a consistent format
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['landlord', 'tenant'], // Restricts the role to one of these two values
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        // This is ONLY populated if the user's role is 'landlord'
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);