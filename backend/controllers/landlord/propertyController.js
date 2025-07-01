const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Property = require('../../models/Property');
const Lease = require('../../models/Lease');
const LogEntry = require('../../models/LogEntry');

const getProperties = asyncHandler(async (req, res) => {
    const organizationId = req.user.organization;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const [properties, totalProperties] = await Promise.all([
        Property.find({ organization: organizationId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Property.countDocuments({ organization: organizationId })
    ]);

    const propertyIds = properties.map(p => p._id);
    let propertiesWithStatus = properties;

    if (propertyIds.length > 0) {
        const activeLeases = await Lease.find({ property: { $in: propertyIds }, status: 'active' }).select('property');
        const leasedIdsSet = new Set(activeLeases.map(l => l.property.toString()));
        propertiesWithStatus = properties.map(property => ({
            ...property,
            status: leasedIdsSet.has(property._id.toString()) ? 'Rented' : 'Vacant'
        }));
    }

    res.status(200).json({
        properties: propertiesWithStatus,
        page,
        totalPages: Math.ceil(totalProperties / limit),
        totalProperties
    });
});

const createProperty = asyncHandler(async (req, res) => {
    // Check for validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }
    
    // The old manual check is now replaced by the validator
    const { address, rentAmount, description, propertyType, bedrooms, bathrooms, isListed, imageUrl } = req.body;

    const newProperty = await Property.create({
        address, rentAmount, description, propertyType, bedrooms, bathrooms, isListed, imageUrl,
        owner: req.user._id,
        organization: req.user.organization,
    });

    await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'System',
        message: `Created new property: ${newProperty.address.street}`,
        property: newProperty._id,
    });

    res.status(201).json(newProperty);
});

const updateProperty = asyncHandler(async (req, res) => {
    // 1. Check for validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }

    const updatedProperty = await Property.findOneAndUpdate(
        { _id: req.params.id, organization: req.user.organization },
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedProperty) {
        res.status(404);
        throw new Error('Property not found or not authorized');
    }

    await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'System',
        message: `Updated details for property: ${updatedProperty.address.street}`,
        property: updatedProperty._id,
    });

    res.status(200).json(updatedProperty);
});

const deleteProperty = asyncHandler(async (req, res) => {
    const activeLease = await Lease.findOne({ property: req.params.id, status: 'active' });
    if (activeLease) {
        res.status(400);
        throw new Error('Cannot delete a property with an active lease. Please end the lease first.');
    }

    const deletedProperty = await Property.findOneAndDelete({
        _id: req.params.id,
        organization: req.user.organization
    });

    if (!deletedProperty) {
        res.status(404);
        throw new Error('Property not found or not authorized');
    }

    await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'System',
        message: `Deleted property: ${deletedProperty.address.street}`,
        property: deletedProperty._id,
    });

    res.status(200).json({ id: req.params.id, message: 'Property removed successfully' });
});

module.exports = {
    createProperty,
    getProperties,
    updateProperty,
    deleteProperty,
};

// const asyncHandler = require('express-async-handler');
// const Property = require('../../models/Property');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');

// /**
//  * @desc    Get all properties for the landlord with pagination
//  * @route   GET /api/landlord/properties
//  * @access  Private (Landlord Only)
//  */
// const getProperties = asyncHandler(async (req, res) => {
//     const organizationId = req.user.organization;
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 9;
//     const skip = (page - 1) * limit;

//     const [properties, totalProperties] = await Promise.all([
//         Property.find({ organization: organizationId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
//         Property.countDocuments({ organization: organizationId })
//     ]);

//     const propertyIds = properties.map(p => p._id);
//     let propertiesWithStatus = properties;

//     if (propertyIds.length > 0) {
//         const activeLeases = await Lease.find({ property: { $in: propertyIds }, status: 'active' }).select('property');
//         const leasedIdsSet = new Set(activeLeases.map(l => l.property.toString()));
//         propertiesWithStatus = properties.map(property => ({
//             ...property,
//             status: leasedIdsSet.has(property._id.toString()) ? 'Rented' : 'Vacant'
//         }));
//     }

