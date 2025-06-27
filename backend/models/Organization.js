const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Future fields could include subscription details, billing info, etc.
}, { timestamps: true });

module.exports = mongoose.model('Organization', organizationSchema);