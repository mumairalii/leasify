// tenant_manage/backend/controllers/publicController.js
const Property = require('../models/Property');
const Lease = require('../models/Lease'); // Import Lease model

const getPublicProperties = async (req, res) => {
    try {
        const properties = await Property.find({ isListed: true }).lean();
        const propertyIds = properties.map(p => p._id);
        
        const activeLeases = await Lease.find({ property: { $in: propertyIds }, status: 'active' });
        const leasedIdsSet = new Set(activeLeases.map(l => l.property.toString()));

        const propertiesWithStatus = properties.map(p => ({
            ...p,
            status: leasedIdsSet.has(p._id.toString()) ? 'Rented' : 'Vacant'
        }));

        res.status(200).json(propertiesWithStatus);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getPublicPropertyById = async (req, res) => {
    try {
        const property = await Property.findOne({ _id: req.params.id, isListed: true }).lean();
        if (!property) {
            return res.status(404).json({ message: 'Property not found.' });
        }
        
        const activeLease = await Lease.findOne({ property: property._id, status: 'active' });
        property.status = activeLease ? 'Rented' : 'Vacant';

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getPublicProperties, getPublicPropertyById };
// // tenant_manage/backend/controllers/publicController.js
// const Property = require('../models/Property');
// const Lease = require('../models/Lease'); // Import Lease model

// const getPublicProperties = async (req, res) => {
//     try {
//         const properties = await Property.find({ isListed: true }).lean();
//         const propertyIds = properties.map(p => p._id);
        
//         const activeLeases = await Lease.find({ property: { $in: propertyIds }, status: 'active' });
//         const leasedIdsSet = new Set(activeLeases.map(l => l.property.toString()));

//         const propertiesWithStatus = properties.map(p => ({
//             ...p,
//             status: leasedIdsSet.has(p._id.toString()) ? 'Rented' : 'Vacant'
//         }));

//         res.status(200).json(propertiesWithStatus);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// const getPublicPropertyById = async (req, res) => {
//     try {
//         const property = await Property.findOne({ _id: req.params.id, isListed: true }).lean();
//         if (!property) {
//             return res.status(404).json({ message: 'Property not found.' });
//         }
        
//         const activeLease = await Lease.findOne({ property: property._id, status: 'active' });
//         property.status = activeLease ? 'Rented' : 'Vacant';

//         res.status(200).json(property);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getPublicProperties, getPublicPropertyById };

// // backend/controllers/publicController.js
// const Property = require('../models/Property');

// const getPublicProperties = async (req, res) => {
//     try {
//         // Find all properties where the 'isListed' flag is true
//         const properties = await Property.find({ isListed: true });
//         res.status(200).json(properties);
//     } catch (error) {
//         console.error('Error fetching public properties:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // --- ADD THIS NEW FUNCTION ---
// // @desc    Get a single public property by ID
// // @route   GET /api/properties/public/:id
// const getPublicPropertyById = async (req, res) => {
//     try {
//         const property = await Property.findOne({ _id: req.params.id, isListed: true });
//         if (!property) {
//             return res.status(404).json({ message: 'Property not found or is not listed.' });
//         }
//         res.status(200).json(property);
//     } catch (error) {
//         console.error('Error fetching single public property:', error);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getPublicProperties,getPublicPropertyById };