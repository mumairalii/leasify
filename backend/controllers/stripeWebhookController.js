// tenant_manage/backend/controllers/stripeWebhookController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const Payment = require('../models/Payment');
const Lease = require('../models/Lease'); // 1. Import the Lease model

/**
 * @desc    Stripe webhook handler to process payment events.
 * @route   POST /api/stripe/webhook
 * @access  Public (Webhook signature is the security)
 */
const handleStripeWebhook = asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error(`❌ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        console.log(`✅ PaymentIntent for ${paymentIntent.amount} was successful!`);

        // --- THIS IS THE FIX ---

        // 1. Retrieve our internal paymentId from the metadata
        const paymentId = paymentIntent.metadata.paymentId;
        if (!paymentId) {
            console.error('❌ CRITICAL: paymentId missing from payment_intent metadata.');
            return res.status(400).send('Webhook Error: Missing paymentId in metadata.');
        }

        // 2. Find the corresponding payment record in our database
        const payment = await Payment.findById(paymentId);
        if (!payment) {
            console.error(`❌ CRITICAL: Payment with ID ${paymentId} not found in database.`);
            return res.status(404).send(`Webhook Error: Payment not found.`);
        }

        // --- IDEMPOTENCY CHECK ---
        // If the payment is already marked 'Completed', we've already processed it.
        // We can safely stop here and send a success response to Stripe.
        if (payment.status === 'Completed') {
            console.log(`🔵 Webhook for payment ${paymentId} already processed. Skipping.`);
            return res.status(200).json({ received: true, status: 'already processed' });
        }

        // 3. Update the payment status to 'Completed'
        payment.status = 'Completed';
        payment.stripePaymentIntentId = paymentIntent.id; // Store Stripe's ID for reference
        await payment.save();
        console.log(`Updated payment ${payment._id} to Completed.`);

        // 4. Find the associated lease and update its balance
        const lease = await Lease.findById(payment.lease);
        if (lease) {
            // Subtract the payment amount from the current balance
            lease.currentBalance = (lease.currentBalance || 0) - payment.amount;
            await lease.save();
            console.log(`Updated lease ${lease._id} balance. New balance: ${lease.currentBalance}`);
        } else {
            console.error(`❌ WARNING: Could not find Lease with ID ${payment.lease} to update balance.`);
        }

        // --- END OF FIX ---
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
});

module.exports = { handleStripeWebhook };

// const asyncHandler = require('express-async-handler');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../models/Payment');
// const Lease = require('../models/Lease');

// /**
//  * @desc    Handle Stripe webhook events to confirm payments.
//  * @route   POST /api/stripe/webhook
//  * @access  Public (Verified by Stripe Signature)
//  */
// const handleStripeWebhook = asyncHandler(async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     let event;

//     // 1. Verify the event is genuinely from Stripe
//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
//     } catch (err) {
//         console.error(`❌ Webhook signature verification failed.`, err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // 2. Handle the 'payment_intent.succeeded' event
//     if (event.type === 'payment_intent.succeeded') {
//         const paymentIntent = event.data.object;
//         const { paymentId, leaseId } = paymentIntent.metadata;

//         console.log(`✅ Received 'payment_intent.succeeded' for PaymentIntent: ${paymentIntent.id}`);

//         if (!paymentId) {
//             console.error('❌ Missing paymentId in webhook metadata for PaymentIntent:', paymentIntent.id);
//             return res.status(200).send('Webhook received, but missing our internal paymentId.');
//         }

//         // Find the corresponding payment record in our database
//         const payment = await Payment.findById(paymentId);

//         if (!payment) {
//             console.error(`❌ Payment with ID ${paymentId} not found.`);
//             return res.status(200).send('Payment record not found.');
//         }

//         // --- 3. IDEMPOTENCY CHECK ---
//         // If the payment is already marked 'Completed', we've already processed it.
//         // We can safely stop here and send a success response to Stripe.
//         if (payment.status === 'Completed') {
//             console.log(`🔵 Webhook for payment ${paymentId} already processed. Skipping.`);
//             return res.status(200).json({ received: true, status: 'already processed' });
//         }
        
//         // 4. Update the payment in our database
//         payment.status = 'Completed';
//         payment.transactionId = paymentIntent.id; // Store the Stripe Payment Intent ID
//         await payment.save();
//         console.log(`✅ Payment ${paymentId} successfully updated to 'Completed'.`);

//         // Optionally, update the associated lease
//         if (leaseId) {
//             await Lease.findByIdAndUpdate(leaseId, { $addToSet: { paymentHistory: paymentId } });
//             console.log(`✅ Lease ${leaseId} updated with payment record.`);
//         }
//     } else {
//         console.log(`- Received unhandled event type: ${event.type}`);
//     }

//     // 5. Return a 200 response to acknowledge receipt of the event
//     res.status(200).json({ received: true });
// });

// module.exports = {
//     handleStripeWebhook,
// };