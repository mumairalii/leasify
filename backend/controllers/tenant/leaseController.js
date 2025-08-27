const Lease = require('../../models/Lease');
const Payment = require('../../models/Payment');
const { parseISO } = require('date-fns');

// @desc    Get the active lease for the currently logged-in tenant
// @route   GET /api/tenant/lease/my-lease
// @access  Private (Tenant Only)
const getMyLease = async (req, res) => {
    try {
        const lease = await Lease.findOne({ tenant: req.user.id, status: 'active' })
            .populate('property', 'address rentAmount');

        if (!lease) {
            return res.status(404).json({ message: 'No active lease found for this user.' });
        }

        const payments = await Payment.find({ lease: lease._id });
        const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);

        const startDate = lease.startDate;
        const today = new Date();
        const monthsPassed =
            (today.getFullYear() - startDate.getFullYear()) * 12 +
            (today.getMonth() - startDate.getMonth());
        const totalRentDueToDate = (monthsPassed + 1) * lease.rentAmount;
        const currentBalance = totalRentDueToDate - totalPaid;

        res.status(200).json({ ...lease.toObject(), currentBalance });

    } catch (error) {
        console.error('Error fetching tenant lease:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get detailed lease information for the logged-in tenant
// @route   GET /api/tenant/lease
// @access  Private (Tenant Only)
const getLeaseDetails = async (req, res) => {
    try {
        const lease = await Lease.findOne({ tenant: req.user.id, status: 'active' })
            .populate('property', 'address rentAmount bedrooms bathrooms squareFootage description amenities')
            .populate('tenant', 'name email phone')
            .lean();

        if (!lease) {
            return res.status(404).json({ message: 'No active lease found for this user.' });
        }

        // Get payment history for this lease
        const payments = await Payment.find({ lease: lease._id })
            .sort({ paymentDate: -1 })
            .lean();

        // Calculate lease statistics
        const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
        const startDate = lease.startDate;
        const today = new Date();
        const monthsPassed = Math.max(0, 
            (today.getFullYear() - startDate.getFullYear()) * 12 +
            (today.getMonth() - startDate.getMonth())
        );
        const totalRentDueToDate = (monthsPassed + 1) * lease.rentAmount;
        const currentBalance = totalRentDueToDate - totalPaid;

        // Format the response
        const leaseDetails = {
            ...lease,
            payments,
            financialSummary: {
                totalPaid,
                totalRentDueToDate,
                currentBalance,
                monthsPassed
            }
        };

        res.status(200).json(leaseDetails);

    } catch (error) {
        console.error('Error fetching lease details:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getMyLease, getLeaseDetails };
