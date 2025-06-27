const isLandlord = (req, res, next) => {
    if (req.user && req.user.role === 'landlord') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Landlord role required.' });
    }
};

const isTenant = (req, res, next) => {
    if (req.user && req.user.role === 'tenant') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied: Tenant role required.' });
    }
};

module.exports = { isLandlord, isTenant };