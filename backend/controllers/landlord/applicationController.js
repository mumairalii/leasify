const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Application = require('../../models/Application');
const Property = require('../../models/Property');
const User = require('../../models/User');
const Lease = require('../../models/Lease');
const LogEntry = require('../../models/LogEntry');

const createApplication = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }

    const { propertyId, message } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found');
    }

    const newApplication = await Application.create({
        tenant: req.user.id,
        landlord: property.owner,
        organization: property.organization,
        property: propertyId,
        message,
        status: 'Pending',
    });

    res.status(201).json(newApplication);
});

const getApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({
        organization: req.user.organization,
        status: 'Pending'
    }).populate('tenant', 'name email').populate('property', 'address');

    res.status(200).json(applications);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }

    const { status } = req.body;
    const { id } = req.params;
    const { organization, name: actorName } = req.user;

    const application = await Application.findOneAndUpdate(
        { _id: id, organization: organization, status: 'Pending' },
        { status: status },
        { new: false }
    ).populate('tenant property');

    if (!application) {
        res.status(404);
        throw new Error('Pending application not found or you are not authorized.');
    }

    if (status === 'Approved') {
        const existingLease = await Lease.findOne({ property: application.property._id, status: 'active' });
        if (existingLease) {
            application.status = 'Pending';
            await application.save();
            res.status(409);
            throw new Error('This property has already been assigned an active lease.');
        }

        await Lease.create({
            property: application.property._id,
            tenant: application.tenant._id,
            organization: application.organization,
            startDate: application.requestedStartDate || new Date(),
            endDate: application.requestedEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            rentAmount: application.property.rentAmount,
            status: 'active'
        });

        await User.findByIdAndUpdate(application.tenant._id, {
            organization: application.organization
        });
    }

    await LogEntry.create({
        organization,
        actor: actorName,
        type: 'System',
        message: `Application for ${application.tenant.name} was ${status.toLowerCase()}`,
        tenant: application.tenant._id,
        property: application.property._id,
    });

    const finalApplicationState = application.toObject();
    finalApplicationState.status = status;

    res.status(200).json(finalApplicationState);
});

module.exports = {
    createApplication,
    getApplications,
    updateApplicationStatus,
};

// const asyncHandler = require('express-async-handler');
// const Application = require('../../models/Application');
// const Property = require('../../models/Property');
// const User = require('../../models/User');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');

// /**
//  * @desc    Tenant submits a new application for a property
//  * @route   POST /api/applications
//  * @access  Private (Tenant Only)
//  */
// const createApplication = asyncHandler(async (req, res) => {
//     const { propertyId, message } = req.body;

//     const property = await Property.findById(propertyId);
//     if (!property) {
//         res.status(404);
//         throw new Error('Property not found');
//     }

//     const newApplication = await Application.create({
//         tenant: req.user.id,
//         landlord: property.owner,
//         organization: property.organization,
//         property: propertyId,
//         message,
//         status: 'Pending',
//     });

//     res.status(201).json(newApplication);
// });

// /**
//  * @desc    Landlord gets all pending applications for their organization
//  * @route   GET /api/applications
//  * @access  Private (Landlord Only)
//  */
// const getApplications = asyncHandler(async (req, res) => {
//     const applications = await Application.find({
//         organization: req.user.organization,
//         status: 'Pending'
//     }).populate('tenant', 'name email').populate('property', 'address');

//     res.status(200).json(applications);
// });

// /**
//  * @desc    Landlord updates an application's status (Approve/Reject)
//  * @route   PUT /api/applications/:id
//  * @access  Private (Landlord Only)
//  */
// const updateApplicationStatus = asyncHandler(async (req, res) => {
//     const { status } = req.body;
//     const { id } = req.params;
//     const { organization, name: actorName } = req.user;

//     const application = await Application.findOneAndUpdate(
//         { _id: id, organization: organization, status: 'Pending' },
//         { status: status },
//         { new: false }
//     ).populate('tenant property');

