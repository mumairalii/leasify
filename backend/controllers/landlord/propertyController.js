const Property = require('../../models/Property');

// @desc    Create a new property
// @route   POST /api/landlord/properties
// @access  Private (Landlord Only)

const Lease = require('../../models/Lease'); // Import the Lease model to check for active leases
const LogEntry = require('../../models/LogEntry');
// @desc    Get all properties for the landlord, including their rental status
// @route   GET /api/landlord/properties
// @access  Private (Landlord Only)
// const getProperties = async (req, res) => {
//     try {
//         const organizationId = req.user.organization;

//         // 1. Get all of the landlord's properties
//         const properties = await Property.find({ organization: organizationId }).lean();
        
//         // 2. Find all property IDs that are linked to an active lease
//         const leasedPropertyIds = await Lease.find({
//             organization: organizationId,
//             status: 'active'
//         }).distinct('property');

//         // 3. Use a Set for an efficient lookup
//         const leasedIdsSet = new Set(leasedPropertyIds.map(id => id.toString()));

//         // 4. Add a 'status' field to each property object before sending it
//         const propertiesWithStatus = properties.map(property => ({
//             ...property,
//             status: leasedIdsSet.has(property._id.toString()) ? 'Rented' : 'Vacant'
//         }));

//         res.status(200).json(propertiesWithStatus);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve properties', error: error.message });
//     }
// };

