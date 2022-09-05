const express = require('express');
const router = express.Router();
const {
    addTodo,
    getTodos,
    updateTodo,
    deleteTodo
} = require('../controllers/todoControllers');

// Middleware for protecting routes
const authUser = require('../middleware/authMiddleware');

// Routes for adding a new todo and getting all of a users todos
router.route('/').post(authUser, addTodo).get(authUser, getTodos);

// Routes for updating a todo and deleting a todo
router.route('/:id').put(authUser, updateTodo).delete(authUser, deleteTodo);

module.exports = router;
