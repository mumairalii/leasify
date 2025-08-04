const asyncHandler = require('express-async-handler');
const Lease = require('../../models/Lease');
const User = require('../../models/User');
const mongoose = require('mongoose');
const Payment = require('../../models/Payment');
const MaintenanceRequest = require('../../models/MaintenanceRequest');
const LogEntry = require('../../models/LogEntry');


/**
 * @desc    Get tenants with overdue rent, including amount and days overdue.
 * @route   GET /api/landlord/tenants/overdue
 * @access  Private (Landlord Only)
 */
const getOverdueTenants = asyncHandler(async (req, res) => {
    const organizationId = new mongoose.Types.ObjectId(req.user.organization);

    const overdueTenants = await Lease.aggregate([
        // Stage 1: Find only active leases for the landlord's organization
        { $match: { organization: organizationId, status: 'active' } },

        // Stage 2: Join with payments
        { $lookup: { from: 'payments', localField: '_id', foreignField: 'lease', as: 'paymentHistory' } },

        // --- THIS IS THE CORRECTED LOGIC ---
        // Stage 3: Calculate how many rent payments should have been made to date.
        {
            $addFields: {
                totalPaid: { $sum: '$paymentHistory.amount' },
                // Calculate the number of payment periods that have passed since the lease started.
                // The +1 ensures we account for the very first month's rent.
                paymentPeriodsPassed: { 
                    $max: [1, { $add: [{ $dateDiff: { startDate: "$startDate", endDate: new Date(), unit: "month" } }, 1] }]
                }
            }
        },
        // Stage 4: Calculate the total rent that should have been collected.
        {
            $addFields: {
                totalRentDue: { $multiply: ["$paymentPeriodsPassed", "$rentAmount"] }
            }
        },
        {
            $addFields: {
                amountOwed: { $subtract: ["$totalRentDue", "$totalPaid"] }
            }
        },
        // --- END OF FIX ---

        // Stage 5: Filter for only those who actually owe money
        { $match: { amountOwed: { $gt: 0 } } },

        // Stage 6: Calculate days overdue based on the last payment date
        {
            $addFields: {
                lastPaymentDate: { $max: "$paymentHistory.paymentDate" },
            }
        },
        {
            $addFields: {
                // If no payment has ever been made, the overdue days start from the lease start date.
                lastEffectiveDate: { $ifNull: [ "$lastPaymentDate", "$startDate" ] }
            }
        },

        // Stages 7-9: Lookups and final data shaping
        { $lookup: { from: 'users', localField: 'tenant', foreignField: '_id', as: 'tenantInfo' } },
        { $lookup: { from: 'properties', localField: 'property', foreignField: '_id', as: 'propertyInfo' } },
        {
            $project: {
                _id: 0,
                leaseId: "$_id",
                tenantId: { $arrayElemAt: ["$tenantInfo._id", 0] },
                name: { $arrayElemAt: ["$tenantInfo.name", 0] },
                unit: { $arrayElemAt: ["$propertyInfo.address.street", 0] },
                amount: "$amountOwed",
                days: { $max: [1, { $dateDiff: { startDate: "$lastEffectiveDate", endDate: new Date(), unit: "day" } }] }
            }
        },
        { $sort: { amount: -1 } }
    ]);

    res.status(200).json(overdueTenants);
});


/**
 * @desc    Get all upcoming tenant payments.
 * @route   GET /api/landlord/tenants/upcoming
 * @access  Private (Landlord Only)
 */
const getUpcomingPayments = asyncHandler(async (req, res) => {
    const organizationId = new mongoose.Types.ObjectId(req.user.organization);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of the day

    const activeLeases = await Lease.find({
        organization: organizationId,
        status: 'active'
    })
    .populate('tenant', 'name')
    .populate('property', 'address')
    .lean();

    const upcoming = activeLeases.map(lease => {
        const leaseStartDate = new Date(lease.startDate);
        const dayOfMonthDue = leaseStartDate.getDate();
        
        let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonthDue);
        // If the due date for this month has already passed, check next month's
        if (nextDueDate < today) {
            nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        }

        return { ...lease, nextDueDate };
    })
    // Remove the date filter to show all future payments
    .filter(lease => lease.nextDueDate >= today)
    .map(lease => ({
        tenantId: lease.tenant._id,
        name: lease.tenant.name,
        unit: lease.property.address.street,
        amount: lease.rentAmount,
        dueDate: lease.nextDueDate,
        // Calculate the days remaining until the due date
        daysUntilDue: Math.ceil((new Date(lease.nextDueDate) - today) / (1000 * 60 * 60 * 24))
    }))
    // Sort by closest due date first
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    res.status(200).json(upcoming);
});



