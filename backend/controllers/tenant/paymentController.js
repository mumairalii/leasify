// tenant_manage/backend/controllers/tenant/paymentController.js

const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Payment = require('../../models/Payment');
const Lease = require('../../models/Lease');
const mongoose = require('mongoose');

const createPaymentIntent = asyncHandler(async (req, res) => {
    const tenantId = req.user.id;
    const { leaseId } = req.body;

    if (!leaseId || !mongoose.Types.ObjectId.isValid(leaseId)) {
        res.status(400);
        throw new Error('A valid Lease ID is required.');
    }

    const activeLease = await Lease.findOne({ 
        _id: leaseId, 
        tenant: tenantId, 
        status: 'active' 
    }).populate('property').populate('organization');

    if (!activeLease) {
        res.status(404);
        throw new Error('No active lease found for this account. Cannot process payment.');
    }
    
    if (!activeLease.property) {
        console.error(`Lease ${activeLease._id} is missing a valid property.`);
        res.status(500);
        throw new Error('Could not find property details for this lease.');
    }
    if (!activeLease.organization) {
        console.error(`Lease ${activeLease._id} is missing a valid organization.`);
        res.status(500);
        throw new Error('Could not find organization details for this lease.');
    }

    // 1. Create a PENDING payment record in YOUR database FIRST.
    const newPayment = await Payment.create({
        property: activeLease.property._id,
        lease: activeLease._id,
        tenant: tenantId,
        landlord: activeLease.property.owner,
        organization: activeLease.organization._id,
        amount: activeLease.rentAmount,
        paymentDate: new Date(),
        // --- THIS IS THE FIX ---
        // Changed 'Online' to 'Stripe Online' to match the likely schema enum.
        method: 'Stripe Online', 
        // --- END OF FIX ---
        status: 'Pending',
    });

    // ... rest of the function remains the same
    const paymentIntent = await stripe.paymentIntents.create({
        amount: activeLease.rentAmount * 100,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
        metadata: {
            paymentId: newPayment._id.toString(),
            leaseId: activeLease._id.toString(),
            tenantId: tenantId.toString(),
        }
    });

    res.send({ 
        clientSecret: paymentIntent.client_secret,
        paymentId: newPayment._id,
    });
});

const getMyPayments = asyncHandler(async (req, res) => {
    
    // ... function remains the same
    const payments = await Payment.find({ tenant: req.user.id })
        .sort({ paymentDate: -1 })
        .populate('property', 'address.street'); 
    res.status(200).json(payments);
});

module.exports = { 
    getMyPayments,
    createPaymentIntent,
};

// const asyncHandler = require('express-async-handler');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const mongoose = require('mongoose'); // Import mongoose for ID validation

// /**
//  * @desc    Create a Stripe Payment Intent and a corresponding pending payment record.
//  * @route   POST /api/tenant/payments/create-payment-intent
//  * @access  Private (Tenant Only)
//  */
// const createPaymentIntent = asyncHandler(async (req, res) => {
//     const tenantId = req.user.id;
//     const { leaseId } = req.body; // Expect leaseId from the frontend

//     if (!leaseId || !mongoose.Types.ObjectId.isValid(leaseId)) {
//         res.status(400);
//         throw new Error('A valid Lease ID is required.');
//     }

//     const activeLease = await Lease.findOne({ 
//         _id: leaseId, 
//         tenant: tenantId, 
//         status: 'active' 
//     }).populate('landlord'); // Populate landlord to get the ID

//     if (!activeLease) {
//         res.status(404);
//         throw new Error('No active lease found for this account. Cannot process payment.');
//     }

//     // 1. Create a PENDING payment record in YOUR database FIRST.
//     const newPayment = await Payment.create({
//         lease: activeLease._id,
//         tenant: tenantId,
//         landlord: activeLease.landlord._id, // Get landlord from populated lease
//         amount: activeLease.rentAmount,
//         paymentDate: new Date(),
//         method: 'Online', // It's pending until the webhook confirms it
//         status: 'Pending', // It's pending until the webhook confirms it
//     });

//     // 2. Create the Stripe Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: activeLease.rentAmount * 100, // Amount in cents
//         currency: 'usd',
//         automatic_payment_methods: { enabled: true },
//         // 3. Attach YOUR database IDs to the payment intent's metadata
//         metadata: {
//             paymentId: newPayment._id.toString(),
//             leaseId: activeLease._id.toString(),
//             tenantId: tenantId.toString(),
//         }
//     });

