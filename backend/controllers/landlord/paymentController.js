// // // // tenant_manage/backend/controllers/landlord/paymentController.js

// // // tenant_manage/backend/controllers/landlord/paymentController.js

// const asyncHandler = require('express-async-handler');
// const { validationResult } = require('express-validator');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');
// const User = require('../../models/User'); // --- FIX #1: Import the User model ---

// /**
//  * This helper function is called by the webhook when a payment succeeds.
//  */
// const fulfillOrderAndSavePayment = async (session) => {
//     try {
//         const metadata = session.metadata;
//         if (!metadata || !metadata.leaseId) {
//             console.error('Webhook Error: PaymentIntent is missing required metadata.');
//             return;
//         }

//         const existingPayment = await Payment.findOne({ stripePaymentIntentId: session.id });
//         if (existingPayment) {
//             console.log(`Webhook Info: Payment for Intent ${session.id} already processed.`);
//             return;
//         }

//         const savedPayment = await Payment.create({
//             property: metadata.propertyId,
//             lease: metadata.leaseId,
//             tenant: metadata.tenantId,
//             organization: metadata.organizationId,
//             amount: session.amount_received / 100, // Convert from cents
//             // --- FIX #2: Use Stripe's official timestamp for accuracy ---
//             paymentDate: new Date(session.created * 1000), 
//             method: 'Stripe Online',
//             stripePaymentIntentId: session.id,
//         });
        
//         const tenant = await User.findById(metadata.tenantId).select('name');
//         await LogEntry.create({
//             organization: metadata.organizationId,
//             actor: 'System (Stripe)',
//             type: 'Payment',
//             message: `Online payment of $${(savedPayment.amount).toFixed(2)} received from ${tenant.name}`,
//             tenant: metadata.tenantId,
//             property: metadata.propertyId,
//         });

//         console.log(`✅ Payment record created in DB for Stripe Intent: ${session.id}`);

//     } catch (error) {
//         console.error('Error in fulfillOrderAndSavePayment:', error);
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
//         const paymentIntent = event.data.object;
//         console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
//         fulfillOrderAndSavePayment(paymentIntent);
//     } else {
//         console.log(`Unhandled Stripe event type: ${event.type}`);
//     }
//     res.send({ received: true });
// };

// /**
//  * @desc    Log a payment received offline (cash, check)
//  * @route   POST /api/landlord/payments
//  * @access  Private (Landlord)
//  */
// // const logOfflinePayment = asyncHandler(async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //         res.status(400);
// //         throw new Error('Invalid payment data: ' + errors.array().map(err => err.msg).join(', '));
// //     }

// //     // Renamed 'method' to 'paymentMethod' to match the updated model
// //     const { leaseId, amount, paymentDate, paymentMethod, notes } = req.body;

// //     const lease = await Lease.findOne({ 
// //         _id: leaseId, 
// //         organization: req.user.organization,
// //         status: 'active'
// //     }).populate('property tenant');

// //     if (!lease) {
// //         res.status(404);
// //         throw new Error('Active lease not found or you are not authorized');
// //     }

// //     // Create the payment record
// //     const payment = await Payment.create({
// //         property: lease.property._id,
// //         lease: leaseId,
// //         tenant: lease.tenant._id,
// //         landlord: req.user.id, // --- THE FIX IS HERE ---
// //         organization: req.user.organization,
// //         amount: parseFloat(amount),
// //         paymentMethod, // Using the new standardized field name
// //         paymentDate: new Date(paymentDate),
// //         status: 'Completed', // Offline payments are always completed
// //         notes,
// //     });

// //     // Create a log entry for the payment
// //     await LogEntry.create({
// //         organization: req.user.organization,
// //         actor: req.user.name,
// //         type: 'Payment',
// //         message: `Logged an offline payment of $${parseFloat(amount).toFixed(2)} (${paymentMethod}) for ${lease.tenant.name}`,
// //         lease: leaseId,
// //         tenant: lease.tenant._id,
// //         property: lease.property._id,
// //     });

// //     res.status(201).json(payment);
// // });





// const logOfflinePayment = asyncHandler(async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         res.status(400);
//         throw new Error('Invalid payment data: ' + errors.array().map(err => err.msg).join(', '));
//     }

//     const { leaseId, amount, paymentDate, method, notes } = req.body;

