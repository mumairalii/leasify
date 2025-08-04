// tenant_manage/backend/routes/landlord/maintenanceRoutes.js
const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
    getLandlordRequests,
    updateRequestStatus, // Corrected to match the controller export
} = require('../../controllers/landlord/maintenanceController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

router.use(protect, isLandlord);

const validateRequestUpdate = [
    param('id', 'A valid request ID is required').isMongoId(),
    body('status', 'A valid status is required').isIn(['Pending', 'In Progress', 'Completed'])
];

// GET all requests for the landlord
router.route('/').get(getLandlordRequests);

// PUT to update a specific request
router.route('/:id').put(validateRequestUpdate, updateRequestStatus);

// The .delete() route has been removed.

module.exports = router;