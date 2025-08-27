const express = require('express');
const router = express.Router();
const { handleStripeWebhook } = require('../controllers/stripeWebhookController');

// This route uses the raw body from the request, not JSON-parsed
router.post('/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

module.exports = router;