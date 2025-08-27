const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
    createProperty,
    getProperties,
    updateProperty,
    deleteProperty,
    getPropertyById,
} = require('../../controllers/landlord/propertyController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

router.use(protect, isLandlord);

// --- Validation rules for CREATING a property ---
const validatePropertyCreation = [
    body('address.street', 'Street is required').not().isEmpty().trim().escape(),
    body('address.city', 'City is required').not().isEmpty().trim().escape(),
    body('address.state', 'State is required').not().isEmpty().trim().escape(),
    body('address.zipCode', 'Zip code is required').not().isEmpty().trim().escape(),
    body('rentAmount', 'Rent amount is required and must be a number').not().isEmpty().isNumeric(),
    body('description', 'Description must be a string').optional().isString().trim().escape(),
    body('propertyType', 'Invalid property type').optional().isIn(['Apartment', 'House', 'Condo', 'Townhouse', 'Other']),
    body('bedrooms', 'Bedrooms must be a number').optional({ checkFalsy: true }).isNumeric(),
    body('bathrooms', 'Bathrooms must be a number').optional({ checkFalsy: true }).isNumeric(),
    body('isListed', 'isListed must be a boolean').optional().isBoolean(),
];

// --- Validation rules for UPDATING a property ---
const validatePropertyUpdate = [
    param('id', 'Invalid Property ID').isMongoId(),
    body('address.street').optional().isString().trim().escape(),
    body('address.city').optional().isString().trim().escape(),
    body('address.state').optional().isString().trim().escape(),
    body('address.zipCode').optional().isString().trim().escape(),
    body('rentAmount').optional().isNumeric().withMessage('Rent amount must be a number'),
    body('description').optional().isString().trim().escape(),
    body('propertyType').optional().isIn(['Apartment', 'House', 'Condo', 'Townhouse', 'Other']),
    body('bedrooms').optional({ checkFalsy: true }).isNumeric(),
    body('bathrooms').optional({ checkFalsy: true }).isNumeric(),
    body('isListed').optional().isBoolean(),
];

// GET all properties and POST a new property
router.route('/')
    .get(getProperties)
    .post(validatePropertyCreation, createProperty);

// GET, PUT, and DELETE a specific property by ID
router.route('/:id')
    .get(getPropertyById) // <-- MOVED TO HERE
    .put(validatePropertyUpdate, updateProperty)
    .delete(deleteProperty);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { body, param } = require('express-validator'); // 1. Import 'param' for URL validation
// const { 
//     createProperty, 
//     getProperties, 
//     updateProperty, 
//     deleteProperty, 
//     getPropertyById,
// } = require('../../controllers/landlord/propertyController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware'); // Import from the correct file


// router.use(protect, isLandlord);

// // --- Validation rules for CREATING a property ---
// const validatePropertyCreation = [
//     body('address.street', 'Street is required').not().isEmpty().trim().escape(),
//     body('address.city', 'City is required').not().isEmpty().trim().escape(),
//     body('address.state', 'State is required').not().isEmpty().trim().escape(),
//     body('address.zipCode', 'Zip code is required').not().isEmpty().trim().escape(),
//     body('rentAmount', 'Rent amount is required and must be a number').not().isEmpty().isNumeric(),
//     body('description', 'Description must be a string').optional().isString().trim().escape(),
//     body('propertyType', 'Invalid property type').optional().isIn(['Apartment', 'House', 'Condo', 'Townhouse', 'Other']),
//     body('bedrooms', 'Bedrooms must be a number').optional({ checkFalsy: true }).isNumeric(),
//     body('bathrooms', 'Bathrooms must be a number').optional({ checkFalsy: true }).isNumeric(),
//     body('isListed', 'isListed must be a boolean').optional().isBoolean(),
// ];

// // --- 2. Validation rules for UPDATING a property ---
// // All fields are optional. We also validate the ':id' parameter in the URL.
// const validatePropertyUpdate = [
//     param('id', 'Invalid Property ID').isMongoId(),
//     body('address.street').optional().isString().trim().escape(),
//     body('address.city').optional().isString().trim().escape(),
//     body('address.state').optional().isString().trim().escape(),
//     body('address.zipCode').optional().isString().trim().escape(),
//     body('rentAmount').optional().isNumeric().withMessage('Rent amount must be a number'),
//     body('description').optional().isString().trim().escape(),
//     body('propertyType').optional().isIn(['Apartment', 'House', 'Condo', 'Townhouse', 'Other']),
//     body('bedrooms').optional({ checkFalsy: true }).isNumeric(),
//     body('bathrooms').optional({ checkFalsy: true }).isNumeric(),
//     body('isListed').optional().isBoolean(),
// ];

// // GET all and POST new property
// router.route('/')
//     .get(getProperties)
//     .get(getPropertyById)
//     .post(validatePropertyCreation, createProperty);

// // Routes for a specific property by ID
// router.route('/:id')
//     // 3. Apply the new validation middleware to the PUT route
//     .put(validatePropertyUpdate, updateProperty)
//     .delete(deleteProperty);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { createProperty, getProperties, updateProperty, deleteProperty } = require('../../controllers/landlord/propertyController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// // This line applies security to all routes defined in this file
// router.use(protect, isLandlord);

// // Handles GET all and POST create for the base URL
// router.route('/').get(getProperties).post(createProperty);

// // Handles PUT update and DELETE for a specific property ID
// router.route('/:id').put(updateProperty).delete(deleteProperty);

// module.exports = router;

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