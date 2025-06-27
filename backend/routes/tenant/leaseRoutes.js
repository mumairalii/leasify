// const express = require('express');
// const router = express.Router();
// const { getMyLease } = require('../../controllers/tenant/leaseController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isTenant } = require('../../middleware/roleMiddleware');

// router.get('/my-lease', protect, isTenant, getMyLease);

// module.exports = router;
const express = require('express');
const router = express.Router();
const { getMyLease } = require('../../controllers/tenant/leaseController');
const { protect } = require('../../middleware/authMiddleware');
const { isTenant } = require('../../middleware/roleMiddleware');

// This entire route is protected. The middleware ensures that:
// 1. The user is logged in (protect).
// 2. The user has the 'tenant' role (isTenant).
router.get('/my-lease', protect, isTenant, getMyLease);

module.exports = router;