//     const lease = await Lease.findOne({ 
//         _id: leaseId, 
//         organization: req.user.organization,
//         status: 'active'
//     }).populate('property tenant');

//     if (!lease) {
//         res.status(404);
//         throw new Error('Lease not found or you are not authorized');
//     }

//     // --- Create the payment record ---
//     const payment = await Payment.create({
//         property: lease.property._id,
//         lease: leaseId,
//         tenant: lease.tenant._id,
//         organization: req.user.organization,
//         landlord: req.user.id, // --- THIS IS THE ONLY LINE THAT WAS NEEDED ---
//         amount: parseFloat(amount),
//         method, // Using your original 'method' field
//         paymentDate: new Date(paymentDate),
//         notes,
//         status: 'Completed',
//     });

//     // Your log entry logic is correct
//     await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.name,
//         type: 'Payment',
//         message: `Logged an offline payment of $${parseFloat(amount).toFixed(2)} (${method}) for ${lease.tenant.name}`,
//         lease: leaseId,
//         tenant: lease.tenant._id,
//         property: lease.property._id,
//     });

//     // Your response logic is correct
//     const populatedPayment = await Payment.findById(payment._id)
//         .populate('tenant', 'name')
//         .populate('property', 'address')
//         .populate('lease', 'startDate endDate rentAmount');

//     res.status(201).json(populatedPayment);
// });

// // const logOfflinePayment = asyncHandler(async (req, res) => {
// //     // Check for validation errors first
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //         res.status(400);
// //         throw new Error('Invalid payment data: ' + errors.array().map(err => err.msg).join(', '));
// //     }

// //     const { leaseId, amount, paymentDate, method, notes } = req.body;

// //     // Find the lease and verify organization
// //     const lease = await Lease.findOne({ 
// //         _id: leaseId, 
// //         organization: req.user.organization,
// //         status: 'active' // Only allow payments for active leases
// //     }).populate('property tenant');

// //     if (!lease) {
// //         res.status(404);
// //         throw new Error('Lease not found or you are not authorized');
// //     }

// //     // Create the payment record
// //     const payment = await Payment.create({
// //         property: lease.property._id,
// //         lease: leaseId,
// //         tenant: lease.tenant._id,
// //         organization: req.user.organization,
// //         amount: parseFloat(amount),
// //         method,
// //         paymentDate: new Date(paymentDate),
// //         notes,
// //     });

// //     // Create a log entry for the payment
// //     await LogEntry.create({
// //         organization: req.user.organization,
// //         actor: req.user.name,
// //         type: 'Payment',
// //         message: `Logged an offline payment of $${amount.toFixed(2)} (${method}) for ${lease.tenant.name}`,
// //         lease: leaseId,
// //         tenant: lease.tenant._id,
// //         property: lease.property._id,
// //     });

// //     // Return the created payment with populated references
// //     const populatedPayment = await Payment.findById(payment._id)
// //         .populate('tenant', 'name')
// //         .populate('property', 'address')
// //         .populate('lease', 'startDate endDate rentAmount');

// //     res.status(201).json(populatedPayment);
// // });


// // @desc    Get all payments for a specific lease
// // @route   GET /api/landlord/payments/lease/:leaseId
// // @access  Private (Landlord Only)
// const getPaymentsForLease = asyncHandler(async (req, res) => {
//     // Basic check to ensure landlord can only access leases in their org
//     const lease = await Lease.findOne({ _id: req.params.leaseId, organization: req.user.organization });
//     if (!lease) {
//         res.status(404);
//         throw new Error('Lease not found or you are not authorized');
//     }

//     const payments = await Payment.find({ lease: req.params.leaseId }).sort({ paymentDate: -1 });
//     res.status(200).json(payments);
// });


// module.exports = {
//     logOfflinePayment,
//     getPaymentsForLease,
//     handleStripeWebhook,
// };




// tenant_manage/backend/controllers/landlord/paymentController.js

const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../../models/Payment');
const Lease = require('../../models/Lease');
const LogEntry = require('../../models/LogEntry');
const User = require('../../models/User');

// --- NEW FUNCTION THE PAYMENTS PAGE NEEDS ---
/**
 * @desc    Get all payments for the landlord's organization with filtering
 * @route   GET /api/landlord/payments
 * @access  Private (Landlord)
 */
