const mongoose = require('mongoose');

// User document schema
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please add a username.'],
        minlength: 6,
        maxlength: 15,
        unique: true
    },
    firstName: {
        type: String, 
        required: [true, 'Please add a first name.']
    },
    lastName: {
        type: String, 
        required: [true, 'Please add a last name.']
    },
    email: {
        type: String,
        required: [true, 'Please add an email.']
    },
    password: {
        type: String, 
        minlength: 8,
        required: [true, 'Please add a password.']
    }
}, {
    // Adds updated at and created at fields automatically
    timestamps: true
})

// Creates a model for the user schema and exports it
module.exports = mongoose.model('User', userSchema);