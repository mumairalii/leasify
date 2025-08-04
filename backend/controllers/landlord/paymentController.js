// tenant_manage/backend/controllers/landlord/paymentController.js

const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../../models/Payment');
const Lease = require('../../models/Lease');
const LogEntry = require('../../models/LogEntry');

/**
 * This helper function is called by the webhook when a payment succeeds.
 * It's not exported as it's only used internally by handleStripeWebhook.
 */
const fulfillOrderAndSavePayment = async (session) => {
    try {
        const metadata = session.metadata;
        if (!metadata || !metadata.leaseId) {
            console.error('Webhook Error: PaymentIntent session is missing required metadata.');
            return;
        }

        const existingPayment = await Payment.findOne({ stripePaymentIntentId: session.id });
        if (existingPayment) {
            console.log(`Webhook Info: PaymentIntent ${session.id} has already been processed.`);
            return;
        }

        const savedPayment = await Payment.create({
            property: metadata.propertyId,
            lease: metadata.leaseId,
            tenant: metadata.tenantId,
            organization: metadata.organizationId,
            amount: session.amount_received / 100,
            paymentDate: new Date(),
            method: 'Stripe Online',
            stripePaymentIntentId: session.id,
        });
        
        const tenant = await User.findById(metadata.tenantId).select('name');

        // --- THIS IS THE FIX ---
        // Correctly reference 'savedPayment' to prevent the ReferenceError
        await LogEntry.create({
            organization: metadata.organizationId,
            actor: 'System (Stripe)',
            type: 'Payment',
            message: `Online payment of $${savedPayment.amount.toFixed(2)} received from ${tenant.name}`,
            tenant: metadata.tenantId,
            property: metadata.propertyId,
        });

        console.log('✅ Stripe payment record and log entry created in DB.');

    } catch (error) {
        console.error('Error in fulfillOrderAndSavePayment:', error);
    }
};


const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        const activeLease = await Lease.findOne({ tenant: userId, status: 'active' });
        if (!activeLease) {
            return res.status(404).json({ message: 'No active lease found for this user.' });
        }
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Please provide a valid amount' });
        }
        const amountInCents = Math.round(amount * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            metadata: {
                leaseId: activeLease._id.toString(),
                tenantId: userId.toString(),
                organizationId: req.user.organization.toString(),
                propertyId: activeLease.property.toString(),
            },
        });
        res.status(200).send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};


const logOfflinePayment = asyncHandler(async (req, res) => {
    // Check for validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Invalid payment data: ' + errors.array().map(err => err.msg).join(', '));
    }

    const { leaseId, amount, paymentDate, method, notes } = req.body;

    // Find the lease and verify organization
    const lease = await Lease.findOne({ 
        _id: leaseId, 
        organization: req.user.organization,
        status: 'active' // Only allow payments for active leases
    }).populate('property tenant');

    if (!lease) {
        res.status(404);
        throw new Error('Lease not found or you are not authorized');
    }

    // Create the payment record
    const payment = await Payment.create({
        property: lease.property._id,
        lease: leaseId,
        tenant: lease.tenant._id,
        organization: req.user.organization,
        amount: parseFloat(amount),
        method,
        paymentDate: new Date(paymentDate),
        notes,
    });

    // Create a log entry for the payment
    await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'Payment',
        message: `Logged an offline payment of $${amount.toFixed(2)} (${method}) for ${lease.tenant.name}`,
        lease: leaseId,
        tenant: lease.tenant._id,
        property: lease.property._id,
    });

    // Return the created payment with populated references
    const populatedPayment = await Payment.findById(payment._id)
        .populate('tenant', 'name')
        .populate('property', 'address')
        .populate('lease', 'startDate endDate rentAmount');

    res.status(201).json(populatedPayment);
});

// @desc    Get all payments for a specific lease
// @route   GET /api/landlord/payments/lease/:leaseId
// @access  Private (Landlord Only)
const getPaymentsForLease = asyncHandler(async (req, res) => {
    // Basic check to ensure landlord can only access leases in their org
    const lease = await Lease.findOne({ _id: req.params.leaseId, organization: req.user.organization });
    if (!lease) {
        res.status(404);
        throw new Error('Lease not found or you are not authorized');
    }

    const payments = await Payment.find({ lease: req.params.leaseId }).sort({ paymentDate: -1 });
    res.status(200).json(payments);
});


const handleStripeWebhook = (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`❌ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntentSucceeded = event.data.object;
        fulfillOrderAndSavePayment(paymentIntentSucceeded);
    } else {
        console.log(`Unhandled Stripe event type ${event.type}`);
    }
    res.send({ received: true });
};

module.exports = {
    createPaymentIntent,
    logOfflinePayment,
    getPaymentsForLease,
    handleStripeWebhook,
    fulfillOrderAndSavePayment
};