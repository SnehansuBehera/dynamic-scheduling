import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authenticate = async (req, res, next) => {
    const token = req.headers.authorization; // Get token from headers, not cookies
    if (!token) return res.status(401).json({ message: 'Access denied' });
    console.log(req.headers);
    try {
        const verified = jwt.verify(token, 'abcdhikl');
        req.user = await User.findById(verified.userId).select("-password"); // Await the result
        if (!req.user) return res.status(404).json({ message: 'User not found' });

        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Admin access only' });
    }
};

export { authenticate, admin };