const getProperties = async (req, res) => {
    try {
        const organizationId = req.user.organization;

        const properties = await Property.find({ organization: organizationId }).lean();
        const propertyIds = properties.map(p => p._id);
        
        const activeLeases = await Lease.find({ 
            property: { $in: propertyIds }, 
            status: 'active' 
        }).select('property status');

        // Create a map of PropertyID -> LeaseID for quick lookup
        const leaseMap = new Map();
        activeLeases.forEach(lease => {
            leaseMap.set(lease.property.toString(), lease._id.toString());
        });

        const propertiesWithStatus = properties.map(property => {
            const propertyIdStr = property._id.toString();
            const hasActiveLease = leaseMap.has(propertyIdStr);
            return {
                ...property,
                status: hasActiveLease ? 'Rented' : 'Vacant',
                // --- NEW: Include the active lease ID if it exists ---
                activeLeaseId: hasActiveLease ? leaseMap.get(propertyIdStr) : null,
            };
        });

        res.status(200).json(propertiesWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve properties', error: error.message });
    }
};
const createProperty = async (req, res) => {
    try {
        const { address, rentAmount, isListed } = req.body;
        const organizationId = req.user.organization;

        if (!address || !rentAmount) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const newProperty = await Property.create({
            address,
            rentAmount,
            isListed: isListed || false,
            organization: organizationId,
        });
        await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'System',
        message: `Created new property: ${newProperty.address.street}`,
        property: newProperty._id,
    });
        res.status(201).json(newProperty);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Get all properties for the logged-in landlord
// @route   GET /api/landlord/properties
// @access  Private (Landlord Only)
// const getProperties = async (req, res) => {
//     try {
//         // This query securely finds properties matching only the logged-in landlord's organization
//         const properties = await Property.find({ organization: req.user.organization });
//         res.status(200).json(properties);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve properties', error: error.message });
//     }
// };

// @desc    Update a property
// @route   PUT /api/landlord/properties/:id
// @access  Private (Landlord Only)
const updateProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        // Security Check: Ensure the landlord owns this property
        if (property.organization.toString() !== req.user.organization.toString()) {
            return res.status(403).json({ message: 'User not authorized to update this property' });
        }

        const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
         // --- ADD THIS LOGIC ---
    await LogEntry.create({
        organization: req.user.organization,
        actor: req.user.name,
        type: 'System',
        message: `Updated details for property: ${updatedProperty.address.street}`,
        property: updatedProperty._id,
    });
    // --- END ---
        res.status(200).json(updatedProperty);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// @desc    Delete a property
// @route   DELETE /api/landlord/properties/:id
// @access  Private (Landlord Only)
// const deleteProperty = async (req, res) => {
//     try {
//         const property = await Property.findById(req.params.id);

//         if (!property) {
//             return res.status(404).json({ message: 'Property not found' });
//         }

//         // Security Check: Ensure the landlord owns this property
//         if (property.organization.toString() !== req.user.organization.toString()) {
//             return res.status(403).json({ message: 'User not authorized to delete this property' });
//         }
//         await LogEntry.create({
//     organization: req.user.organization,
//     actor: req.user.name,
//     type: 'System',
//     message: `Deleted property: ${property.address.street}`,
//     property: property._id,
// });
//         await Property.findByIdAndDelete(req.params.id);
//         res.status(200).json({ id: req.params.id, message: 'Property removed successfully' });

//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// @desc    Delete a property
// @route   DELETE /api/landlord/properties/:id
// @access  Private (Landlord Only)
const deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }

        if (property.organization.toString() !== req.user.organization.toString()) {
            return res.status(403).json({ message: 'User not authorized to delete this property' });
        }

        // --- 2. ADD THIS CRITICAL CHECK ---
        // Check if there is an active lease associated with this property
        const activeLease = await Lease.findOne({ property: req.params.id, status: 'active' });

        if (activeLease) {
            // If a lease exists, block the deletion and send a user-friendly error message
            return res.status(400).json({ message: 'Cannot delete a property with an active lease. Please end the lease first.' });
        }
        // --- END OF CHECK ---

        await Property.findByIdAndDelete(req.params.id);
         // --- 4. ADD THIS LOGIC ---
        await LogEntry.create({
            organization: req.user.organization,
            actor: req.user.name,
            type: 'System',
            message: `Deleted property: ${property.address.street}`,
            property: property._id,
        });
        res.status(200).json({ id: req.params.id, message: 'Property removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    createProperty,
    getProperties,
    updateProperty,
    deleteProperty,
};
// const Property = require('../../models/Property');

// // @desc    Create a new property
// // @route   POST /api/landlord/properties
// const createProperty = async (req, res) => {
//     try {
//         const { address, rentAmount, isListed } = req.body;
        
//         // This is the core of multi-tenancy.
//         // We get the organization ID from the authenticated user's token payload.
//         const organizationId = req.user.organization;

//         const newProperty = await Property.create({
//             address,
//             rentAmount,
//             isListed,
//             organization: organizationId,
//         });
//         res.status(201).json(newProperty);
//     } catch (error) {
//         res.status(400).json({ message: 'Failed to create property', error: error.message });
//     }
// };

// // @desc    Get all properties for the logged-in landlord
// // @route   GET /api/landlord/properties
// const getProperties = async (req, res) => {

//     console.log('--- BACKEND GETPROPERTIES: API received this user from token: ---', req.user);
//     try {
//         // This query ensures a landlord can ONLY see their own properties.
//         const properties = await Property.find({ organization: req.user.organization });
//         res.status(200).json(properties);
//     } catch (error) {
//         res.status(500).json({ message: 'Failed to retrieve properties', error: error.message });
//     }
// };

// const updateProperty = async (req, res) => {
//     try {
//         // Find the property by the ID in the URL
//         const property = await Property.findById(req.params.id);

//         if (!property) {
//             return res.status(404).json({ message: 'Property not found' });
//         }

//         // CRUCIAL SECURITY CHECK: Ensure the logged-in landlord owns this property
//         if (property.organization.toString() !== req.user.organization.toString()) {
//             return res.status(403).json({ message: 'User not authorized to update this property' });
//         }

//         // Find the property by its ID and update it with the data from the request body
//         const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
//             new: true, // This option returns the document after it has been updated
//         });

//         res.status(200).json(updatedProperty);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };

// // @desc    Delete a property
// // @route   DELETE /api/landlord/properties/:id
// // @access  Private (Landlord Only)
// const deleteProperty = async (req, res) => {
//     try {
//         const property = await Property.findById(req.params.id);

//         if (!property) {
//             return res.status(404).json({ message: 'Property not found' });
//         }

//         // CRUCIAL SECURITY CHECK: Ensure the logged-in landlord owns this property
//         if (property.organization.toString() !== req.user.organization.toString()) {
//             return res.status(403).json({ message: 'User not authorized to delete this property' });
//         }

//         // Find the property by its ID and delete it
//         await Property.findByIdAndDelete(req.params.id);

//         // Send back a success message and the ID of the deleted property
//         res.status(200).json({ id: req.params.id, message: 'Property removed successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error', error: error.message });
//     }
// };


// module.exports = { createProperty, getProperties,updateProperty, // <-- Export new functions
//     deleteProperty, };