/**
 * @desc    Get a single tenant by ID with all their related data
 * @route   GET /api/tenants/:id
 * @access  Private (Landlord Only)
 */
const getTenantById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const organizationId = req.user.organization;

    const tenant = await User.findOne({ _id: id, organization: organizationId, role: 'tenant' }).lean();

    if (!tenant) {
        res.status(404);
        throw new Error('Tenant not found or not part of your organization');
    }

    // Fetch all related data in parallel, now including the communication logs
    const [leases, payments, maintenanceRequests, logs] = await Promise.all([
        Lease.find({ tenant: id }).populate('property', 'address').sort({ startDate: -1 }).lean(),
        Payment.find({ tenant: id }).sort({ paymentDate: -1 }).lean(),
        MaintenanceRequest.find({ tenant: id }).populate('property', 'address').sort({ createdAt: -1 }).lean(),
        // --- THIS IS THE NEW ADDITION ---
        LogEntry.find({ tenant: id, type: 'Communication' }).sort({ createdAt: -1 }).lean()
    ]);
     // Assemble the complete response object
    const tenantDetails = {
        ...tenant,
        leases,
        payments,
        maintenanceRequests,
        logs, // <-- Add logs to the response
    };

    res.status(200).json(tenantDetails);
});



/**
 * @desc    Get all tenants for the organization with their most recent lease to power the "All Tenants" page.
 * @route   GET /api/tenants
 * @access  Private (Landlord Only)
 */
const getAllTenants = asyncHandler(async (req, res) => {
    const organizationId = req.user.organization;

    // 1. Get all users who are tenants in the organization
    const tenants = await User.find({ organization: organizationId, role: 'tenant' }).lean();
    if (!tenants.length) {
        return res.status(200).json([]);
    }
    const tenantIds = tenants.map(t => t._id);

    // 2. Find all leases associated with these tenants
    const allLeases = await Lease.find({ tenant: { $in: tenantIds } })
        .sort({ endDate: -1 }) // Sort by most recent end date
        .populate('property', 'address') // Populate property details
        .lean();

    // 3. Create a map to find the MOST RECENT lease for each tenant efficiently
    const mostRecentLeaseMap = new Map();
    for (const lease of allLeases) {
        const tenantId = lease.tenant.toString();
        // Since the list is sorted, the first lease we encounter for a tenant is their most recent one
        if (!mostRecentLeaseMap.has(tenantId)) {
            mostRecentLeaseMap.set(tenantId, lease);
        }
    }

    // 4. Map the most recent lease to each tenant
    const tenantsWithLeaseData = tenants.map(tenant => {
        const mostRecentLease = mostRecentLeaseMap.get(tenant._id.toString()) || null;
        return {
            ...tenant,
            mostRecentLease: mostRecentLease,
        };
    });

    res.status(200).json(tenantsWithLeaseData);
});

module.exports = {
    getOverdueTenants,
    getAllTenants,
    getTenantById,
    getUpcomingPayments,
};

// const asyncHandler = require('express-async-handler');
// const Lease = require('../../models/Lease');
// const User = require('../../models/User');
// const mongoose = require('mongoose');
// const Payment = require('../../models/Payment');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const LogEntry = require('../../models/LogEntry');


// /**
//  * @desc    Get tenants with overdue rent, including amount and days overdue.
//  * @route   GET /api/landlord/tenants/overdue
//  * @access  Private (Landlord Only)
//  */
// const getOverdueTenants = asyncHandler(async (req, res) => {
//     const organizationId = new mongoose.Types.ObjectId(req.user.organization);

