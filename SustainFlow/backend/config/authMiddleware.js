import jwt from 'jsonwebtoken';
import { secretKey } from './jwtConfig.js'

// Middleware to authenticate the JWT token for any user
export const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }

    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, ''); // Remove extra quotes if any

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("JWT Verification Error:", err);
            return res.status(403).json({ message: "Invalid token!" });
        }
        console.log("Decoded User:", user); // Debug log for user information
        req.user = user;
        next();
    });
};

// Middleware to verify the token and ensure the user has a "donor" role
export const authenticateDonorToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }

    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, '');

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("JWT Verification Error:", err);
            return res.status(403).json({ message: "Invalid token!" });
        }

        if (user.role !== 'donor') {
            return res.status(403).json({ message: "Unauthorized! Donor role required." });
        }
        
        console.log("Decoded Donor User:", user);
        req.user = user;
        next();
    });
};

// Middleware to verify the token and ensure the user has an "agency" role
export const authenticateAgencyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }

    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, '');

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("JWT Verification Error:", err);
            return res.status(403).json({ message: "Invalid token!" });
        }

        if (user.role !== 'agency') {
            return res.status(403).json({ message: "Unauthorized! Agency role required." });
        }

        console.log("Decoded Agency User:", user);
        req.user = user;
        next();
    });
};

// Middleware to verify the token and ensure the user has an "ngo" role
export const authenticateNgoToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ message: "Missing Token!" });
    }

    let [bearer, token] = authHeader.split(" ");
    token = token.replace(/"/g, '');

    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid token format!" });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.log("JWT Verification Error:", err);
            return res.status(403).json({ message: "Invalid token!" });
        }

        if (user.role !== 'ngo') {
            return res.status(403).json({ message: "Unauthorized! NGO role required." });
        }

        console.log("Decoded NGO User:", user);
        req.user = user;
        next();
    });
};
