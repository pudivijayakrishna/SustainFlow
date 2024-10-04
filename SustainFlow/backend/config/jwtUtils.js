import jwt from 'jsonwebtoken';
import { secretKey } from "./jwtConfig.js";

// Function to generate a token for the user
export const generateToken = (user) => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    }
    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

// Function to verify the token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null; // Return null if token verification fails
    }
};

// Middleware to protect routes
export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); // Unauthorized

    const verified = verifyToken(token);
    if (!verified) return res.sendStatus(403); // Forbidden

    req.user = verified; // Attach user information to request
    next();
};