//     if (!application) {
//         res.status(404);
//         throw new Error('Pending application not found or you are not authorized.');
//     }

//     if (status === 'Approved') {
//         const existingLease = await Lease.findOne({ property: application.property._id, status: 'active' });
//         if (existingLease) {
//             application.status = 'Pending';
//             await application.save(); // Revert status
//             res.status(409); // 409 Conflict
//             throw new Error('This property has already been assigned an active lease.');
//         }

//         await Lease.create({
//             property: application.property._id,
//             tenant: application.tenant._id,
//             organization: application.organization,
//             startDate: application.requestedStartDate || new Date(),
//             endDate: application.requestedEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//             rentAmount: application.property.rentAmount,
//             status: 'active'
//         });

//         await User.findByIdAndUpdate(application.tenant._id, {
//             organization: application.organization
//         });
//     }
    
//     await LogEntry.create({
//         organization,
//         actor: actorName,
//         type: 'System',
//         message: `Application for ${application.tenant.name} was ${status.toLowerCase()}`,
//         tenant: application.tenant._id,
//         property: application.property._id,
//     });

//     const finalApplicationState = application.toObject();
//     finalApplicationState.status = status;

//     res.status(200).json(finalApplicationState);
// });

// module.exports = {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
// };

// // tenant_manage/backend/controllers/landlord/applicationController.js

// const Application = require('../../models/Application');
// const Property = require('../../models/Property');
// const User = require('../../models/User');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');

// /**
//  * @desc    Tenant submits a new application for a property
//  * @route   POST /api/applications
//  * @access  Private (Tenant Only)
//  */
// const createApplication = async (req, res) => {
//     try {
//         const { propertyId, message, requestedStartDate, requestedEndDate } = req.body;
//         const tenantId = req.user.id;

//         const property = await Property.findById(propertyId).populate('organization');
//         if (!property) {
//             return res.status(404).json({ message: 'Property not found' });
//         }

//         const existingApplication = await Application.findOne({ property: propertyId, tenant: tenantId });
//         if (existingApplication) {
//             return res.status(409).json({ message: 'You have already applied for this property.' });
//         }

//         const application = await Application.create({
//             property: propertyId,
//             tenant: tenantId,
//             landlord: property.organization.owner,
//             organization: property.organization._id,
//             message,
//             requestedStartDate,
//             requestedEndDate,
//         });

//         await LogEntry.create({
//             organization: property.organization._id,
//             actor: req.user.name,
//             type: 'System',
//             message: `Submitted application for ${property.address.street}`,
//             tenant: tenantId,
//             property: propertyId,
//         });

//         res.status(201).json(application);
//     } catch (error) {
//         console.error("Error creating application:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// /**
//  * @desc    Landlord gets all pending applications for their organization
//  * @route   GET /api/applications
//  * @access  Private (Landlord Only)
//  */
// const getApplications = async (req, res) => {
//     try {
//         const applications = await Application.find({ organization: req.user.organization, status: 'Pending' })
//             .populate('tenant', 'name email')
//             .populate('property', 'address');
            
//         res.status(200).json(applications);
//     } catch (error) {
//         console.error("Error fetching applications:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// /**
//  * @desc    Landlord updates an application's status (Approve/Reject)
//  * @route   PUT /api/applications/:id
//  * @access  Private (Landlord Only)
//  */
// // const updateApplicationStatus = async (req, res) => {
// //     try {
// //         const { status } = req.body;
// //         const application = await Application.findById(req.params.id).populate('tenant property');

// //         if (!application || application.organization.toString() !== req.user.organization.toString()) {
// //             return res.status(404).json({ message: 'Application not found or not authorized.' });
// //         }
        
// //         if (application.status !== 'Pending') {
// //             return res.status(400).json({ message: 'This application has already been processed.' });
// //         }

