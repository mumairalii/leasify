// tenant_manage/backend/controllers/landlord/tenantController.js

const Lease = require('../../models/Lease');
const Payment = require('../../models/Payment');
const moment = require('moment'); // We'll use moment.js for easier date calculations
const User = require('../../models/User'); // Import User model

// @desc    Get tenants with overdue rent
// @route   GET /api/landlord/tenants/overdue
// @access  Private (Landlord Only)
const getOverdueTenants = async (req, res) => {
    try {
        const organizationId = req.user.organization;

        // 1. Find all active leases for the organization
        // const activeLeases = await Lease.find({
        //     organization: organizationId,
        //     status: 'active'
        // }).populate('tenant', 'name email');
        const activeLeases = await Lease.find({
            organization: organizationId,
            status: 'active'
        }).populate('tenant', 'name email')
          .populate({ // This ensures we get the property address
              path: 'property',
              select: 'address'
          }); 

        if (!activeLeases.length) {
            return res.status(200).json([]);
        }

        // 2. Get all payments for those leases
        const leaseIds = activeLeases.map(lease => lease._id);
        const payments = await Payment.find({ lease: { $in: leaseIds } });

        // 3. Group payments by lease ID for easy lookup
        const paymentsByLease = payments.reduce((acc, payment) => {
            const leaseId = payment.lease.toString();
            if (!acc[leaseId]) {
                acc[leaseId] = 0;
            }
            acc[leaseId] += payment.amount;
            return acc;
        }, {});

        // 4. Calculate overdue status for each lease
        const overdueTenants = [];
        const today = moment();

        for (const lease of activeLeases) {
            const startDate = moment(lease.startDate);
            // Calculate how many full months have passed since the lease started
            const monthsPassed = today.diff(startDate, 'months');
            
            // We consider rent due for the current month as well
            const totalRentDue = (monthsPassed + 1) * lease.rentAmount;
            const totalPaid = paymentsByLease[lease._id.toString()] || 0;
            
            const amountOwed = totalRentDue - totalPaid;

            if (amountOwed > 0) {
                overdueTenants.push({
                     tenantId: lease.tenant._id,
                leaseId: lease._id, // Pass the leaseId for payment logging
                name: lease.tenant.name,
                email: lease.tenant.email,
                unit: lease.property?.address?.street || 'N/A', // Add the property street/unit
                amount: amountOwed,
                days: monthsPassed * 30, // Simplified "days overdue" for now
                    // You can add more details like property address if needed
                });
            }
        }
        
        // Sort by the highest amount owed
        overdueTenants.sort((a, b) => b.amount - a.amount);

        res.status(200).json(overdueTenants);

    } catch (error) {
        console.error("Error fetching overdue tenants:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- ADD THIS NEW FUNCTION ---
// @desc    Get all tenants for the landlord's organization
// @route   GET /api/landlord/tenants
// @access  Private (Landlord Only)
// const getAllTenants = async (req, res) => {
//     try {
//         const tenants = await User.find({
//             organization: req.user.organization,
//             role: 'tenant'
//         }).select('name'); // Select only the ID and name fields

//         res.status(200).json(tenants);
//     } catch (error) {
//         console.error("Error fetching tenants:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

const getAllTenants = async (req, res) => {
    try {
        // --- FIX: Find all users with the role 'tenant' ---
        // This is a temporary fix for development. A full invitation system would be needed in production.
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