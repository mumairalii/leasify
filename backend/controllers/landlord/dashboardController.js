const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Property = require('../../models/Property');
const MaintenanceRequest = require('../../models/MaintenanceRequest');
const Lease = require('../../models/Lease');
const { eachMonthOfInterval, startOfYear, endOfYear } = require('date-fns');

const Payment = require('../../models/Payment');
const { startOfMonth, endOfMonth, subMonths, format } = require('date-fns');

/**
 * @desc    Get comprehensive dashboard statistics for a landlord
 * @route   GET /api/landlord/dashboard/stats
 * @access  Private (Landlord Only)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
    const organizationId = new mongoose.Types.ObjectId(req.user.organization);
    const now = new Date();

    // --- 1. CORE KPIs ---
    const [
        totalProperties,
        openMaintenanceCount,
        occupiedProperties,
        leasesExpiringSoon,
        totalOutstandingDebtData,
        thisMonthRentData
    ] = await Promise.all([
        Property.countDocuments({ organization: organizationId }),
        MaintenanceRequest.countDocuments({ organization: organizationId, status: { $ne: 'Completed' } }),
        Lease.find({ organization: organizationId, status: 'active' }).distinct('property'),
        Lease.countDocuments({
            organization: organizationId,
            status: 'active',
            endDate: { $gte: now, $lte: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000) }
        }),
        Lease.aggregate([
            { $match: { organization: organizationId, status: 'active' } },
            { $lookup: { from: 'payments', localField: '_id', foreignField: 'lease', as: 'payments' } },
            { $project: {
                rentOwed: { $multiply: ["$rentAmount", 12] }, // Simplified for example; real logic would be more complex
                totalPaid: { $sum: "$payments.amount" }
            }},
            { $group: {
                _id: null,
                totalRent: { $sum: "$rentOwed" },
                totalPaid: { $sum: "$totalPaid" }
            }},
            { $project: { _id: 0, outstanding: { $subtract: ["$totalRent", "$totalPaid"] } } }
        ]),
        Payment.aggregate([
            { $match: {
                organization: organizationId,
                paymentDate: { $gte: startOfMonth(now), $lte: endOfMonth(now) },
                method: { $ne: 'Security Deposit' } // Assuming you might have other payment types
            }},
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
    ]);
    // --- START: NEW OCCUPANCY CHART LOGIC ---
    const yearlyInterval = { start: subMonths(now, 11), end: now };
    const monthSeries = eachMonthOfInterval(yearlyInterval);
    
    const activeLeasesByMonth = await Lease.aggregate([
        { $match: { organization: organizationId, status: 'active' } },
        { $project: {
            month: { $month: "$startDate" },
            year: { $year: "$startDate" }
        }}
    ]);

    const occupancyChartData = monthSeries.map(monthDate => {
        const month = monthDate.getMonth() + 1;
        const year = monthDate.getFullYear();
        
        const activeLeases = activeLeasesByMonth.filter(lease => {
            // Simplified logic: This counts leases starting in or before this month of this year.
            // A more complex version could check if the date is between start/end dates.
            return lease.year < year || (lease.year === year && lease.month <= month);
        }).length;
        
        const rate = totalProperties > 0 ? Math.round((activeLeases / totalProperties) * 100) : 0;
        
        return {
            name: format(monthDate, 'MMM'),
            occupancyRate: rate
        };
    });
    // --- END: NEW OCCUPANCY CHART LOGIC ---

    // --- 2. DATA FOR CHARTS (Last 6 Months) ---
    const monthLabels = Array.from({ length: 6 }, (_, i) => format(subMonths(now, i), 'MMM yyyy')).reverse();
    const monthlyData = await Lease.aggregate([
      { $match: { organization: organizationId } },
      {
        $lookup: {
          from: 'payments',
          let: { leaseId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$lease', '$$leaseId'] } } },
            { $project: { amount: 1, paymentDate: 1, month: { $month: '$paymentDate' }, year: { $year: '$paymentDate' } } }
          ],
          as: 'payments'
        }
      },
      {
        $project: {
          rentAmount: 1,
          payments: 1,
          start: '$startDate',
          end: '$endDate'
        }
      }
    ]);
    
    const rentCollectionChart = monthLabels.map(label => {
        const [monthStr, yearStr] = label.split(' ');
        const month = new Date(Date.parse(monthStr +" 1, " + yearStr)).getMonth() + 1;
        const year = parseInt(yearStr);
        let totalDue = 0;
        let totalPaid = 0;

        monthlyData.forEach(lease => {
            const leaseStart = new Date(lease.start);
            const leaseEnd = new Date(lease.end);
            if (leaseStart.getFullYear() <= year && leaseStart.getMonth() + 1 <= month &&
                leaseEnd.getFullYear() >= year && leaseEnd.getMonth() + 1 >= month) {
                totalDue += lease.rentAmount;
            }
            lease.payments.forEach(p => {
                if (p.year === year && p.month === month) {
                    totalPaid += p.amount;
                }
            });
        });
        return { name: label.split(' ')[0], totalDue, totalPaid };
    });

    // --- 3. CALCULATE & FINALIZE ---
    const occupiedPropertyCount = occupiedProperties.length;
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedPropertyCount / totalProperties) * 100) : 0;
    const totalOutstandingDebt = totalOutstandingDebtData[0]?.outstanding || 0;
    const collectedThisMonth = thisMonthRentData[0]?.total || 0;
    const potentialMonthlyRent = monthlyData.reduce((acc, lease) => {
        const leaseStart = new Date(lease.start);
        const leaseEnd = new Date(lease.end);
        if (leaseStart <= now && leaseEnd >= now) {
            return acc + lease.rentAmount;
        }
        return acc;
    }, 0);


    res.status(200).json({
        kpis: {
            totalProperties,
            occupancyRate,
            vacantUnits: totalProperties - occupiedPropertyCount,
            openMaintenanceCount,
            leasesExpiringSoon,
            totalOutstandingDebt,
            collectedThisMonth,
            potentialMonthlyRent
        },
        charts: {
            rentCollection: rentCollectionChart,
            occupancy: occupancyChartData // <-- ADD THIS LINE
            // We can add occupancyChartData here later
        }
    });
});

module.exports = { getDashboardStats };

// const asyncHandler = require('express-async-handler');
// const mongoose = require('mongoose'); // <-- FIX #1: Import mongoose
// const Property = require('../../models/Property');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const Lease = require('../../models/Lease'); // <-- FIX #2: Import Lease to calculate occupancy

// /**
//  * @desc    Get dashboard statistics for a landlord
//  * @route   GET /api/landlord/dashboard/stats
//  * @access  Private (Landlord Only)
//  */
// const getDashboardStats = asyncHandler(async (req, res) => {
//     const organizationId = new mongoose.Types.ObjectId(req.user.organization);