// //         if (status === 'Approved') {
// //             const existingLease = await Lease.findOne({ property: application.property._id, status: 'active' });
// //             if (existingLease) {
// //                 return res.status(409).json({ message: 'This property has already been assigned an active lease.' });
// //             }

// //             await Lease.create({
// //                 property: application.property._id,
// //                 tenant: application.tenant._id,
// //                 organization: application.organization,
// //                 startDate: application.requestedStartDate || new Date(),
// //                 endDate: application.requestedEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
// //                 rentAmount: application.property.rentAmount,
// //                 status: 'active'
// //             });

// //             await User.findByIdAndUpdate(application.tenant._id, {
// //                 organization: application.organization
// //             });
// //         }
        
// //         application.status = status;
// //         await application.save();
        
// //         await LogEntry.create({
// //             organization: req.user.organization,
// //             actor: req.user.name,
// //             type: 'System',
// //             message: `Application for ${application.tenant.name} was ${status.toLowerCase()}`,
// //             tenant: application.tenant._id,
// //             property: application.property._id,
// //         });

// //         res.status(200).json(application);
// //     } catch (error) {
// //         console.error("Error updating application status:", error);
// //         res.status(500).json({ message: 'Server Error' });
// //     }
// // };

// /**
//  * @desc    Landlord updates an application's status (Approve/Reject)
//  * @route   PUT /api/applications/:id
//  * @access  Private (Landlord Only)
//  */
// const updateApplicationStatus = async (req, res) => {
//     try {
//         const { status } = req.body;
//         const { id } = req.params;
//         const { organization, name: actorName } = req.user;

//         // --- REFACTOR: Find the application and update its status in ONE atomic operation ---
//         // We use { new: false } to get the document *before* the update, so we can use its data.
//         const application = await Application.findOneAndUpdate(
//             { _id: id, organization: organization, status: 'Pending' }, // Securely find a PENDING application in the landlord's org
//             { status: status }, // The update to apply
//             { new: false } // IMPORTANT: Return the original document
//         ).populate('tenant property');

//         // If no application was found, it's either the wrong ID, not pending, or not in their org.
//         if (!application) {
//             return res.status(404).json({ message: 'Pending application not found or you are not authorized.' });
//         }

//         // --- The rest of the business logic can now proceed safely ---
//         if (status === 'Approved') {
//             const existingLease = await Lease.findOne({ property: application.property._id, status: 'active' });
//             if (existingLease) {
//                 // If a lease already exists, we should ideally roll back the status update.
//                 // For now, we'll return an error. (See Proactive Suggestions)
//                 application.status = 'Pending'; // Revert in memory
//                 await application.save(); // Save the revert
//                 return res.status(409).json({ message: 'This property has already been assigned an active lease.' });
//             }

//             await Lease.create({
//                 property: application.property._id,
//                 tenant: application.tenant._id,
//                 organization: application.organization,
//                 startDate: application.requestedStartDate || new Date(),
//                 endDate: application.requestedEndDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
//                 rentAmount: application.property.rentAmount,
//                 status: 'active'
//             });

//             // Associate the tenant with the landlord's organization
//             await User.findByIdAndUpdate(application.tenant._id, {
//                 organization: application.organization
//             });
//         }
        
//         await LogEntry.create({
//             organization: organization,
//             actor: actorName,
//             type: 'System',
//             message: `Application for ${application.tenant.name} was ${status.toLowerCase()}`,
//             tenant: application.tenant._id,
//             property: application.property._id,
//         });

//         // We return the original application object but with the new status, so the frontend can remove it.
//         const finalApplicationState = application.toObject();
//         finalApplicationState.status = status;

//         res.status(200).json(finalApplicationState);

//     } catch (error) {
//         console.error("Error updating application status:", error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };


// module.exports = {
//     createApplication,
//     getApplications,
//     updateApplicationStatus,
// };