// --- NEW FUNCTION - COPIED FROM YOUR LOG SYSTEM'S LOGIC ---
/**
 * @desc    Get all payments for the landlord's organization with filtering
 * @route   GET /api/landlord/payments
 * @access  Private (Landlord)
 */
// --- THIS IS THE NEW, CORRECT FUNCTION ---
/**
 * @desc    Get all payments for the landlord's organization with filtering
 * @route   GET /api/landlord/payments
 * @access  Private (Landlord)
 */
const getLandlordPayments = asyncHandler(async (req, res) => {
    const { propertyId, page = 1, limit = 10 } = req.query;

    const filters = {
        organization: req.user.organization,
    };

    if (propertyId) {
        const leases = await Lease.find({ property: propertyId }).select('_id');
        const leaseIds = leases.map(lease => lease._id);
        filters.lease = { $in: leaseIds };
    }

    const payments = await Payment.find(filters)
        .populate({
            path: 'lease',
            populate: [
                { path: 'property', select: 'address' },
                { path: 'tenant', select: 'name' }
            ]
        })
        .sort({ paymentDate: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Payment.countDocuments(filters);

    res.status(200).json({ 
        payments, 
        page: Number(page), 
        pages: Math.ceil(total / limit), 
        total 
    });
});


/**
 * This helper function is called by the webhook when a payment succeeds.
 */
const fulfillOrderAndSavePayment = async (session) => {
    try {
        const metadata = session.metadata;
        if (!metadata || !metadata.paymentId) {
            console.error('Webhook Error: PaymentIntent is missing required metadata.');
            return;
        }

        const updatedPayment = await Payment.findByIdAndUpdate(
            metadata.paymentId,
            {
                status: 'Completed',
                stripePaymentIntentId: session.id,
            },
            { new: true }
        );

        if (!updatedPayment) {
            console.error(`Webhook Error: Could not find Payment with ID ${metadata.paymentId}`);
            return;
        }

        const tenant = await User.findById(updatedPayment.tenant).select('name');
        await LogEntry.create({
            organization: updatedPayment.organization,
            actor: 'System (Stripe)',
            type: 'Payment',
            message: `Online payment of ${(updatedPayment.amount).toFixed(2)} received from ${tenant.name}`,
            tenant: updatedPayment.tenant,
            property: updatedPayment.property,
        });

        console.log(`✅ Payment record updated in DB for Stripe Intent: ${session.id}`);

    } catch (error) {
        console.error('Error in fulfillOrderAndSavePayment:', error);
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
        const paymentIntent = event.data.object;
        console.log('✅ PaymentIntent succeeded:', paymentIntent.id);
        fulfillOrderAndSavePayment(paymentIntent);
    } else {
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }
    res.send({ received: true });
};

/**
 * @desc    Log a payment received offline (cash, check)
 * @route   POST /api/landlord/payments/offline
 * @access  Private (Landlord)
 */
const logOfflinePayment = asyncHandler(async (req, res) => {
    // Using your original, working function
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Invalid payment data: ' + errors.array().map(err => err.msg).join(', '));
    }

    const { leaseId, amount, paymentDate, method, notes } = req.body;

    const lease = await Lease.findOne({ 
        _id: leaseId, 
        organization: req.user.organization,
        status: 'active'
    }).populate('property tenant');

    if (!lease) {
        res.status(404);
        throw new Error('Lease not found or you are not authorized');
    }

    const payment = await Payment.create({
        property: lease.property._id,
        lease: leaseId,
        tenant: lease.tenant._id,
        organization: req.user.organization,
        landlord: req.user.id, // Making sure the landlord is always associated
        amount: parseFloat(amount),
        method,
        paymentDate: new Date(paymentDate),
        notes,
        status: 'Completed',
    });

    await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'Payment',
        message: `Logged an offline payment of $${parseFloat(amount).toFixed(2)} (${method}) for ${lease.tenant.name}`,
        lease: leaseId,
        tenant: lease.tenant._id,
        property: lease.property._id,
    });

    const populatedPayment = await Payment.findById(payment._id)
        .populate('tenant', 'name')
        .populate('property', 'address')
        .populate('lease', 'startDate endDate rentAmount');

    res.status(201).json(populatedPayment);
});

