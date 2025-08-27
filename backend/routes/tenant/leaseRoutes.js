const express = require('express');
const router = express.Router();
const { getMyLease, getLeaseDetails } = require('../../controllers/tenant/leaseController');
const { protect } = require('../../middleware/authMiddleware');
const { isTenant } = require('../../middleware/roleMiddleware');

// This entire route is protected. The middleware ensures that:
// 1. The user is logged in (protect).
// 2. The user has the 'tenant' role (isTenant).
router.get('/my-lease', protect, isTenant, getMyLease);
router.get('/', protect, isTenant, getLeaseDetails); // New route for lease details

module.exports = router;
