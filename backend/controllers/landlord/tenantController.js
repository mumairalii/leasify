const Lease = require('../../models/Lease');
const Payment = require('../../models/Payment');
const moment = require('moment');
const User = require('../../models/User');
const mongoose = require('mongoose'); // Import mongoose for ObjectId

// @desc    Get tenants with overdue rent using an efficient aggregation pipeline
// @route   GET /api/landlord/tenants/overdue
// @access  Private (Landlord Only)
const getOverdueTenants = async (req, res) => {
    try {
        const organizationId = new mongoose.Types.ObjectId(req.user.organization);

        const overdueTenants = await Lease.aggregate([
            // Stage 1: Find only the active leases for the current landlord's organization
            {
                $match: {
                    organization: organizationId,
                    status: 'active'
                }
            },
            // Stage 2: Join with the 'payments' collection to get all payments for each lease
            {
                $lookup: {
                    from: 'payments',
                    localField: '_id',
                    foreignField: 'lease',
                    as: 'paymentHistory'
                }
            },
            // Stage 3: Create new computed fields for what's due and what's been paid
            {
                $addFields: {
                    totalPaid: { $sum: '$paymentHistory.amount' },
                    monthsPassed: {
                        $max: [0, { // Ensure months passed is not negative
                            $dateDiff: {
                                startDate: "$startDate",
                                endDate: new Date(),
                                unit: "month"
                            }
                        }]
                    }
                }
            },
            // Stage 4: Calculate the total rent due and the balance owed
            {
                $addFields: {
                    totalRentDue: { $multiply: [ { $add: ["$monthsPassed", 1] }, "$rentAmount" ] },
                }
            },
            {
                $addFields: {
                    amountOwed: { $subtract: ["$totalRentDue", "$totalPaid"] }
                }
            },
            // Stage 5: Filter out any leases where the amount owed is zero or less
            {
                $match: {
                    amountOwed: { $gt: 0 }
                }
            },
            // Stage 6: Join with the 'users' collection to get tenant details
            {
                $lookup: {
                    from: 'users',
                    localField: 'tenant',
                    foreignField: '_id',
                    as: 'tenantInfo'
                }
            },
            // Stage 7: Join with the 'properties' collection to get property details
            {
                $lookup: {
                    from: 'properties',
                    localField: 'property',
                    foreignField: '_id',
                    as: 'propertyInfo'
                }
            },
            // Stage 8: Reshape the final output to be clean and flat
            {
                $project: {
                    _id: 0, // Exclude the default _id
                    leaseId: "$_id",
                    tenantId: { $arrayElemAt: ["$tenantInfo._id", 0] },
                    name: { $arrayElemAt: ["$tenantInfo.name", 0] },
                    email: { $arrayElemAt: ["$tenantInfo.email", 0] },
                    unit: { $arrayElemAt: ["$propertyInfo.address.street", 0] },
                    amount: "$amountOwed"
                }
            },
            // Stage 9: Sort by the highest amount owed
            {
                $sort: {
                    amount: -1
                }
            }
        ]);

        res.status(200).json(overdueTenants);

    } catch (error) {
        console.error("Error fetching overdue tenants:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// ... (getAllTenants function remains the same)
const getAllTenants = async (req, res) => {
    try {
        const tenants = await User.find({ role: 'tenant' }).select('name');
        res.status(200).json(tenants);
    } catch (error) {
        console.error("Error fetching tenants:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getOverdueTenants,
    getAllTenants,
};

// // tenant_manage/backend/controllers/landlord/tenantController.js

// const Lease = require('../../models/Lease');
// const Payment = require('../../models/Payment');
// const moment = require('moment'); // We'll use moment.js for easier date calculations
// const User = require('../../models/User'); // Import User model

// // @desc    Get tenants with overdue rent
// // @route   GET /api/landlord/tenants/overdue
// // @access  Private (Landlord Only)
// const getOverdueTenants = async (req, res) => {
//     try {
//         const organizationId = req.user.organization;

//         // 1. Find all active leases for the organization
//         // const activeLeases = await Lease.find({
//         //     organization: organizationId,
//         //     status: 'active'
//         // }).populate('tenant', 'name email');
//         const activeLeases = await Lease.find({
//             organization: organizationId,
//             status: 'active'
//         }).populate('tenant', 'name email')
//           .populate({ // This ensures we get the property address
//               path: 'property',
//               select: 'address'
//           }); 

//         if (!activeLeases.length) {
//             return res.status(200).json([]);
//         }

//         // 2. Get all payments for those leases
//         const leaseIds = activeLeases.map(lease => lease._id);
//         const payments = await Payment.find({ lease: { $in: leaseIds } });

//         // 3. Group payments by lease ID for easy lookup
//         const paymentsByLease = payments.reduce((acc, payment) => {
//             const leaseId = payment.lease.toString();
//             if (!acc[leaseId]) {
//                 acc[leaseId] = 0;
//             }
//             acc[leaseId] += payment.amount;
//             return acc;
//         }, {});

//         // 4. Calculate overdue status for each lease
//         const overdueTenants = [];
//         const today = moment();

//         for (const lease of activeLeases) {
//             const startDate = moment(lease.startDate);
//             // Calculate how many full months have passed since the lease started
//             const monthsPassed = today.diff(startDate, 'months');
            
//             // We consider rent due for the current month as well
//             const totalRentDue = (monthsPassed + 1) * lease.rentAmount;
//             const totalPaid = paymentsByLease[lease._id.toString()] || 0;
            
//             const amountOwed = totalRentDue - totalPaid;

//             if (amountOwed > 0) {
//                 overdueTenants.push({
//                      tenantId: lease.tenant._id,
//                 leaseId: lease._id, // Pass the leaseId for payment logging
//                 name: lease.tenant.name,
//                 email: lease.tenant.email,
//                 unit: lease.property?.address?.street || 'N/A', // Add the property street/unit
//                 amount: amountOwed,
//                 days: monthsPassed * 30, // Simplified "days overdue" for now
//                     // You can add more details like property address if needed
//                 });
//             }
//         }
        
//         // Sort by the highest amount owed
//         overdueTenants.sort((a, b) => b.amount - a.amount);

//         res.status(200).json(overdueTenants);

//     } catch (error) {
//         console.error("Error fetching overdue tenants:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // --- ADD THIS NEW FUNCTION ---
// // @desc    Get all tenants for the landlord's organization
// // @route   GET /api/landlord/tenants
// // @access  Private (Landlord Only)
// // const getAllTenants = async (req, res) => {
// //     try {
// //         const tenants = await User.find({
// //             organization: req.user.organization,
// //             role: 'tenant'
// //         }).select('name'); // Select only the ID and name fields

// //         res.status(200).json(tenants);
// //     } catch (error) {
// //         console.error("Error fetching tenants:", error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // };

// const getAllTenants = async (req, res) => {
//     try {
//         // --- FIX: Find all users with the role 'tenant' ---
//         // This is a temporary fix for development. A full invitation system would be needed in production.
//         const tenants = await User.find({ role: 'tenant' }).select('name');

//         res.status(200).json(tenants);
//     } catch (error) {
//         console.error("Error fetching tenants:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = {
//     getOverdueTenants,
//     getAllTenants,
// };