//     // Run all database queries in parallel for maximum efficiency
//     const [
//         totalProperties,
//         monthlyRentData,
//         openMaintenanceCount,
//         highPriorityMaintenance,
//         occupiedProperties // Get a list of unique properties with active leases
//     ] = await Promise.all([
//         Property.countDocuments({ organization: organizationId }),
//         Property.aggregate([
//             { $match: { organization: organizationId } },
//             { $group: { _id: null, totalRent: { $sum: '$rentAmount' } } }
//         ]),
//         MaintenanceRequest.countDocuments({ organization: organizationId, status: { $ne: 'Completed' } }),
//         MaintenanceRequest.countDocuments({ organization: organizationId, priority: 'High', status: { $ne: 'Completed' } }),
//         // --- FIX #3: This is the correct way to count occupied units ---
//         Lease.find({ organization: organizationId, status: 'active' }).distinct('property')
//     ]);

//     const occupiedPropertyCount = occupiedProperties.length;
//     const occupancyRate = totalProperties > 0 
//         ? Math.round((occupiedPropertyCount / totalProperties) * 100) 
//         : 0;
//     const vacantUnits = totalProperties - occupiedPropertyCount;
//     const rent = monthlyRentData[0]?.totalRent || 0;

//     res.status(200).json({
//         totalProperties,
//         vacantUnits,
//         totalMonthlyRent: rent,
//         openMaintenanceCount,
//         highPriorityMaintenance,
//         occupancyRate,
//     });
// });