//     res.status(200).json({
//         properties: propertiesWithStatus,
//         page,
//         totalPages: Math.ceil(totalProperties / limit),
//         totalProperties
//     });
// });

// /**
//  * @desc    Create a new property
//  * @route   POST /api/landlord/properties
//  * @access  Private (Landlord Only)
//  */
// // const createProperty = asyncHandler(async (req, res) => {
// //     const { address, rentAmount, description, propertyType, bedrooms, bathrooms } = req.body;

// //     if (!address || !address.street || !address.city || !address.state || !address.zipCode || !rentAmount) {
// //         res.status(400);
// //         throw new Error('Please provide all required fields');
// //     }

// //     const newProperty = await Property.create({
// //         address, rentAmount, description, propertyType, bedrooms, bathrooms,
// //         owner: req.user._id,
// //         organization: req.user.organization,
// //     });

// //     await LogEntry.create({
// //         organization: req.user.organization,
// //         actor: req.user.name,
// //         type: 'System',
// //         message: `Created new property: ${newProperty.address.street}`,
// //         property: newProperty._id,
// //     });

// //     res.status(201).json(newProperty);
// // });


// /**
//  * @desc    Create a new property
//  * @route   POST /api/landlord/properties
//  * @access  Private (Landlord Only)
//  */
// const createProperty = asyncHandler(async (req, res) => {
//     const { address, rentAmount, description, propertyType, bedrooms, bathrooms, isListed, imageUrl } = req.body;

//     if (!address || !address.street || !rentAmount) {
//         res.status(400);
//         throw new Error('Please provide all required fields: street address and rent amount.');
//     }

//     const newProperty = await Property.create({
//         address,
//         rentAmount,
//         description,
//         propertyType,
//         bedrooms,
//         bathrooms,
//         isListed,
//         imageUrl,
//         owner: req.user._id, // Set the owner from the logged-in user
//         organization: req.user.organization,
//     });

//     await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.name,
//         type: 'System',
//         message: `Created new property: ${newProperty.address.street}`,
//         property: newProperty._id,
//     });

//     res.status(201).json(newProperty);
// });
// /**
//  * @desc    Update a property
//  * @route   PUT /api/landlord/properties/:id
//  * @access  Private (Landlord Only)
//  */
// const updateProperty = asyncHandler(async (req, res) => {
//     const updatedProperty = await Property.findOneAndUpdate(
//         { _id: req.params.id, organization: req.user.organization },
//         req.body,
//         { new: true, runValidators: true }
//     );

//     if (!updatedProperty) {
//         res.status(404);
//         throw new Error('Property not found or not authorized');
//     }

//     await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.name,
//         type: 'System',
//         message: `Updated details for property: ${updatedProperty.address.street}`,
//         property: updatedProperty._id,
//     });

//     res.status(200).json(updatedProperty);
// });

// /**
//  * @desc    Delete a property
//  * @route   DELETE /api/landlord/properties/:id
//  * @access  Private (Landlord Only)
//  */
// const deleteProperty = asyncHandler(async (req, res) => {
//     const activeLease = await Lease.findOne({ property: req.params.id, status: 'active' });
//     if (activeLease) {
//         res.status(400);
//         throw new Error('Cannot delete a property with an active lease. Please end the lease first.');
//     }

//     const deletedProperty = await Property.findOneAndDelete({
//         _id: req.params.id,
//         organization: req.user.organization
//     });

//     if (!deletedProperty) {
//         res.status(404);
//         throw new Error('Property not found or not authorized');
//     }

//     await LogEntry.create({
//         organization: req.user.organization,
//         actor: req.user.name,
//         type: 'System',
//         message: `Deleted property: ${deletedProperty.address.street}`,
//         property: deletedProperty._id,
//     });

//     res.status(200).json({ id: req.params.id, message: 'Property removed successfully' });
// });

// module.exports = {
//     createProperty,
//     getProperties,
//     updateProperty,
//     deleteProperty,
// };
// const Property = require('../../models/Property');
// const Lease = require('../../models/Lease');
// const LogEntry = require('../../models/LogEntry');