//     const overdueTenants = await Lease.aggregate([
//         { $match: { organization: organizationId, status: 'active' } },
//         { $lookup: { from: 'payments', localField: '_id', foreignField: 'lease', as: 'paymentHistory' } },
//         {
//             $addFields: {
//                 totalPaid: { $sum: '$paymentHistory.amount' },
//                 // Correctly calculate how many payment periods have passed.
//                 // The +1 accounts for the first month's rent being due at the start.
//                 paymentPeriodsPassed: { 
//                     $max: [1, { $add: [{ $dateDiff: { startDate: "$startDate", endDate: new Date(), unit: "month" } }, 1] }]
//                 }
//             }
//         },
//         {
//             $addFields: {
//                 totalRentDue: { $multiply: ["$paymentPeriodsPassed", "$rentAmount"] },
//             }
//         },
//         {
//             $addFields: {
//                 amountOwed: { $subtract: ["$totalRentDue", "$totalPaid"] }
//             }
//         },
//         { $match: { amountOwed: { $gt: 0 } } },
//         {
//             $addFields: {
//                 lastPaymentDate: { $max: "$paymentHistory.paymentDate" },
//             }
//         },
//         {
//             $addFields: {
//                 lastEffectiveDate: { $ifNull: [ "$lastPaymentDate", "$startDate" ] }
//             }
//         },
//         { $lookup: { from: 'users', localField: 'tenant', foreignField: '_id', as: 'tenantInfo' } },
//         { $lookup: { from: 'properties', localField: 'property', foreignField: '_id', as: 'propertyInfo' } },
//         {
//             $project: {
//                 _id: 0,
//                 leaseId: "$_id",
//                 tenantId: { $arrayElemAt: ["$tenantInfo._id", 0] },
//                 name: { $arrayElemAt: ["$tenantInfo.name", 0] },
//                 unit: { $arrayElemAt: ["$propertyInfo.address.street", 0] },
//                 amount: "$amountOwed",
//                 days: { $max: [1, { $dateDiff: { startDate: "$lastEffectiveDate", endDate: new Date(), unit: "day" } }] }
//             }
//         },
//         { $sort: { amount: -1 } }
//     ]);

//     res.status(200).json(overdueTenants);
// });

// /**
//  * @desc    Get ALL active tenants and their next payment due date.
//  * @route   GET /api/landlord/tenants/upcoming
//  * @access  Private (Landlord Only)
//  */
// const getUpcomingPayments = asyncHandler(async (req, res) => {
//     const organizationId = new mongoose.Types.ObjectId(req.user.organization);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const activeLeases = await Lease.find({
//         organization: organizationId,
//         status: 'active'
//     })
//     .populate('tenant', 'name')
//     .populate('property', 'address')
//     .lean();

//     const upcoming = activeLeases.map(lease => {
//         const leaseStartDate = new Date(lease.startDate);
//         const dayOfMonthDue = leaseStartDate.getDate();
        
//         let nextDueDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonthDue);
//         if (nextDueDate < today) {
//             nextDueDate.setMonth(nextDueDate.getMonth() + 1);
//         }

//         return {
//             tenantId: lease.tenant._id,
//             name: lease.tenant.name,
//             unit: lease.property.address.street,
//             amount: lease.rentAmount,
//             dueDate: nextDueDate,
//             daysUntilDue: Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24))
//         };
//     }).sort((a, b) => a.daysUntilDue - b.daysUntilDue); // Sort by soonest due date

//     res.status(200).json(upcoming);
// });



// /**
//  * @desc    Get a single tenant by ID with all their related data
//  * @route   GET /api/tenants/:id
//  * @access  Private (Landlord Only)
//  */
// const getTenantById = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const organizationId = req.user.organization;

//     const tenant = await User.findOne({ _id: id, organization: organizationId, role: 'tenant' }).lean();

//     if (!tenant) {
//         res.status(404);
//         throw new Error('Tenant not found or not part of your organization');
//     }

//     // Fetch all related data in parallel, now including the communication logs
//     const [leases, payments, maintenanceRequests, logs] = await Promise.all([
//         Lease.find({ tenant: id }).populate('property', 'address').sort({ startDate: -1 }).lean(),
//         Payment.find({ tenant: id }).sort({ paymentDate: -1 }).lean(),
//         MaintenanceRequest.find({ tenant: id }).populate('property', 'address').sort({ createdAt: -1 }).lean(),
//         // --- THIS IS THE NEW ADDITION ---
//         LogEntry.find({ tenant: id, type: 'Communication' }).sort({ createdAt: -1 }).lean()
//     ]);
//      // Assemble the complete response object
//     const tenantDetails = {
//         ...tenant,
//         leases,
//         payments,
//         maintenanceRequests,
//         logs, // <-- Add logs to the response
//     };