// module.exports = { getDashboardStats };

// // tenant_manage/backend/controllers/landlord/dashboardController.js

// const mongoose = require('mongoose');
// const Property = require('../../models/Property');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const Lease = require('../../models/Lease');

// // @desc    Get dashboard statistics for a landlord
// // @route   GET /api/landlord/dashboard/stats
// // @access  Private (Landlord Only)
// const getDashboardStats = async (req, res) => {
//     try {
//         const organizationId = new mongoose.Types.ObjectId(req.user.organization);

//         const [
//             totalProperties,
//             monthlyRentData,
//             openMaintenanceCount,
//             // --- THIS IS THE FIX ---
//             // Get a list of unique property IDs that have active leases
//             occupiedProperties
//         ] = await Promise.all([
//             Property.countDocuments({ organization: organizationId }),
//             Property.aggregate([
//                 { $match: { organization: organizationId } },
//                 { $group: { _id: null, totalRent: { $sum: '$rentAmount' } } }
//             ]),
//             MaintenanceRequest.countDocuments({ organization: organizationId, status: { $ne: 'Completed' } }),
//             // This query now finds all unique properties associated with active leases
//             Lease.find({ organization: organizationId, status: 'active' }).distinct('property')
//         ]);

//         // The number of occupied properties is the length of the unique list
//         const occupiedPropertyCount = occupiedProperties.length;

//         // --- Calculate rate and vacant units based on the accurate count ---
//         const occupancyRate = totalProperties > 0 
//             ? Math.round((occupiedPropertyCount / totalProperties) * 100) 
//             : 0;
            
//         const vacantUnits = totalProperties - occupiedPropertyCount;
        
//         const highPriorityMaintenance = await MaintenanceRequest.countDocuments({ 
//             organization: organizationId, 
//             status: 'Pending' // Or a dedicated 'priority' field if you add one later
//         });

//         const stats = {
//             totalProperties,
//             totalMonthlyRent: monthlyRentData[0]?.totalRent || 0,
//             openMaintenanceCount,
//             occupancyRate,
//             vacantUnits,
//             highPriorityMaintenance
//         };

//         res.status(200).json(stats);
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getDashboardStats };


// const mongoose = require('mongoose');
// const Property = require('../../models/Property');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const Lease = require('../../models/Lease');

// const getDashboardStats = async (req, res) => {
//     try {
//         const organizationId = new mongoose.Types.ObjectId(req.user.organization);

//         const [
//             totalProperties,
//             monthlyRentData,
//             openMaintenanceCount,
//             // --- NEW: Get a list of unique property IDs that have active leases ---
//             occupiedProperties
//         ] = await Promise.all([
//             Property.countDocuments({ organization: organizationId }),
//             Property.aggregate([
//                 { $match: { organization: organizationId } },
//                 { $group: { _id: null, totalRent: { $sum: '$rentAmount' } } }
//             ]),
//             MaintenanceRequest.countDocuments({ organization: organizationId, status: { $ne: 'Completed' } }),
//             // This query now finds all unique properties associated with active leases
//             Lease.find({ organization: organizationId, status: 'active' }).distinct('property')
//         ]);

//         const occupiedPropertyCount = occupiedProperties.length;

