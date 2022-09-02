const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const port = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Override default express error handler
app.use(errorHandler)

app.listen(port, () => console.log(`Listening on port ${port}...`));

