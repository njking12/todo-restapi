const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
// Middleware for handling exceptions in asynchronous code
const asyncHandler = require('express-async-handler');

// Middleware for authorizing a user at protected routes
const authUser = asyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization;

    // Checking for a token in the request headers
    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            // Get token
            token = authHeader.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from db without password
            const user = await User.findById(decoded.id).select('-password');

            // Add the user to the request for use in controller functions
            req.user = user;
            
            // Call next function in middleware 
            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized.');
        }
        
    // No token sent, throw error
    } else {
        res.status(401);
        throw new Error('Not authorized, no token.');
    }
})

module.exports = authUser;