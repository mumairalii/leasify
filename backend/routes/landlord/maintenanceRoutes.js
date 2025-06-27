// backend/routes/landlord/maintenanceRoutes.js

const express = require('express');
const router = express.Router();
const { getMaintenanceRequests, updateMaintenanceRequest, deleteMaintenanceRequest } = require('../../controllers/landlord/maintenanceController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

// Apply security middleware to all routes in this file
router.use(protect, isLandlord);

// Route to get all requests for the landlord
router.route('/').get(getMaintenanceRequests);

// Routes to update or delete a specific request by its ID
router.route('/:id').put(updateMaintenanceRequest).delete(deleteMaintenanceRequest);

module.exports = router;