// tenant_manage/backend/routes/landlord/logRoutes.js

const express = require('express');
const router = express.Router();
const { getLogs, createLog } = require('../../controllers/landlord/logController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

router.use(protect, isLandlord);

router.route('/')
    .get(getLogs)
    .post(createLog);

module.exports = router;