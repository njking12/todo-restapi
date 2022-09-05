const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const port = process.env.PORT || 5000;

// Connect to MongoDB database
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add todo routes to app
app.use('/api/todos', require('./routes/todoRoutes'));

// Add user routes to app
app.use('/api/users', require('./routes/userRoutes'));

// Override default express error handler
app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port ${port}...`));

