// tenant_manage/backend/routes/landlord/tenantRoutes.js
const express = require('express');
const router = express.Router();
const {
  getOverdueTenants,
  getAllTenants,
  getTenantById,
  getUpcomingPayments,
  getTenantReliabilityScore,
} = require('../../controllers/landlord/tenantController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

router.use(protect, isLandlord);

// Place specific routes before dynamic routes
router.get('/:id/reliability-score', getTenantReliabilityScore);
router.get('/', getAllTenants);
router.get('/overdue', getOverdueTenants);
router.get('/upcoming', getUpcomingPayments);
// Dynamic route must be last
router.get('/:id', getTenantById);

module.exports = router;
// // tenant_manage/backend/routes/landlord/tenantRoutes.js
// const express = require('express');
// const router = express.Router();
// const {
//   getOverdueTenants,
//   getAllTenants,
//   getTenantById,
//   getUpcomingPayments, // <-- 1. Import the new controller function
// } = require('../../controllers/landlord/tenantController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// router.use(protect, isLandlord);

// router.get('/', getAllTenants);
// router.get('/overdue', getOverdueTenants);

// // --- 2. ADD THE NEW DYNAMIC ROUTE ---
// // Dynamic routes like '/:id' must be placed after specific text-based routes.
// router.get('/:id', getTenantById);
// router.get('/upcoming', getUpcomingPayments);

// module.exports = router;

// // tenant_manage/backend/routes/landlord/tenantRoutes.js

// const express = require('express');
// const router = express.Router();
// const { getOverdueTenants , getAllTenants,  getTenantById, } = require('../../controllers/landlord/tenantController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// router.use(protect, isLandlord);

// router.get('/overdue', getOverdueTenants);
// router.get('/', getAllTenants);
// router.get('/:id', getTenantById);
// module.exports = router;