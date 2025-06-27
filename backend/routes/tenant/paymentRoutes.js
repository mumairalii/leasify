/// tenant_manage/backend/routes/tenant/paymentRoutes.js

const express = require('express');
const router = express.Router();

// Note the correct paths to the two different controllers
const { createPaymentIntent } = require('../../controllers/landlord/paymentController');
const { getMyPayments } = require('../../controllers/tenant/paymentController');

// Correctly import the middleware functions
const { protect } = require('../../middleware/authMiddleware');
const { isTenant } = require('../../middleware/roleMiddleware'); // Corrected import

// This route allows a logged-in tenant to create a payment session
router.post('/create-payment-intent', protect, isTenant, createPaymentIntent);

// This route allows a logged-in tenant to get their own payment history
router.get('/my-payments', protect, isTenant, getMyPayments);

module.exports = router;
// // tenant_manage/backend/routes/tenant/paymentRoutes.js

// const express = require('express');
// const router = express.Router();

// // Note the correct paths to the two different controllers
// const { createPaymentIntent } = require('../../controllers/landlord/paymentController');
// const { getMyPayments } = require('../../controllers/tenant/paymentController');

// const { protect, isTenant } = require('../../middleware/authMiddleware');

// // This route allows a logged-in tenant to create a payment session
// router.post('/create-payment-intent', protect, isTenant, createPaymentIntent);

// // This route allows a logged-in tenant to get their own payment history
// router.get('/my-payments', protect, isTenant, getMyPayments);

// module.exports = router;
// // tenant_manage/backend/routes/tenant/paymentRoutes.js
// const express = require('express');
// const router = express.Router();
// const { createPaymentIntent } = require('../../controllers/landlord/paymentController');
// const { getMyPayments } = require('../../controllers/tenant/paymentController'); // 1. Import new controller
// const { protect, isTenant } = require('../../middleware/authMiddleware');

// router.post('/create-payment-intent', protect, isTenant, createPaymentIntent);

// // 2. ADD THIS NEW ROUTE
// router.get('/my-payments', protect, isTenant, getMyPayments);

// module.exports = router;
// // tenant_manage/backend/routes/tenant/paymentRoutes.js

// const express = require('express');
// const router = express.Router();
// const { createPaymentIntent } = require('../../controllers/landlord/paymentController'); // We can still use the controller function
// const { protect } = require('../../middleware/authMiddleware');

// // Any logged-in user can create a payment intent for themselves.
// router.post('/create-payment-intent', protect, createPaymentIntent);

// module.exports = router;