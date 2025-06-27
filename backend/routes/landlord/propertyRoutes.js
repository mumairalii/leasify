const express = require('express');
const router = express.Router();
const { createProperty, getProperties, updateProperty, deleteProperty } = require('../../controllers/landlord/propertyController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

// This line applies security to all routes defined in this file
router.use(protect, isLandlord);

// Handles GET all and POST create for the base URL
router.route('/').get(getProperties).post(createProperty);

// Handles PUT update and DELETE for a specific property ID
router.route('/:id').put(updateProperty).delete(deleteProperty);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { createProperty, getProperties, updateProperty, deleteProperty } = require('../../controllers/landlord/propertyController'); // <-- 1. Import new functions
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// // Apply middleware to all routes in this file
// router.use(protect, isLandlord);

// // Routes for the collection (e.g., /api/landlord/properties)
// router.route('/').post(createProperty).get(getProperties);

// // --- ADD THIS ---
// // Routes for a specific item (e.g., /api/landlord/properties/667d1a...)
// router.route('/:id').put(updateProperty).delete(deleteProperty); // <-- 2. Add PUT and DELETE routes

// module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { createProperty, getProperties } = require('../../controllers/landlord/propertyController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// // Apply middleware to all routes in this file
// router.use(protect, isLandlord);

// router.route('/').post(createProperty).get(getProperties);

// module.exports = router;