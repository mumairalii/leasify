// backend/routes/publicRoutes.js
const express = require('express');
const router = express.Router();
const { getPublicProperties,getPublicPropertyById,getRecommendedProperties } = require('../controllers/publicController');

// This route is public and handles GET requests to /public
router.get('/public', getPublicProperties);

// --- ADD THIS NEW ROUTE ---
// This route gets a single public property by its ID
router.get('/:id/recommendations', getRecommendedProperties);
router.get('/public/:id', getPublicPropertyById);

module.exports = router;