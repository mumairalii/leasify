// tenant_manage/backend/routes/applicationRoutes.js

const express = require('express');
const router = express.Router();
// --- FIX: Correct the path to go up one directory first with '../' ---
const { createApplication, getApplications, updateApplicationStatus } = require('../controllers/landlord/applicationController');
const { protect } = require('../middleware/authMiddleware');
const { isLandlord, isTenant } = require('../middleware/roleMiddleware');

// A tenant can submit an application for a property
router.post('/', protect, isTenant, createApplication);

// A landlord can get all pending applications for their properties
router.get('/', protect, isLandlord, getApplications);

// A landlord can update the status of an application (Approve/Reject)
router.put('/:id', protect, isLandlord, updateApplicationStatus);

module.exports = router;