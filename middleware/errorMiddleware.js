
const errorHandler = (err, req, res, next) => {
    // Use status from response if one was sent, otherwise use 500 (server error)
    const statusCode = res.statusCode ? res.statusCode : 500;

    res.json({
        message: err.message,
        // Send error stack if in development
        stack: process.env.NODE_ENV === 'production' ? null : err.stack 
    })
}

module.exports = errorHandler;