//     res.status(200).json(tenantDetails);
// });



// /**
//  * @desc    Get all tenants for the organization with their most recent lease to power the "All Tenants" page.
//  * @route   GET /api/tenants
//  * @access  Private (Landlord Only)
//  */
// const getAllTenants = asyncHandler(async (req, res) => {
//     const organizationId = req.user.organization;

//     // 1. Get all users who are tenants in the organization
//     const tenants = await User.find({ organization: organizationId, role: 'tenant' }).lean();
//     if (!tenants.length) {
//         return res.status(200).json([]);
//     }
//     const tenantIds = tenants.map(t => t._id);

//     // 2. Find all leases associated with these tenants
//     const allLeases = await Lease.find({ tenant: { $in: tenantIds } })
//         .sort({ endDate: -1 }) // Sort by most recent end date
//         .populate('property', 'address') // Populate property details
//         .lean();

//     // 3. Create a map to find the MOST RECENT lease for each tenant efficiently
//     const mostRecentLeaseMap = new Map();
//     for (const lease of allLeases) {
//         const tenantId = lease.tenant.toString();
//         // Since the list is sorted, the first lease we encounter for a tenant is their most recent one
//         if (!mostRecentLeaseMap.has(tenantId)) {
//             mostRecentLeaseMap.set(tenantId, lease);
//         }
//     }

//     // 4. Map the most recent lease to each tenant
//     const tenantsWithLeaseData = tenants.map(tenant => {
//         const mostRecentLease = mostRecentLeaseMap.get(tenant._id.toString()) || null;
//         return {
//             ...tenant,
//             mostRecentLease: mostRecentLease,
//         };
//     });

//     res.status(200).json(tenantsWithLeaseData);
// });

// module.exports = {
//     getOverdueTenants,
//     getAllTenants,
//     getTenantById,
//     getUpcomingPayments,
// };

// const asyncHandler = require('express-async-handler');
// const Lease = require('../../models/Lease');
// const User = require('../../models/User');
// const mongoose = require('mongoose');

// /**
//  * @desc    Get tenants with overdue rent using an efficient aggregation pipeline
//  * @route   GET /api/landlord/tenants/overdue
//  * @access  Private (Landlord Only)
//  */
// const getOverdueTenants = asyncHandler(async (req, res) => {
//     const organizationId = new mongoose.Types.ObjectId(req.user.organization);

//     const overdueTenants = await Lease.aggregate([
//         // Stage 1: Find only the active leases for the current landlord's organization
//         { $match: { organization: organizationId, status: 'active' } },
//         // Stage 2: Join with the 'payments' collection
//         { $lookup: { from: 'payments', localField: '_id', foreignField: 'lease', as: 'paymentHistory' } },
//         // Stage 3: Create new computed fields for what's due and what's been paid
//         {
//             $addFields: {
//                 totalPaid: { $sum: '$paymentHistory.amount' },
//                 monthsPassed: {
//                     $max: [0, { $dateDiff: { startDate: "$startDate", endDate: new Date(), unit: "month" } }]
//                 }
//             }
//         },
//         // Stage 4: Calculate the total rent due and the balance owed
//         {
//             $addFields: {
//                 totalRentDue: { $multiply: [{ $add: ["$monthsPassed", 1] }, "$rentAmount"] }
//             }
//         },
//         {
//             $addFields: {
//                 amountOwed: { $subtract: ["$totalRentDue", "$totalPaid"] }
//             }
//         },
//         // Stage 5: Filter for only those who owe money
//         { $match: { amountOwed: { $gt: 0 } } },
//         // Stage 6: Join with 'users' to get tenant details
//         { $lookup: { from: 'users', localField: 'tenant', foreignField: '_id', as: 'tenantInfo' } },
//         // Stage 7: Join with 'properties' to get property details
//         { $lookup: { from: 'properties', localField: 'property', foreignField: '_id', as: 'propertyInfo' } },
//         // Stage 8: Reshape the final output
//         {
//             $project: {
//                 _id: 0,
//                 leaseId: "$_id",
//                 tenantId: { $arrayElemAt: ["$tenantInfo._id", 0] },
//                 name: { $arrayElemAt: ["$tenantInfo.name", 0] },
//                 email: { $arrayElemAt: ["$tenantInfo.email", 0] },
//                 unit: { $arrayElemAt: ["$propertyInfo.address.street", 0] },
//                 amount: "$amountOwed"
//             }
//         },
//         // Stage 9: Sort by the highest amount owed
//         { $sort: { amount: -1 } }
//     ]);

