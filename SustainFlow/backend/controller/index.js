import User from '../models/user.js';
import { generateToken } from '../config/jwtUtils.js'; // Ensure generateToken is correctly defined
import bcrypt from 'bcrypt'; // Use bcrypt to hash passwords for security

// Signup Controller
export const signup = async (req, res) => {
    try {
        // Check if user already exists with email or username
        let user = await User.findOne({ $or: [{ email: req.body.email }, { username: req.body.username }] });
        if (user) {
            return res.status(409).json({ error: 'User already exists!' });
        }

        // Hash the password before storing it in the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user with the hashed password
        user = new User({ ...req.body, password: hashedPassword });
        await user.save();

        return res.status(201).json({ message: 'User created successfully!' });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Login/Session Creation Controller
export const create_session = async (req, res) => {
    try {
        const { emailUsername, password } = req.body;

        // Find user by either email or username
        let user = await User.findOne({ $or: [{ email: emailUsername }, { username: emailUsername }] });

        // Check if user exists and password is valid
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid Email/Username or Password!' });
        }

        // Generate JWT token for authenticated user
        const token = generateToken(user);

        return res.status(200).json({ token: token, role: user.role });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ error: error.message });
    }
};

// Fetch User Profile Controller
export const profile = async (req, res) => {
    try {
        console.log('Request User:', req.user); // Debug log for user data
        // Fetch user data by ID from the request
        let user = await User.findById(req.user.id, {
            name: 1, username: 1, email: 1, role: 1, contact: 1, address: 1, location: 1
        });

        return res.status(200).json({ message: 'User found!', user });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ error: error.message });
    }
};

// Update User Profile Controller
export const update_profile = async (req, res) => {
    try {
        // Update the user data by ID
        await User.findByIdAndUpdate(
            req.user.id, // Identify user by ID from request
            req.body, // Updated data from request body
            { new: true } // Return the updated document
        );

        return res.status(200).json({ message: 'User data updated!' });
    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({ error: error.message });
    }
};
