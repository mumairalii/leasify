const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { isLandlord } = require('../middleware/roleMiddleware');

const {
    createApplication,
    getAllApplications,
    updateApplicationStatus,
    getApplicationSummary,
} = require('../controllers/landlord/applicationController');

// --- LANDLORD ROUTES ---
// All routes in this section are protected and require a landlord role.
const landlordRouter = express.Router();
landlordRouter.use(protect, isLandlord);

// GET /api/landlord/applications/summary
landlordRouter.get('/summary', getApplicationSummary);

// GET /api/landlord/applications/
landlordRouter.get('/', getAllApplications);

// PUT /api/landlord/applications/:id
const validateStatusUpdate = [param('id').isMongoId(), body('status').isIn(['Approved', 'Denied'])];
landlordRouter.put('/:id', validateStatusUpdate, updateApplicationStatus);


// --- TENANT/PUBLIC ROUTES ---
// POST /api/applications/
const validateCreation = [body('propertyId').isMongoId(), body('message').optional().isString()];
// This route is protected to ensure only logged-in users can apply.
router.post('/', protect, validateCreation, createApplication);


// --- Final Mounting ---
// Mount the landlord-specific routes under a dedicated path.
router.use('/landlord', landlordRouter);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { body, param } = require('express-validator');
// const { protect } = require('../middleware/authMiddleware');
// // const { isLandlord } = require('../../middleware/roleMiddleware'); // Import from the correct file
// const {isLandlord} =require ('../middleware/roleMiddleware')

// const {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
//     getApplicationSummary,
// } = require('../controllers/landlord/applicationController');

// router.use(protect, isLandlord);
// // Validation rules for a new application
// const validateApplicationCreation = [
//     body('propertyId', 'A valid property ID is required').isMongoId(),
//     body('message', 'Message must be a string').optional().isString().trim().escape()
// ];

// // Validation rules for updating an application's status
// const validateApplicationUpdate = [
//     param('id', 'A valid application ID is required').isMongoId(),
//     body('status', 'Status must be either "Approved" or "Rejected"').isIn(['Approved', 'Rejected'])
// ];

// // --- Route Definitions ---

// // A tenant creates a new application
// router.post('/', protect, validateApplicationCreation, createApplication);

// // A landlord gets all pending applications
// router.get('/', protect, getApplications);

// // A landlord updates the status of an application
// router.put('/:id', protect, validateApplicationUpdate, updateApplicationStatus);
// router.get('/summary', getApplicationSummary);

// module.exports = router;

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