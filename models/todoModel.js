const mongoose = require('mongoose');

// Todo document schema
const todoSchema = mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'Please add text content.']
        },
        // User that the todo belongs to
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    }, {
        // Adds updated at and created at fields automatically
        timestamps: true
    }
)

// Creates a model of the Todo schema and exports it
module.exports = mongoose.model('Todo', todoSchema);