const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Organization = require('../models/Organization');
const LogEntry = require('../models/LogEntry'); // 1. Import the LogEntry model

// Helper function to generate JWT
const generateToken = (id, role, organizationId) => {
    return jwt.sign({ id, role, organizationId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    // We no longer need invitationCode here
    const { name, email, password, role } = req.body;

    try {
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // --- NEW SIMPLIFIED LOGIC ---
        // Create the user. If they are a tenant, their organization will be null for now.
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await user.save();

        

        // If the user is a landlord, create an organization and link it back to them.
        if (role === 'landlord') {
            const newOrganization = await Organization.create({
                name: `${name}'s Organization`,
                owner: user._id,
            });
            user.organization = newOrganization._id;
            await user.save();
            // --- 2. ADD THIS LOGIC for landlord registration ---
            await LogEntry.create({
                organization: user.organization,
                actor: user.name,
                type: 'System',
                message: `New landlord account created: ${user.name}`
            });
            // --- END ---
        }
        
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            organization: user.organization,
            token: generateToken(user._id, user.role, user.organization),
        });

    } catch (error) {
        console.error("Error during user registration:", error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password)))
             {
                console.log('--- BACKEND LOGIN: Creating token with this user data: ---', user);
            res.status(200).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                organization: user.organization,
                token: generateToken(user._id, user.role, user.organization),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { registerUser, loginUser };