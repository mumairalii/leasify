const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../../controllers/landlord/dashboardController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

// All routes in this file are protected and for landlords only
router.use(protect, isLandlord);

router.get('/stats', getDashboardStats);

module.exports = router;