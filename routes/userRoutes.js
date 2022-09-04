const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userControllers');

// Import authorization middleware for protecting routes
const authUser = require('../middleware/authMiddleware');

// Route for user registration
router.post('/', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route for getting personal user information
router.get('/me', authUser, getMe);

module.exports = router;