// /**
//  * @desc    Get all properties for the landlord with pagination
//  * @route   GET /api/landlord/properties?page=1&limit=9
//  * @access  Private (Landlord Only)
//  */
// const getProperties = async (req, res) => {
//     try {
//         const organizationId = req.user.organization;

//         // 1. Get pagination parameters from the request query string, with sensible defaults.
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 9; // Default to 9 for a 3x3 grid on the frontend
//         const skip = (page - 1) * limit; // Calculate how many documents to skip

//         // 2. Run queries in parallel: one for the page's data, one for the total count.
//         const [properties, totalProperties] = await Promise.all([
//             Property.find({ organization: organizationId })
//                 .sort({ createdAt: -1 })
//                 .skip(skip)
//                 .limit(limit)
//                 .lean(),
//             Property.countDocuments({ organization: organizationId })
//         ]);
        
//         // 3. The logic to determine status now runs only on the small, paginated set of data.
//         const propertyIds = properties.map(p => p._id);
//         let propertiesWithStatus = properties; // Initialize with the fetched properties

//         if (propertyIds.length > 0) {
//             const activeLeases = await Lease.find({ 
//                 property: { $in: propertyIds }, 
//                 status: 'active' 
//             }).select('property');

//             const leasedIdsSet = new Set(activeLeases.map(l => l.property.toString()));

//             propertiesWithStatus = properties.map(property => ({
//                 ...property,
//                 status: leasedIdsSet.has(property._id.toString()) ? 'Rented' : 'Vacant'
//             }));
//         }

//         // 4. Return a structured response object with the data and pagination metadata.
//         res.status(200).json({
//             properties: propertiesWithStatus,
//             page: page,
//             totalPages: Math.ceil(totalProperties / limit),
//             totalProperties: totalProperties
//         });

//     } catch (error) {
//         console.error("Error fetching properties:", error);
//         res.status(500).json({ message: 'Failed to retrieve properties', error: error.message });
//     }
// };

// /* --- NO CHANGES NEEDED FOR THE FUNCTIONS BELOW --- */
// /* They are included here so you can replace the whole file. */

// // @desc    Create a new property
// const createProperty = async (req, res) => {
//     try {
//         const { address, rentAmount, isListed, imageUrl } = req.body;
//         const newProperty = await Property.create({
//             address,
//             rentAmount,
//             isListed: isListed || false,
//             imageUrl: imageUrl || '',
//             organization: req.user.organization,
//         });

//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'System',
//             message: `Created new property: ${newProperty.address.street}`,
//             property: newProperty._id,
//         });
//         res.status(201).json(newProperty);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// // @desc    Update a property
// const updateProperty = async (req, res) => {
//     try {
//         const updatedProperty = await Property.findOneAndUpdate(
//             { _id: req.params.id, organization: req.user.organization },
//             req.body,
//             { new: true }
//         );

//         if (!updatedProperty) {
//             return res.status(404).json({ message: 'Property not found or not authorized' });
//         }
        
//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'System',
//             message: `Updated details for property: ${updatedProperty.address.street}`,
//             property: updatedProperty._id,
//         });
//         res.status(200).json(updatedProperty);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// // @desc    Delete a property
// const deleteProperty = async (req, res) => {
//     try {
//         const activeLease = await Lease.findOne({ property: req.params.id, status: 'active' });
//         if (activeLease) {
//             return res.status(400).json({ message: 'Cannot delete a property with an active lease. Please end the lease first.' });
//         }
        
//         const deletedProperty = await Property.findOneAndDelete({
//             _id: req.params.id,
//             organization: req.user.organization
//         });

//         if (!deletedProperty) {
//             return res.status(404).json({ message: 'Property not found or not authorized' });
//         }

//         await LogEntry.create({
//             organization: req.user.organization,
//             actor: req.user.name,
//             type: 'System',
//             message: `Deleted property: ${deletedProperty.address.street}`,
//             property: deletedProperty._id,
//         });
//         res.status(200).json({ id: req.params.id, message: 'Property removed successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// module.exports = {
//     createProperty,
//     getProperties,
//     updateProperty,
//     deleteProperty,
// };