/**
 * @desc    Get all payments for a specific lease
 * @route   GET /api/landlord/payments/lease/:leaseId
 * @access  Private (Landlord Only)
 */
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

module.exports = {
    getLandlordPayments,// Exporting the new function
    logOfflinePayment,
    fulfillOrderAndSavePayment,
    getPaymentsForLease,
    handleStripeWebhook,
};






// const asyncHandler = require('express-async-handler');
// const { validationResult } = require('express-validator');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');
// const User = require('../../models/User'); // Ensure User model is imported


// /**
//  * This helper function is called by the webhook when a payment succeeds.
//  */
// const fulfillOrderAndSavePayment = async (session) => {
//     try {
//         const metadata = session.metadata;
//         if (!metadata || !metadata.leaseId) {
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
//             amount: session.amount_received / 100, // Convert from cents
//             paymentDate: new Date(session.created * 1000), // Use Stripe's timestamp for accuracy
//             method: 'Stripe Online',
//             stripePaymentIntentId: session.id,
//         });
        
//         // --- THIS IS THE FIX ---
//         // After creating the payment, we must also update the associated lease.
//         // This ensures all other parts of the system have the latest data.
//         // Note: This assumes your Lease model has a field like 'paymentHistory: [mongoose.Schema.Types.ObjectId]'
//         await Lease.findByIdAndUpdate(metadata.leaseId, {
//             $push: { payments: savedPayment._id }, 
//         });
//         // --- END OF FIX ---
        
//         const tenant = await User.findById(metadata.tenantId).select('name');

//         await LogEntry.create({
//             organization: metadata.organizationId,
//             actor: 'System (Stripe)',
//             type: 'Payment',
//             message: `Online payment of ${savedPayment.amount.toFixed(2)} received from ${tenant.name}`,
//             tenant: metadata.tenantId,
//             property: metadata.propertyId,
//         });

//         // --- THIS IS THE FIX ---
//         // After creating the payment, we must also update the associated lease.
//         // This ensures all other parts of the system have the latest data.
//         await Lease.findByIdAndUpdate(metadata.leaseId, {
//             $push: { payments: savedPayment._id }, 
//         });
//         // --- END OF FIX ---

//         console.log('✅ Stripe payment record, log, and lease updated in DB.');

//     } catch (error) {
//         console.error('Error in fulfillOrderAndSavePayment:', error);
//     }
// };




// const logOfflinePayment = asyncHandler(async (req, res) => {
//     // Check for validation errors first
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         res.status(400);
//         throw new Error('Invalid payment data: ' + errors.array().map(err => err.msg).join(', '));
//     }

//     const { leaseId, amount, paymentDate, method, notes } = req.body;

//     // Find the lease and verify organization
//     const lease = await Lease.findOne({ 
//         _id: leaseId, 
//         organization: req.user.organization,
//         status: 'active' // Only allow payments for active leases
//     }).populate('property tenant');

//     if (!lease) {
//         res.status(404);
//         throw new Error('Lease not found or you are not authorized');
//     }

//     // Create the payment record
//     const payment = await Payment.create({
//         property: lease.property._id,
//         lease: leaseId,
//         tenant: lease.tenant._id,
//         organization: req.user.organization,
//         amount: parseFloat(amount),
//         method,
//         paymentDate: new Date(paymentDate),
//         notes,
//     });

//     // Create a log entry for the payment
//     await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.name,
//         type: 'Payment',
//         message: `Logged an offline payment of $${amount.toFixed(2)} (${method}) for ${lease.tenant.name}`,
//         lease: leaseId,
//         tenant: lease.tenant._id,
//         property: lease.property._id,
//     });

//     // Return the created payment with populated references
//     const populatedPayment = await Payment.findById(payment._id)
//         .populate('tenant', 'name')
//         .populate('property', 'address')
//         .populate('lease', 'startDate endDate rentAmount');

//     res.status(201).json(populatedPayment);
// });

// // @desc    Get all payments for a specific lease
// // @route   GET /api/landlord/payments/lease/:leaseId
// // @access  Private (Landlord Only)
// const getPaymentsForLease = asyncHandler(async (req, res) => {
//     // Basic check to ensure landlord can only access leases in their org
//     const lease = await Lease.findOne({ _id: req.params.leaseId, organization: req.user.organization });
//     if (!lease) {
//         res.status(404);
//         throw new Error('Lease not found or you are not authorized');
//     }

