const { validationResult } = require('express-validator'); 
const asyncHandler = require('express-async-handler');
const Lease = require('../../models/Lease');
const User = require('../../models/User');
const Property = require('../../models/Property');
const LogEntry = require('../../models/LogEntry');
const Application = require('../../models/Application'); // Ensure Application model is imported

/**
 * @desc    Assign a new lease to a tenant and property.
 * @route   POST /api/landlord/leases/assign
 * @access  Private (Landlord Only)
 */
const assignTenantToLease = asyncHandler(async (req, res) => {
    // 1. Validate incoming data from the route
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // applicationId is now optional, for when this is triggered from an application approval
    const { propertyId, tenantId, applicationId, startDate, endDate, rentAmount, securityDeposit } = req.body;

    // 2. Verify the property exists and belongs to the landlord
    const property = await Property.findById(propertyId);
    if (!property || property.organization.toString() !== req.user.organization.toString()) {
        res.status(404);
        throw new Error('Property not found or you are not authorized');
    }

    // 3. Check if the property is already rented
    if (property.status === 'Rented') {
        const existingLease = await Lease.findOne({ property: propertyId, status: 'active' });
        if (existingLease) {
            res.status(409); // 409 Conflict
            throw new Error('This property is already assigned to an active lease.');
        }
    }
    
    // 4. Verify the tenant exists
    const tenant = await User.findById(tenantId);
    if (!tenant || tenant.role !== 'tenant') {
        res.status(404);
        throw new Error('No tenant found with this ID.');
    }

    // 5. Create the new Lease document
    const lease = await Lease.create({
        property: propertyId,
        tenant: tenantId,
        organization: req.user.organization,
        startDate,
        endDate,
        rentAmount,
        securityDeposit, // Added security deposit
        status: new Date(startDate) > new Date() ? 'Upcoming' : 'active' // Make status dynamic
    });

    // 6. Perform related updates in parallel for efficiency
    await Promise.all([
        // Update the property's status to 'Rented'
        Property.findByIdAndUpdate(propertyId, { status: 'Rented' }),
        
        // If an applicationId was provided, update its status to 'Completed'
        applicationId ? Application.findByIdAndUpdate(applicationId, { status: 'Completed' }) : Promise.resolve(),
        
        // Create a log entry for this event
        LogEntry.create({
            organization: req.user.organization,
            actor: req.user.name,
            type: 'Lease',
            message: `Assigned new lease to tenant ${tenant.name} for property ${property.address.street}`,
            property: propertyId,
            tenant: tenantId,
        })
    ]);

    // 7. Populate the new lease with details for the response
    const populatedLease = await Lease.findById(lease._id).populate('property tenant');

    res.status(201).json({ message: 'Tenant successfully assigned and lease created.', lease: populatedLease });
});


module.exports = { 
    assignTenantToLease 
};


// // backend/controllers/landlord/leaseController.js

// At the top with your other imports, add this one for validation:
// const { validationResult } = require('express-validator'); 

// const Lease = require('../../models/Lease');
// const User = require('../../models/User');
// const Property = require('../../models/Property');
// const LogEntry = require('../../models/LogEntry');

// const assignTenantToLease = async (req, res) => {
    
//     // =================================================================
//     // >>> ADD ENHANCEMENT #1 HERE <<<
//     // First, check for any validation errors from the route.
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     // =================================================================

//     const { propertyId, tenantEmail, startDate, endDate, rentAmount } = req.body;

//     try {
//         // 1. Find the property and verify the landlord owns it. (Your code is perfect here)
//         const property = await Property.findById(propertyId);
//         if (!property || property.organization.toString() !== req.user.organization.toString()) {
//             return res.status(404).json({ message: 'Property not found or you are not authorized to access it.' });
//         }

//         // =================================================================
//         // >>> ADD ENHANCEMENT #2 HERE <<<
//         // Before creating a new lease, check if one already exists for this property.
//         const existingLease = await Lease.findOne({ property: propertyId, status: 'active' });
//         if (existingLease) {
//             // Use a 409 Conflict status code to indicate the resource cannot be created
//             // because it would conflict with an existing resource.
//             return res.status(409).json({ message: 'This property is already assigned to an active lease.' });
//         }
//         // =================================================================

//         // 2. Find the user who is the tenant by their email. (Your code is perfect here)
//         const tenant = await User.findOne({ email: tenantEmail, role: 'tenant' });
//         if (!tenant) {
//             return res.status(404).json({ message: 'No tenant found with this email address.' });
//         }

//         // 3. Create the new Lease document. (Your code is perfect here)
//         const lease = await Lease.create({
//             property: propertyId,
//             tenant: tenant._id,
//             organization: req.user.organization,
//             startDate,
//             endDate,
//             rentAmount,
//             status: 'active'
//         });
//         const populatedLease = await Lease.findById(lease._id).populate('property tenant');

//         // --- 2. ADD THIS LOGIC ---
//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'Lease',
//             message: `Assigned new lease to tenant ${populatedLease.tenant.name}`,
//             property: populatedLease.property._id,
//             tenant: populatedLease.tenant._id,
//         });
//         // --- END OF NEW LOGIC ---

//                 // --- ADD THIS LOG ---
//         console.log('✅ Lease successfully created in database:', lease);
        
        
//         res.status(201).json({ message: 'Tenant successfully assigned and lease created.', lease });

//     } catch (error) {
//         console.error("Error creating lease:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { assignTenantToLease };
// const Lease = require('../../models/Lease');
// const User = require('../../models/User');
// const Property = require('../../models/Property');

// // @desc    Assign a tenant to a property, creating a lease
// // @route   POST /api/landlord/leases/assign
// // @access  Private (Landlord Only)
// const assignTenantToLease = async (req, res) => {
//     const { propertyId, tenantEmail, startDate, endDate, rentAmount } = req.body;

//     try {
//         // 1. Find the property and verify the landlord owns it.
//         const property = await Property.findById(propertyId);
//         if (!property || property.organization.toString() !== req.user.organization.toString()) {
//             return res.status(404).json({ message: 'Property not found or you are not authorized to access it.' });
//         }

//         // 2. Find the user who is the tenant by their email.
//         const tenant = await User.findOne({ email: tenantEmail, role: 'tenant' });
//         if (!tenant) {
//             return res.status(404).json({ message: 'No tenant found with this email address.' });
//         }

//         // 3. Create the new Lease document.
//         const lease = await Lease.create({
//             property: propertyId,
//             tenant: tenant._id,
//             organization: req.user.organization, // The landlord's organization
//             startDate,
//             endDate,
//             rentAmount
//         });

//         res.status(201).json({ message: 'Tenant successfully assigned and lease created.', lease });

//     } catch (error) {
//         console.error("Error creating lease:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { assignTenantToLease };