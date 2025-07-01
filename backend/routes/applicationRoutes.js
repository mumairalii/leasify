const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const {
    createApplication,
    getApplications,
    updateApplicationStatus
} = require('../controllers/landlord/applicationController');

// Validation rules for a new application
const validateApplicationCreation = [
    body('propertyId', 'A valid property ID is required').isMongoId(),
    body('message', 'Message must be a string').optional().isString().trim().escape()
];

// Validation rules for updating an application's status
const validateApplicationUpdate = [
    param('id', 'A valid application ID is required').isMongoId(),
    body('status', 'Status must be either "Approved" or "Rejected"').isIn(['Approved', 'Rejected'])
];

// --- Route Definitions ---

// A tenant creates a new application
router.post('/', protect, validateApplicationCreation, createApplication);

// A landlord gets all pending applications
router.get('/', protect, getApplications);

// A landlord updates the status of an application
router.put('/:id', protect, validateApplicationUpdate, updateApplicationStatus);

module.exports = router;

// // tenant_manage/backend/routes/applicationRoutes.js

// const express = require('express');
// const router = express.Router();
// // --- FIX: Correct the path to go up one directory first with '../' ---
// const { createApplication, getApplications, updateApplicationStatus } = require('../controllers/landlord/applicationController');
// const { protect } = require('../middleware/authMiddleware');
// const { isLandlord, isTenant } = require('../middleware/roleMiddleware');

// // A tenant can submit an application for a property
// router.post('/', protect, isTenant, createApplication);

// // A landlord can get all pending applications for their properties
// router.get('/', protect, isLandlord, getApplications);

// // A landlord can update the status of an application (Approve/Reject)
// router.put('/:id', protect, isLandlord, updateApplicationStatus);

// module.exports = router;