//         // --- NEW: Calculate rate based on unique occupied properties ---
//         const occupancyRate = totalProperties > 0 
//             ? Math.round((occupiedPropertyCount / totalProperties) * 100) 
//             : 0;
            
//         const vacantUnits = totalProperties - occupiedPropertyCount;

//         const stats = {
//             totalProperties,
//             totalMonthlyRent: monthlyRentData[0]?.totalRent || 0,
//             openMaintenanceCount,
//             occupancyRate,
//             vacantUnits,
//         };

//         res.status(200).json(stats);
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getDashboardStats };

// // tenant_manage/backend/controllers/landlord/dashboardController.js

// const mongoose = require('mongoose');
// const Property = require('../../models/Property');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');
// const Lease = require('../../models/Lease');

// // @desc    Get dashboard statistics for a landlord
// // @route   GET /api/landlord/dashboard/stats
// // @access  Private (Landlord Only)
// const getDashboardStats = async (req, res) => {
//     try {
//         const organizationId = new mongoose.Types.ObjectId(req.user.organization);

//         // --- Perform all database calculations in parallel for efficiency ---
//         const [
//             totalProperties,
//             monthlyRentData,
//             openMaintenanceCount,
//             activeLeaseCount
//         ] = await Promise.all([
//             Property.countDocuments({ organization: organizationId }),
//             Property.aggregate([
//                 { $match: { organization: organizationId } },
//                 { $group: { _id: null, totalRent: { $sum: '$rentAmount' } } }
//             ]),
//             MaintenanceRequest.countDocuments({ organization: organizationId, status: { $ne: 'Completed' } }),
//             Lease.countDocuments({ organization: organizationId, status: 'active' })
//         ]);

//         // --- Calculate Occupancy Rate and Vacant Units ---
//         const occupancyRate = totalProperties > 0 
//             ? Math.round((activeLeaseCount / totalProperties) * 100) 
//             : 0;
            
//         const vacantUnits = totalProperties - activeLeaseCount;

//         const stats = {
//             totalProperties,
//             totalMonthlyRent: monthlyRentData[0]?.totalRent || 0,
//             openMaintenanceCount,
//             occupancyRate, // Use the new dynamic value
//             vacantUnits,    // Add the new vacant units calculation
//         };

//         res.status(200).json(stats);
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getDashboardStats };

// const Property = require('../../models/Property');
// const MaintenanceRequest = require('../../models/MaintenanceRequest');

// const mongoose = require('mongoose');

// // @desc    Get dashboard statistics for a landlord
// // @route   GET /api/landlord/dashboard/stats
// // @access  Private (Landlord Only)
// const getDashboardStats = async (req, res) => {
//     try {
//         const organizationId = req.user.organization;

//         // --- Perform database calculations in parallel for efficiency ---
//         const [
//             totalProperties,
//             monthlyRentData,
//             openMaintenanceCount,
//             activeLeaseCount
//         ] = await Promise.all([
//             Property.countDocuments({ organization: organizationId }),
//             Property.aggregate([
//                 { $match: { organization: new mongoose.Types.ObjectId(organizationId) } },
//                 { $group: { _id: null, totalRent: { $sum: '$rentAmount' } } }
//             ]),
//             MaintenanceRequest.countDocuments({ organization: organizationId, status: { $ne: 'Completed' } })
//         ]);

//         // 3. Calculate the occupancy rate
//         // Avoid division by zero if there are no properties
//         const occupancyRate = totalProperties > 0 
//             ? Math.round((activeLeaseCount / totalProperties) * 100) 
//             : 0;

//         const stats = {
//             totalProperties: totalProperties,
//             totalMonthlyRent: monthlyRentData[0]?.totalRent || 0,
//             openMaintenanceCount: openMaintenanceCount,
//             occupancyRate: occupancyRate, // Placeholder until tenant leases are tracked
//         };

//         res.status(200).json(stats);
//     } catch (error) {
//         console.error("Error fetching dashboard stats:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getDashboardStats };