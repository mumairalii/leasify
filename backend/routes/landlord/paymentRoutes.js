const express = require('express');
const router = express.Router();
const { logOfflinePayment, getPaymentsForLease } = require('../../controllers/landlord/paymentController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');
// This line ensures all routes in this file are protected and for landlords only.
router.use(protect, isLandlord);

// This line defines the POST route for /log-offline
router.post('/log-offline', logOfflinePayment);
router.get('/lease/:leaseId', getPaymentsForLease);
module.exports = router;

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