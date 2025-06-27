// tenant_manage/backend/controllers/landlord/paymentController.js

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../../models/Payment');
const Lease = require('../../models/Lease');
const User = require('../../models/User');
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

// --- The rest of the functions in this file remain the same ---

// const createPaymentIntent = async (req, res) => { /* ... no changes ... */ };
// const logOfflinePayment = async (req, res) => { /* ... no changes ... */ };
// const getPaymentsForLease = async (req, res) => { /* ... no changes ... */ };
// const handleStripeWebhook = (req, res) => { /* ... no changes ... */ };
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

const logOfflinePayment = async (req, res) => {
    try {
        const { leaseId, amount, paymentDate, method, notes } = req.body;
        const lease = await Lease.findById(leaseId);
        if (!lease || lease.organization.toString() !== req.user.organization.toString()) {
            return res.status(404).json({ message: 'Lease not found or you are not authorized.' });
        }
        const newPayment = await Payment.create({
            property: lease.property,
            lease: lease._id,
            tenant: lease.tenant,
            organization: req.user.organization,
            amount,
            paymentDate,
            method,
            notes,
        });
        await LogEntry.create({
            organization: req.user.organization,
            actor: req.user.name,
            type: 'Payment',
            message: `Logged offline payment of $${amount} (${method})`,
            tenant: lease.tenant,
            property: lease.property,
        });
        res.status(201).json(newPayment);
    } catch (error) {
        console.error("Error logging offline payment:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const getPaymentsForLease = async (req, res) => {
    try {
        const { leaseId } = req.params;
        const lease = await Lease.findById(leaseId);
        if (!lease || lease.organization.toString() !== req.user.organization.toString()) {
            return res.status(404).json({ message: 'Lease not found or not authorized' });
        }
        const payments = await Payment.find({ lease: leaseId }).sort({ paymentDate: -1 });
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments for lease:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

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
};
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const User = require('../../models/User');
// const LogEntry = require('../../models/LogEntry');

// const fulfillOrderAndSavePayment = async (session) => {
//     try {
//         const metadata = session.metadata;
//         if (!metadata || !metadata.leaseId || !metadata.tenantId || !metadata.organizationId || !metadata.propertyId) {
//             console.error('Webhook Error: PaymentIntent session is missing required metadata.');
//             return;
//         }
//         const existingPayment = await Payment.findOne({ stripePaymentIntentId: session.id });
//         if (existingPayment) {
//             console.log(`Webhook Info: PaymentIntent ${session.id} has already been processed.`);
//             return;
//         }
//         const savedPayment = await Payment.create({
//             property: metadata.propertyId,
//             lease: metadata.leaseId,
//             tenant: metadata.tenantId,
//             organization: metadata.organizationId,
//             amount: session.amount_received / 100,
//             paymentDate: new Date(),
//             method: 'Stripe Online',
//             stripePaymentIntentId: session.id,
//         });
//         const tenant = await User.findById(metadata.tenantId).select('name');
//         await LogEntry.create({
//             organization: metadata.organizationId,
//             actor: 'System (Stripe)',
//             type: 'Payment',
//             message: `Online payment of $${savedPayment.amount.toFixed(2)} received from ${tenant.name}`,
//             tenant: metadata.tenantId,
//             property: metadata.propertyId,
//         });
//         console.log('✅ Stripe payment record and log entry created in DB.');
//     } catch (error) {
//         console.error('Error in fulfillOrderAndSavePayment:', error);
//     }
// };

// const createPaymentIntent = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         const userId = req.user.id;
//         const activeLease = await Lease.findOne({ tenant: userId, status: 'active' });
//         if (!activeLease) {
//             return res.status(404).json({ message: 'No active lease found for this user.' });
//         }
//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: 'Please provide a valid amount' });
//         }
//         const amountInCents = Math.round(amount * 100);
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: 'usd',
//             automatic_payment_methods: { enabled: true },
//             metadata: {
//                 leaseId: activeLease._id.toString(),
//                 tenantId: userId.toString(),
//                 organizationId: req.user.organization.toString(),
//                 propertyId: activeLease.property.toString(),
//             },
//         });
//         res.status(200).send({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error("Error creating payment intent:", error);
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// const logOfflinePayment = async (req, res) => {
//     try {
//         const { leaseId, amount, paymentDate, method, notes } = req.body;
//         const lease = await Lease.findById(leaseId);
//         if (!lease || lease.organization.toString() !== req.user.organization.toString()) {
//             return res.status(404).json({ message: 'Lease not found or you are not authorized.' });
//         }
//         const newPayment = await Payment.create({
//             property: lease.property,
//             lease: lease._id,
//             tenant: lease.tenant,
//             organization: req.user.organization,
//             amount,
//             paymentDate,
//             method,
//             notes,
//         });
//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'Payment',
//             message: `Logged offline payment of $${amount} (${method})`,
//             tenant: lease.tenant,
//             property: lease.property,
//         });
//         res.status(201).json(newPayment);
//     } catch (error) {
//         console.error("Error logging offline payment:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// const getPaymentsForLease = async (req, res) => {
//     try {
//         const { leaseId } = req.params;
//         const lease = await Lease.findById(leaseId);
//         if (!lease || lease.organization.toString() !== req.user.organization.toString()) {
//             return res.status(404).json({ message: 'Lease not found or not authorized' });
//         }
//         const payments = await Payment.find({ lease: leaseId }).sort({ paymentDate: -1 });
//         res.status(200).json(payments);
//     } catch (error) {
//         console.error('Error fetching payments for lease:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// const handleStripeWebhook = (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//     let event;
//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//         console.log(`❌ Webhook signature verification failed.`, err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//     if (event.type === 'payment_intent.succeeded') {
//         const paymentIntentSucceeded = event.data.object;
//         fulfillOrderAndSavePayment(paymentIntentSucceeded);
//     } else {
//         console.log(`Unhandled Stripe event type ${event.type}`);
//     }
//     res.send({ received: true });
// };

// module.exports = {
//     createPaymentIntent,
//     logOfflinePayment,
//     getPaymentsForLease,
//     handleStripeWebhook,
// };
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');

// /**
//  * This helper function is called by the webhook when a payment succeeds.
//  * It's not exported as it's only used internally by handleStripeWebhook.
//  */
// const fulfillOrderAndSavePayment = async (session) => {
//     try {
//         const metadata = session.metadata;
//         if (!metadata || !metadata.leaseId || !metadata.tenantId || !metadata.organizationId || !metadata.propertyId) {
//             console.error('Webhook Error: PaymentIntent session is missing required metadata.');
//             return;
//         }

//         // Check if this payment has already been processed to prevent duplicates
//         const existingPayment = await Payment.findOne({ stripePaymentIntentId: session.id });
//         if (existingPayment) {
//             console.log(`Webhook Info: PaymentIntent ${session.id} has already been processed.`);
//             return;
//         }

//         const savedPayment = await Payment.create({
//             property: metadata.propertyId,
//             lease: metadata.leaseId,
//             tenant: metadata.tenantId,
//             organization: metadata.organizationId,
//             amount: session.amount_received / 100, // Convert from cents back to dollars
//             paymentDate: new Date(),
//             method: 'Stripe Online',
//             stripePaymentIntentId: session.id,
//         });
        
//         await LogEntry.create({
//             organization: metadata.organizationId,
//             actor: 'System (Stripe)',
//             type: 'Payment',
//             message: `Online payment of $${savedPayment.amount.toFixed(2)} received`,
//             tenant: metadata.tenantId,
//             property: metadata.propertyId,
//         });

//         console.log('✅ Stripe payment record and log entry created in DB.');

//     } catch (error) {
//         console.error('Error in fulfillOrderAndSavePayment:', error);
//     }
// };


// /**
//  * @desc    Create a Stripe Payment Intent for the logged-in tenant
//  * @route   POST /api/tenant/payments/create-payment-intent
//  * @access  Private (Tenant)
//  */
// const createPaymentIntent = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         const userId = req.user.id;

//         const activeLease = await Lease.findOne({ tenant: userId, status: 'active' });
//         if (!activeLease) {
//             return res.status(404).json({ message: 'No active lease found for this user.' });
//         }

//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: 'Please provide a valid amount' });
//         }

//         const amountInCents = Math.round(amount * 100);

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: 'usd',
//             automatic_payment_methods: { enabled: true },
//             metadata: {
//                 leaseId: activeLease._id.toString(),
//                 tenantId: userId.toString(),
//                 organizationId: req.user.organization.toString(),
//                 propertyId: activeLease.property.toString(),
//             },
//         });

//         res.status(200).send({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error("Error creating payment intent:", error);
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };


// /**
//  * @desc    Landlord logs a payment received offline (cash, check)
//  * @route   POST /api/landlord/payments/log-offline
//  * @access  Private (Landlord)
//  */
// const logOfflinePayment = async (req, res) => {
//     try {
//         const { leaseId, amount, paymentDate, method, notes } = req.body;

//         const lease = await Lease.findById(leaseId);
//         if (!lease || lease.organization.toString() !== req.user.organization.toString()) {
//             return res.status(404).json({ message: 'Lease not found or you are not authorized.' });
//         }

//         const newPayment = await Payment.create({
//             property: lease.property,
//             lease: lease._id,
//             tenant: lease.tenant,
//             organization: req.user.organization,
//             amount,
//             paymentDate,
//             method,
//             notes,
//         });
        
//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'Payment',
//             message: `Logged offline payment of $${amount} (${method})`,
//             tenant: lease.tenant,
//             property: lease.property,
//         });

//         res.status(201).json(newPayment);
//     } catch (error) {
//         console.error("Error logging offline payment:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


// /**
//  * @desc    Landlord gets all payments for a specific lease
//  * @route   GET /api/landlord/payments/lease/:leaseId
//  * @access  Private (Landlord)
//  */
// const getPaymentsForLease = async (req, res) => {
//     try {
//         const { leaseId } = req.params;
//         const lease = await Lease.findById(leaseId);

//         if (!lease || lease.organization.toString() !== req.user.organization.toString()) {
//             return res.status(404).json({ message: 'Lease not found or not authorized' });
//         }

//         const payments = await Payment.find({ lease: leaseId }).sort({ paymentDate: -1 });
//         res.status(200).json(payments);
//     } catch (error) {
//         console.error('Error fetching payments for lease:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


// /**
//  * @desc    Handles incoming webhook events from Stripe
//  * @route   POST /api/stripe-webhook
//  * @access  Public (Verified by Stripe signature)
//  */
// const handleStripeWebhook = (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//         console.log(`❌ Webhook signature verification failed.`, err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     if (event.type === 'payment_intent.succeeded') {
//         const paymentIntentSucceeded = event.data.object;
//         fulfillOrderAndSavePayment(paymentIntentSucceeded);
//     } else {
//         console.log(`Unhandled Stripe event type ${event.type}`);
//     }

//     res.send({ received: true });
// };


// module.exports = {
//     createPaymentIntent,
//     logOfflinePayment,
//     getPaymentsForLease,
//     handleStripeWebhook,
// };
// // tenant_manage/backend/controllers/landlord/paymentController.js

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');

// // SECURE: This function is now for tenants to pay for their OWN lease.
// const createPaymentIntent = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         const userId = req.user.id; // Get user from the secure token

//         const activeLease = await Lease.findOne({ tenant: userId, status: 'active' });
//         if (!activeLease) {
//             return res.status(404).json({ message: 'No active lease found for this user.' });
//         }

//         const amountInCents = Math.round(amount * 100);

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: 'usd',
//             automatic_payment_methods: { enabled: true },
//             metadata: {
//                 leaseId: activeLease._id.toString(),
//                 tenantId: userId,
//                 organizationId: req.user.organization.toString(),
//                 propertyId: activeLease.property.toString(),
//             },
//         });

//         res.status(200).send({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
//         console.error("Error creating payment intent:", error);
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// // NEW: This function is for landlords to log offline payments.
// const logOfflinePayment = async (req, res) => {
//     try {
//         const { leaseId, amount, paymentDate, method, notes } = req.body;

//         const lease = await Lease.findById(leaseId);
//         if (!lease || lease.organization.toString() !== req.user.organization.toString()) {
//             return res.status(404).json({ message: 'Lease not found or you are not authorized.' });
//         }

//         const newPayment = await Payment.create({
//             property: lease.property,
//             lease: lease._id,
//             tenant: lease.tenant,
//             organization: req.user.organization,
//             amount,
//             paymentDate,
//             method,
//             notes,
//         });
//         // --- 3. ADD THIS LOGIC for offline payments ---
//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'Payment',
//             message: `Logged offline payment of $${amount} (${method})`,
//             tenant: lease.tenant,
//             property: lease.property,
//         });

//         res.status(201).json(newPayment);
//     } catch (error) {
//         console.error("Error logging offline payment:", error);

        
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // UPDATE: The webhook now saves more details from the metadata.
// const fulfillOrderAndSavePayment = async (session) => {
//     try {
//         const metadata = session.metadata;
//         const newPayment = await Payment.create({
//             property: metadata.propertyId,
//             lease: metadata.leaseId,
//             tenant: metadata.tenantId,
//             organization: metadata.organizationId,
//             amount: session.amount_received / 100,
//             paymentDate: new Date(),
//             method: 'Stripe Online',
//             stripePaymentIntentId: session.id,
//         });

//          // --- 2. ADD THIS LOGIC for online payments ---
//         await LogEntry.create({
//             organization: metadata.organizationId,
//             actor: 'System (Stripe)',
//             type: 'Payment',
//             message: `Online payment of $${savedPayment.amount.toFixed(2)} received`,
//             tenant: metadata.tenantId,
//             property: metadata.propertyId,
//         });
//         console.log('✅ Stripe payment record and log entry created in DB.');

       
//     } catch (error) {
//         console.error('Error in fulfillOrderAndSavePayment:', error);
//     }
// };

// const handleStripeWebhook = (req, res) => {
//     // ... (This function's internal logic does not need to change)
// };


// module.exports = {
//     createPaymentIntent,
//     logOfflinePayment,
//     handleStripeWebhook,
//     // Note: fulfillOrderAndSavePayment is used internally and does not need to be exported
// };

// // tenant_manage/backend/controllers/landlord/paymentController.js

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// // const Lease = require('../../models/Lease');

// // This function will be called by the webhook when a payment succeeds
// const fulfillOrderAndSavePayment = async (session) => {
//     try {
//         // Find the corresponding lease using the metadata we will add
//         const lease = await Lease.findById(session.metadata.leaseId).populate('property');

//         if (!lease) {
//             console.error('Webhook Error: Could not find Lease with ID:', session.metadata.leaseId);
//             return;
//         }

//         // Create the payment record in our own database
//         const newPayment = await Payment.create({
//             property: lease.property._id,
//             lease: lease._id,
//             tenant: lease.tenant,
//             organization: lease.organization,
//             amount: session.amount_received / 100, // Convert from cents back to dollars
//             paymentDate: new Date(),
//             method: 'Stripe', // Or get more details from session.payment_method_details.card.brand
//             notes: `Stripe Payment ID: ${session.id}`,
//         });
        
//         console.log('✅ Payment record created in DB:', newPayment);

//     } catch (error) {
//         console.error('Error in fulfillOrderAndSavePayment:', error);
//     }
// };

// // @desc    Handle events sent from Stripe
// // @route   POST /api/payments/stripe-webhook
// // @access  Public (but verified by Stripe)
// const handleStripeWebhook = (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//         console.log(`❌ Webhook signature verification failed.`, err.message);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event
//     switch (event.type) {
//         case 'payment_intent.succeeded':
//             const paymentIntentSucceeded = event.data.object;
//             console.log('✅ Webhook received: PaymentIntent succeeded!');
//             // Fulfill the purchase...
//             fulfillOrderAndSavePayment(paymentIntentSucceeded);
//             break;
//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     res.send();
// };


// // @desc    Create a stripe payment intent
// // @route   POST /api/payments/create-payment-intent
// // @access  Private
// // const createPaymentIntent = async (req, res) => {
// //     try {
// //         const { amount, leaseId } = req.body; // We now need the leaseId

// //         if (!amount || amount <= 0 || !leaseId) {
// //             return res.status(400).json({ message: 'Please provide a valid amount and leaseId' });
// //         }

// //         const amountInCents = Math.round(amount * 100);

// //         const paymentIntent = await stripe.paymentIntents.create({
// //             amount: amountInCents,
// //             currency: 'usd',
// //             automatic_payment_methods: { enabled: true },
// //             // --- ADD METADATA: This is crucial for linking the payment back to our data ---
// //             metadata: {
// //                 leaseId: leaseId,
// //                 // You can add more internal IDs here if needed
// //             },
// //         });

// //         res.status(200).send({ clientSecret: paymentIntent.client_secret });

// //     } catch (error) {

// const createPaymentIntent = async (req, res) => {
//     try {
//         const { amount } = req.body;
//         const userId = req.user.id; // Get user ID from the authenticated token

//         // Find the active lease for the logged-in user
//         const activeLease = await Lease.findOne({ tenant: userId, status: 'active' });

//         if (!activeLease) {
//             return res.status(404).json({ message: 'No active lease found for this user.' });
//         }

//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: 'Please provide a valid amount' });
//         }

//         const amountInCents = Math.round(amount * 100);

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: 'usd',
//             automatic_payment_methods: { enabled: true },
//             // Add metadata based on the lease found for the logged-in user
//             metadata: {
//                 leaseId: activeLease._id.toString(),
//                 tenantId: userId,
//             },
//         });

//         res.status(200).send({ clientSecret: paymentIntent.client_secret });
//     } catch (error) {
 
//         console.error("Error creating payment intent:", error);
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// module.exports = {
//     createPaymentIntent,
//     handleStripeWebhook,
// };

// // tenant_manage/backend/controllers/landlord/paymentController.js

// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');

// // @desc    Create a stripe payment intent
// // @route   POST /api/payments/create-payment-intent
// // @access  Private
// const createPaymentIntent = async (req, res) => {
//     try {
//         const { amount } = req.body;

//         if (!amount || amount <= 0) {
//             return res.status(400).json({ message: 'Please provide a valid amount' });
//         }

//         // Stripe requires the amount in the smallest currency unit (e.g., cents)
//         const amountInCents = Math.round(amount * 100);

//         const paymentIntent = await stripe.paymentIntents.create({
//             amount: amountInCents,
//             currency: 'usd', // You can change this to your desired currency
//             automatic_payment_methods: {
//                 enabled: true,
//             },
//         });

//         res.status(200).send({
//             clientSecret: paymentIntent.client_secret,
//         });

//     } catch (error) {
//         console.error("Error creating payment intent:", error);
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// module.exports = {
//     createPaymentIntent,
// };