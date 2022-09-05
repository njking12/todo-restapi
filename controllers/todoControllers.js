const Todo = require('../models/todoModel');
const Joi = require('@hapi/joi');

// Middleware for handling exceptions in asynchronous code
const asyncHandler = require('express-async-handler');

// Joi validation schema for a todo
const todoSchema = Joi.object({
    content: Joi.string().required()
});

// Controller for adding a new todo
const addTodo = asyncHandler(async (req, res) => {
    // Validate todo data
    const { error } = todoSchema.validate(req.body);

    if (error) {
        res.status(400);
        //  Throws error with error message that Joi produces
        throw new Error(error.details[0].message);
    } else {
        // Grab new todo data
        const newTodoData = req.body;

        // Create new todo in db
        const newTodo = await Todo.create({
            content: newTodoData.content,
            user: req.user.id
        });

        // Send response
        res.status(201).json(newTodo);
    }
});

// Controller for getting all of a logged in users todos
const getTodos = asyncHandler(async (req, res) => {
    // Find all of a users todos
    const userTodos = await Todo.find({ user: req.user.id });

    // Send response
    res.status(200).json(userTodos);
});

// Controller for updating a todo
const updateTodo = asyncHandler(async (req, res) => {
    // Get todo from db
    const todo = await Todo.findById(req.params.id);

    // If the todo does not exist, throw an error
    if (!todo) {
        res.status(404);
        throw new Error('Todo does not exist.');
    }

    // Make sure the logged in user matches the todo user
    if (todo.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized.');
    }

    // Update the todo
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {new : true});

    // Send response
    res.status(200).json(updatedTodo);
});

// Controller for deleting a todo
const deleteTodo = asyncHandler(async (req, res) => {
   // Get todo from db
   const todo = await Todo.findById(req.params.id);

   // If the todo does not exist, throw an error
   if (!todo) {
       res.status(404);
       throw new Error('Todo does not exist.');
   }

   // Make sure the logged in user matches the todo user
   if (todo.user.toString() !== req.user.id) {
       res.status(401);
       throw new Error('User not authorized.');
   }

   // Delete the todo
   await todo.remove();

   // Send response
   res.status(200).json({
    id: req.params.id
   });
});

module.exports = {
    addTodo,
    getTodos,
    updateTodo,
    deleteTodo
}