//     res.status(200).json(overdueTenants);
// });

// /**
//  * @desc    Get all tenants associated with the landlord's organization
//  * @route   GET /api/landlord/tenants
//  * @access  Private (Landlord Only)
//  */
// const getAllTenants = asyncHandler(async (req, res) => {
//     const tenants = await User.find({ 
//         organization: req.user.organization, 
//         role: 'tenant' 
//     }).select('name email');
    
//     res.status(200).json(tenants);
// });

// module.exports = {
//     getOverdueTenants,
//     getAllTenants,
// };

// const Lease = require('../../models/Lease');
// const Payment = require('../../models/Payment');
// const moment = require('moment');
// const User = require('../../models/User');
// const mongoose = require('mongoose'); // Import mongoose for ObjectId

// // @desc    Get tenants with overdue rent using an efficient aggregation pipeline
// // @route   GET /api/landlord/tenants/overdue
// // @access  Private (Landlord Only)
// const getOverdueTenants = async (req, res) => {
//     try {
//         const organizationId = new mongoose.Types.ObjectId(req.user.organization);

//         const overdueTenants = await Lease.aggregate([
//             // Stage 1: Find only the active leases for the current landlord's organization
//             {
//                 $match: {
//                     organization: organizationId,
//                     status: 'active'
//                 }
//             },
//             // Stage 2: Join with the 'payments' collection to get all payments for each lease
//             {
//                 $lookup: {
//                     from: 'payments',
//                     localField: '_id',
//                     foreignField: 'lease',
//                     as: 'paymentHistory'
//                 }
//             },
//             // Stage 3: Create new computed fields for what's due and what's been paid
//             {
//                 $addFields: {
//                     totalPaid: { $sum: '$paymentHistory.amount' },
//                     monthsPassed: {
//                         $max: [0, { // Ensure months passed is not negative
//                             $dateDiff: {
//                                 startDate: "$startDate",
//                                 endDate: new Date(),
//                                 unit: "month"
//                             }
//                         }]
//                     }
//                 }
//             },
//             // Stage 4: Calculate the total rent due and the balance owed
//             {
//                 $addFields: {
//                     totalRentDue: { $multiply: [ { $add: ["$monthsPassed", 1] }, "$rentAmount" ] },
//                 }
//             },
//             {
//                 $addFields: {
//                     amountOwed: { $subtract: ["$totalRentDue", "$totalPaid"] }
//                 }
//             },
//             // Stage 5: Filter out any leases where the amount owed is zero or less
//             {
//                 $match: {
//                     amountOwed: { $gt: 0 }
//                 }
//             },
//             // Stage 6: Join with the 'users' collection to get tenant details
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'tenant',
//                     foreignField: '_id',
//                     as: 'tenantInfo'
//                 }
//             },
//             // Stage 7: Join with the 'properties' collection to get property details
//             {
//                 $lookup: {
//                     from: 'properties',
//                     localField: 'property',
//                     foreignField: '_id',
//                     as: 'propertyInfo'
//                 }
//             },
//             // Stage 8: Reshape the final output to be clean and flat
//             {
//                 $project: {
//                     _id: 0, // Exclude the default _id
//                     leaseId: "$_id",
//                     tenantId: { $arrayElemAt: ["$tenantInfo._id", 0] },
//                     name: { $arrayElemAt: ["$tenantInfo.name", 0] },
//                     email: { $arrayElemAt: ["$tenantInfo.email", 0] },
//                     unit: { $arrayElemAt: ["$propertyInfo.address.street", 0] },
//                     amount: "$amountOwed"
//                 }
//             },
//             // Stage 9: Sort by the highest amount owed
//             {
//                 $sort: {
//                     amount: -1
//                 }
//             }
//         ]);

//         res.status(200).json(overdueTenants);

//     } catch (error) {
//         console.error("Error fetching overdue tenants:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // ... (getAllTenants function remains the same)
// const getAllTenants = async (req, res) => {
//     try {
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