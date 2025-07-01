const asyncHandler = require('express-async-handler');
const Property = require('../../models/Property');
const MaintenanceRequest = require('../../models/MaintenanceRequest');

/**
 * @desc    Get dashboard statistics for the landlord
 * @route   GET /api/landlord/dashboard/stats
 * @access  Private (Landlord Only)
 */
const getDashboardStats = asyncHandler(async (req, res) => {
    const organizationId = req.user.organization;

    // Run all database queries in parallel for maximum efficiency
    const [
        totalProperties,
        vacantUnits,
        totalMonthlyRent,
        openMaintenanceCount,
        highPriorityMaintenance
    ] = await Promise.all([
        Property.countDocuments({ organization: organizationId }),
        Property.countDocuments({ organization: organizationId, status: 'Vacant' }),
        Property.aggregate([
            { $match: { organization: new mongoose.Types.ObjectId(organizationId) } },
            { $group: { _id: null, totalRent: { $sum: '$rentAmount' } } }
        ]),
        MaintenanceRequest.countDocuments({ organization: organizationId, status: { $ne: 'Completed' } }),
        MaintenanceRequest.countDocuments({ organization: organizationId, priority: 'High', status: { $ne: 'Completed' } })
    ]);

    const occupancyRate = totalProperties > 0 ? Math.round(((totalProperties - vacantUnits) / totalProperties) * 100) : 0;
    const rent = totalMonthlyRent[0]?.totalRent || 0;

    res.status(200).json({
        totalProperties,
        vacantUnits,
        totalMonthlyRent: rent,
        openMaintenanceCount,
        highPriorityMaintenance,
        occupancyRate,
    });
});

module.exports = { getDashboardStats };

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