//     const payments = await Payment.find({ lease: req.params.leaseId }).sort({ paymentDate: -1 });
//     res.status(200).json(payments);
// });


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
//     logOfflinePayment,
//     getPaymentsForLease,
//     handleStripeWebhook,
// };

// const asyncHandler = require('express-async-handler');
// const { validationResult } = require('express-validator');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');
// const User = require('../../models/User'); // Ensure User model is imported


// /**
//  * This helper function is called by the webhook when a payment succeeds.
//  */
// const fulfillOrderAndSavePayment = async (session) => {
//     try {
//         const metadata = session.metadata;
//         if (!metadata || !metadata.leaseId) {
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
//             amount: session.amount_received / 100, // Convert from cents
//             paymentDate: new Date(session.created * 1000), // Use Stripe's timestamp for accuracy
//             method: 'Stripe Online',
//             stripePaymentIntentId: session.id,
//         });
        
//         // --- THIS IS THE FIX ---
//         // After creating the payment, we must also update the associated lease.
//         // This ensures all other parts of the system have the latest data.
//         // Note: This assumes your Lease model has a field like 'paymentHistory: [mongoose.Schema.Types.ObjectId]'
//         await Lease.findByIdAndUpdate(metadata.leaseId, {
//             $push: { payments: savedPayment._id }, 
//         });
//         // --- END OF FIX ---
        
//         const tenant = await User.findById(metadata.tenantId).select('name');

//         await LogEntry.create({
//             organization: metadata.organizationId,
//             actor: 'System (Stripe)',
//             type: 'Payment',
//             message: `Online payment of $${savedPayment.amount.toFixed(2)} received from ${tenant.name}`,
//             tenant: metadata.tenantId,
//             property: metadata.propertyId,
//         });

//         console.log('✅ Stripe payment record, log, and lease updated in DB.');

//     } catch (error) {
//         console.error('Error in fulfillOrderAndSavePayment:', error);
//     }
// };




// const logOfflinePayment = asyncHandler(async (req, res) => {
//     // Check for validation errors first
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         res.status(400);
//         throw new Error('Invalid payment data: ' + errors.array().map(err => err.msg).join(', '));
//     }

//     const { leaseId, amount, paymentDate, method, notes } = req.body;

//     // Find the lease and verify organization
//     const lease = await Lease.findOne({ 
//         _id: leaseId, 
//         organization: req.user.organization,
//         status: 'active' // Only allow payments for active leases
//     }).populate('property tenant');

//     if (!lease) {
//         res.status(404);
//         throw new Error('Lease not found or you are not authorized');
//     }

//     // Create the payment record
//     const payment = await Payment.create({
//         property: lease.property._id,
//         lease: leaseId,
//         tenant: lease.tenant._id,
//         organization: req.user.organization,
//         amount: parseFloat(amount),
//         method,
//         paymentDate: new Date(paymentDate),
//         notes,
//     });

//     // Create a log entry for the payment
//     await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.name,
//         type: 'Payment',
//         message: `Logged an offline payment of $${amount.toFixed(2)} (${method}) for ${lease.tenant.name}`,
//         lease: leaseId,
//         tenant: lease.tenant._id,
//         property: lease.property._id,
//     });

//     // Return the created payment with populated references
//     const populatedPayment = await Payment.findById(payment._id)
//         .populate('tenant', 'name')
//         .populate('property', 'address')
//         .populate('lease', 'startDate endDate rentAmount');

//     res.status(201).json(populatedPayment);
// });

// // @desc    Get all payments for a specific lease
// // @route   GET /api/landlord/payments/lease/:leaseId
// // @access  Private (Landlord Only)
// const getPaymentsForLease = asyncHandler(async (req, res) => {
//     // Basic check to ensure landlord can only access leases in their org
//     const lease = await Lease.findOne({ _id: req.params.leaseId, organization: req.user.organization });
//     if (!lease) {
//         res.status(404);
//         throw new Error('Lease not found or you are not authorized');
//     }

//     const payments = await Payment.find({ lease: req.params.leaseId }).sort({ paymentDate: -1 });
//     res.status(200).json(payments);
// });


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
//     logOfflinePayment,
//     getPaymentsForLease,
//     handleStripeWebhook,
// };