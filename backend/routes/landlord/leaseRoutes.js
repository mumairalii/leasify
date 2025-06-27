// backend/routes/landlord/leaseRoutes.js

const express = require('express');
const router = express.Router();
const { body } = require('express-validator'); // <-- 1. Import the validator
const { assignTenantToLease } = require('../../controllers/landlord/leaseController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

// 2. Define the validation rules array
const assignLeaseValidationRules = [
    body('propertyId', 'Property ID is required').not().isEmpty().isMongoId(),
    body('tenantEmail', 'A valid tenant email is required').isEmail().normalizeEmail(),
    body('startDate', 'A valid start date is required').isISO8601().toDate(),
    body('endDate', 'A valid end date is required').isISO8601().toDate(),
    body('rentAmount', 'Rent amount must be a number').isNumeric()
];

// 3. Add the validation rules array to your route
router.post(
    '/assign',
    assignLeaseValidationRules, // <-- The only new line here
    protect,
    isLandlord,
    assignTenantToLease
);

module.exports = router;
// const express = require('express');
// const router = express.Router();
// const { assignTenantToLease } = require('../../controllers/landlord/leaseController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// // This entire route is protected and for landlords only.
// router.post('/assign', protect, isLandlord, assignTenantToLease);

// module.exports = router;