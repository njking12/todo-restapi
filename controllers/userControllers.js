const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
// Middleware for handling exceptions in asynchronous code
const asyncHandler = require('express-async-handler');

// Helper function that generates a JWT token
const genToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

// Joi validation schema for a user
const userSchema = Joi.object({
    username: Joi.string().required().min(6).max(15),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required()
})

// User registration controller
const registerUser = asyncHandler(async (req, res) => {
    // Validate user data
    const { error } = userSchema.validate(req.body);

    if (error) {
        res.status(400);
        //  Throws error with error message that Joi produces
        throw new Error(error.details[0].message);
    } else {
        // New user data
        const { username, firstName, lastName, email, password } = req.body;

        // Check if username is taken
        const usernameTaken = await User.findOne({username});
        if (usernameTaken) {
            res.status(400);
            throw new Error('Username taken.');
        }

        // Check if email is already in use
        const emailInUse = await User.findOne({email});
        if (emailInUse) {
            res.status(400);
            throw new Error('Email already used.');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            username,
            firstName,
            lastName,
            email,
            // Use hashed password instead of actual password in database
            password: hashedPassword
        });

        // Send back response
        res.status(201).json({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            // Send access taken in response
            token: genToken(user._id)
        });
    }
})

// Controller for user login
const loginUser = asyncHandler(async (req, res) => {
    // Destructure login credentials from request body
    const { username, email, password } = req.body;

    // Check that either username or email (or both) are included in the request body
    if (!username && !email) {
        res.status(400);
        throw new Error('Please send either username or email to login.');
    // Check that password is included in the request body
    } else if (!password) {
        res.status(400);
        throw new Error('Please send password to login.');
    }

    // Find user by username or email
    const user = await User.findOne({username}) || await User.findOne({email}); 
    
    // If user exists and password matches, authenticate user and send an access token
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            // Send access taken in response
            token: genToken(user._id)
        });
    // If user does not exist, throw error
    } else if (!user) {
        res.status(404);
        throw new Error('User does not exist.');
    // Incorrect password, throw error
    } else {
        res.status(400);
        throw new Error('Incorrect password.');
    }
})

const getMe = asyncHandler(async (req, res) => {
    // Send back user data
    res.status(200).json(req.user);
})

module.exports = {
    registerUser,
    loginUser,
    getMe
}