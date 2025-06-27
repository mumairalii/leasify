// tenant_manage/backend/routes/landlord/tenantRoutes.js

const express = require('express');
const router = express.Router();
const { getOverdueTenants , getAllTenants} = require('../../controllers/landlord/tenantController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

router.use(protect, isLandlord);

router.get('/overdue', getOverdueTenants);
router.get('/', getAllTenants);

module.exports = router;