//     // 4. Send the client secret to the frontend to finalize payment
//     res.send({ 
//         clientSecret: paymentIntent.client_secret,
//         paymentId: newPayment._id, // Also send our paymentId for reference if needed
//     });
// });

// /**
//  * @desc    Get all payments for the logged-in tenant
//  * @route   GET /api/tenant/payments/my-payments
//  * @access  Private (Tenant)
//  */
// const getMyPayments = asyncHandler(async (req, res) => {
//     const payments = await Payment.find({ tenant: req.user.id })
//         .sort({ paymentDate: -1 })
//         .populate('property', 'address.street'); // Assuming you add 'property' to your Payment model
//     res.status(200).json(payments);
// });

// module.exports = { 
//     getMyPayments,
//     createPaymentIntent,
// };


// // // // tenant_manage/backend/controllers/tenant/paymentController.js


// const asyncHandler = require('express-async-handler');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');
// const mongoose = require('mongoose'); // Import mongoose for ID validation

// /**
//  * @desc    Create a Stripe Payment Intent and a corresponding pending payment record.
//  * @route   POST /api/tenant/payments/create-payment-intent
//  * @access  Private (Tenant Only)
//  */
// const createPaymentIntent = asyncHandler(async (req, res) => {
//     const tenantId = req.user.id;
//     const { leaseId } = req.body; // Expect leaseId from the frontend

//     if (!leaseId || !mongoose.Types.ObjectId.isValid(leaseId)) {
//         res.status(400);
//         throw new Error('A valid Lease ID is required.');
//     }

//     const activeLease = await Lease.findOne({ 
//         _id: leaseId, 
//         tenant: tenantId, 
//         status: 'active' 
//     }).populate('landlord'); // Populate landlord to get the ID

//     if (!activeLease) {
//         res.status(404);
//         throw new Error('No active lease found for this account. Cannot process payment.');
//     }

//     // 1. Create a PENDING payment record in YOUR database FIRST.
//     const newPayment = await Payment.create({
//         lease: activeLease._id,
//         tenant: tenantId,
//         landlord: activeLease.landlord._id, // Get landlord from populated lease
//         amount: activeLease.rentAmount,
//         paymentDate: new Date(),
//         paymentMethod: 'Online',
//         status: 'Pending', // It's pending until the webhook confirms it
//     });

//     // 2. Create the Stripe Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: activeLease.rentAmount * 100, // Amount in cents
//         currency: 'usd',
//         automatic_payment_methods: { enabled: true },
//         // 3. Attach YOUR database IDs to the payment intent's metadata
//         metadata: {
//             paymentId: newPayment._id.toString(),
//             leaseId: activeLease._id.toString(),
//             tenantId: tenantId.toString(),
//         }
//     });

//     // 4. Send the client secret to the frontend to finalize payment
//     res.send({ 
//         clientSecret: paymentIntent.client_secret,
//         paymentId: newPayment._id, // Also send our paymentId for reference if needed
//     });
// });

// /**
//  * @desc    Get all payments for the logged-in tenant
//  * @route   GET /api/tenant/payments/my-payments
//  * @access  Private (Tenant)
//  */
// const getMyPayments = asyncHandler(async (req, res) => {
//     const payments = await Payment.find({ tenant: req.user.id })
//         .sort({ paymentDate: -1 })
//         .populate('property', 'address.street'); // Assuming you add 'property' to your Payment model
//     res.status(200).json(payments);
// });

// module.exports = { 
//     getMyPayments,
//     createPaymentIntent,
// };


// // tenant_manage/backend/controllers/tenant/paymentController.js
// const asyncHandler = require('express-async-handler');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Payment = require('../../models/Payment');
// const Lease = require('../../models/Lease');

// /**
//  * @desc    Create a Stripe Payment Intent for the tenant's active lease.
//  * @route   POST /api/tenant/payments/create-payment-intent
//  * @access  Private (Tenant Only)
//  */
// const createPaymentIntent = asyncHandler(async (req, res) => {
//     const tenantId = req.user.id;
//     const activeLease = await Lease.findOne({ tenant: tenantId, status: 'active' });

