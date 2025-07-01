const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
    getMaintenanceRequests,
    updateMaintenanceRequest,
    deleteMaintenanceRequest
} = require('../../controllers/landlord/maintenanceController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware'); // Import from the correct file


router.use(protect, isLandlord);

// Validation rules for updating a request's status
const validateRequestUpdate = [
    param('id', 'A valid request ID is required').isMongoId(),
    body('status', 'A valid status is required').isIn(['Pending', 'In Progress', 'Completed'])
];

router.route('/')
    .get(getMaintenanceRequests)
    .delete(deleteMaintenanceRequest); // Note: Assuming delete might be added later

// Apply validation to the PUT route
router.route('/:id')
    .put(validateRequestUpdate, updateMaintenanceRequest)
    .delete(deleteMaintenanceRequest); // Assuming delete by ID might also be a route

module.exports = router;

// // backend/routes/landlord/maintenanceRoutes.js

// const express = require('express');
// const router = express.Router();
// const { getMaintenanceRequests, updateMaintenanceRequest, deleteMaintenanceRequest } = require('../../controllers/landlord/maintenanceController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// // Apply security middleware to all routes in this file
// router.use(protect, isLandlord);

// // Route to get all requests for the landlord
// router.route('/').get(getMaintenanceRequests);

// // Routes to update or delete a specific request by its ID
// router.route('/:id').put(updateMaintenanceRequest).delete(deleteMaintenanceRequest);

// module.exports = router;