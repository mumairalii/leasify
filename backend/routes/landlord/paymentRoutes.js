const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { logOfflinePayment, getPaymentsForLease } = require('../../controllers/landlord/paymentController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

// All routes here are for landlords only
router.use(protect, isLandlord);

// Validation rules for logging an offline payment
const validateOfflinePayment = [
    body('leaseId')
        .isMongoId()
        .withMessage('A valid lease ID is required'),
    body('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be a positive number')
        .toFloat(),
    body('paymentDate')
        .isISO8601()
        .withMessage('A valid payment date is required')
        .toDate()
        .custom((value) => {
            if (value > new Date()) {
                throw new Error('Payment date cannot be in the future');
            }
            return true;
        }),
    body('method')
        .isIn(['Manual - Cash', 'Manual - Check', 'Manual - Other'])
        .withMessage('Invalid payment method'),
    body('notes')
        .optional()
        .isString()
        .trim()
        .escape()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters')
];

// Routes
router.post('/log-offline', validateOfflinePayment, logOfflinePayment);
router.get('/lease/:leaseId', getPaymentsForLease);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const { logOfflinePayment, getPaymentsForLease } = require('../../controllers/landlord/paymentController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware'); // Import from the correct file

// // All routes here are for landlords only
// router.use(protect, isLandlord);

// // --- Validation rules for logging an offline payment ---
// const validateOfflinePayment = [
//     body('leaseId', 'A valid lease ID is required').isMongoId(),
//     body('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
//     body('paymentDate', 'A valid payment date is required').isISO8601().toDate(),
//     body('method', 'Payment method is required').isIn(['Cash', 'Check', 'Bank Transfer', 'Other']),
//     body('notes').optional().isString().trim().escape()
// ];

// // Apply validation middleware to the log-offline route
// router.post('/log-offline', validateOfflinePayment, logOfflinePayment);

// router.get('/lease/:leaseId', getPaymentsForLease);

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { logOfflinePayment, getPaymentsForLease } = require('../../controllers/landlord/paymentController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');
// // This line ensures all routes in this file are protected and for landlords only.
// router.use(protect, isLandlord);

// // This line defines the POST route for /log-offline
// router.post('/log-offline', logOfflinePayment);
// router.get('/lease/:leaseId', getPaymentsForLease);
// module.exports = router;

// // tenant_manage/backend/routes/landlord/paymentRoutes.js

// const express = require('express');
// const router = express.Router();
// const { logOfflinePayment } = require('../../controllers/landlord/paymentController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// // All routes in this file are for landlords only.
// router.use(protect, isLandlord);

// router.post('/log-offline', logOfflinePayment);

// module.exports = router;

// // tenant_manage/backend/routes/landlord/paymentRoutes.js
// const express = require('express');
// const router = express.Router();
// const { createPaymentIntent, logOfflinePayment } = require('../../controllers/landlord/paymentController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// // Anyone logged in can create a payment intent (for themselves)
// router.post('/create-payment-intent', protect, createPaymentIntent);

// // Only a landlord can log an offline payment
// router.post('/log-offline', protect, isLandlord, logOfflinePayment);

// module.exports = router;

// // tenant_manage/backend/routes/landlord/paymentRoutes.js

// const express = require('express');
// const router = express.Router();
// const { createPaymentIntent, handleStripeWebhook} = require('../../controllers/landlord/paymentController');
// const { protect } = require('../../middleware/authMiddleware');

// // This route is protected, ensuring only logged-in users can create payments.
// // router.post('/create-payment-intent', protect, createPaymentIntent);

// router.post('/create-payment-intent', protect, createPaymentIntent);

// // IMPORTANT: This route is for the webhook and is defined here but used specially in server.js
// router.post('/stripe-webhook', handleStripeWebhook);
// module.exports = router;