//     if (!activeLease) {
//         res.status(400);
//         throw new Error('No active lease found. Cannot process payment.');
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: activeLease.rentAmount * 100,
//         currency: 'usd',
//         automatic_payment_methods: { enabled: true },
//         metadata: {
//             leaseId: activeLease._id.toString(),
//             tenantId: tenantId.toString(),
//             propertyId: activeLease.property.toString(),
//             organizationId: activeLease.organization.toString(),
//         }
//     });

//     res.send({ clientSecret: paymentIntent.client_secret });
// });

// /**
//  * @desc    Get all payments for the logged-in tenant
//  * @route   GET /api/tenant/payments/my-payments
//  * @access  Private (Tenant)
//  */
// const getMyPayments = asyncHandler(async (req, res) => {
//     const payments = await Payment.find({ tenant: req.user.id })
//         .sort({ paymentDate: -1 })
//         .populate('property', 'address.street');
//     res.status(200).json(payments);
// });

// module.exports = { 
//     getMyPayments,
//     createPaymentIntent,
// };

// const Payment = require('../../models/Payment');
// const asyncHandler = require('express-async-handler');
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// const Lease = require('../../models/Lease');

// // @desc    Get all payments for the logged-in tenant
// // @route   GET /api/tenant/payments/my-payments
// // @access  Private (Tenant)
// const getMyPayments = async (req, res) => {
//     try {
//         const payments = await Payment.find({ tenant: req.user.id })
//             .sort({ paymentDate: -1 })
//             .populate('property', 'address.street');

//         res.status(200).json(payments);
//     } catch (error) {
//         console.error('Error fetching tenant payments:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// /**
//  * @desc    Create a Stripe Payment Intent for the tenant's active lease.
//  * @route   POST /api/tenant/payments/create-payment-intent
//  * @access  Private (Tenant Only)
//  */
// const createPaymentIntent = asyncHandler(async (req, res) => {
//     const tenantId = req.user.id;

//     // 1. Find the tenant's active lease to get the correct rent amount.
//     const activeLease = await Lease.findOne({ tenant: tenantId, status: 'active' });

//     if (!activeLease) {
//         res.status(400);
//         throw new Error('No active lease found. Cannot process payment.');
//     }

//     // 2. Create a Payment Intent with Stripe.
//     // The amount must be in the smallest currency unit (e.g., cents for USD).
//     const paymentIntent = await stripe.paymentIntents.create({
//         amount: activeLease.rentAmount * 100, // Convert dollars to cents
//         currency: 'usd', // Or your desired currency
//         automatic_payment_methods: {
//             enabled: true,
//         },
//         // Add metadata to link this Stripe transaction to your application's data
//         metadata: {
//             leaseId: activeLease._id.toString(),
//             tenantId: tenantId.toString(),
//             propertyId: activeLease.property.toString(),
//         }
//     });

//     // 3. Send the client secret back to the frontend.
//     res.send({
//         clientSecret: paymentIntent.client_secret,
//     });
// });

// module.exports = { 
//     getMyPayments ,
//     createPaymentIntent, 
// };
// // tenant_manage/backend/controllers/tenant/paymentController.js

// const Payment = require('../../models/Payment');

// // @desc    Get all payments for the logged-in tenant
// // @route   GET /api/tenant/payments/my-payments
// // @access  Private (Tenant)
// const getMyPayments = async (req, res) => {
//     try {
//         const payments = await Payment.find({ tenant: req.user.id })
//             .sort({ paymentDate: -1 })
//             .populate('property', 'address.street');

//         res.status(200).json(payments);
//     } catch (error) {
//         console.error('Error fetching tenant payments:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { 
//     getMyPayments 
// };
// // tenant_manage/backend/controllers/tenant/paymentController.js
// const Payment = require('../../models/Payment');

// // @desc    Get all payments for the logged-in tenant
// // @route   GET /api/tenant/payments/my-payments
// const getMyPayments = async (req, res) => {
//     try {
//         const payments = await Payment.find({ tenant: req.user.id })
//             .sort({ paymentDate: -1 })
//             .populate('property', 'address.street');

//         res.status(200).json(payments);
//     } catch (error) {
//         console.error('Error fetching tenant payments:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getMyPayments };