// tenant_manage/backend/controllers/tenant/paymentController.js

const Payment = require('../../models/Payment');

// @desc    Get all payments for the logged-in tenant
// @route   GET /api/tenant/payments/my-payments
// @access  Private (Tenant)
const getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ tenant: req.user.id })
            .sort({ paymentDate: -1 })
            .populate('property', 'address.street');

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching tenant payments:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { 
    getMyPayments 
};
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