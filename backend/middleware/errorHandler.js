const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    if (process.env.NODE_ENV !== 'production' && err.stack) {
        console.error('Stack:', err.stack);
    }

    // Default error
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = { message, statusCode: 404 };
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered';
        error = { message, statusCode: 400 };
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = { message, statusCode: 400 };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = { message, statusCode: 401 };
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = { message, statusCode: 401 };
    }

    // Mongoose buffering timeout (MongoDB disconnected)
    if (err.name === 'MongooseError' && err.message && err.message.includes('buffering timed out')) {
        const message = 'Database query timed out because MongoDB is not connected. Please verify MongoDB is running.';
        error = { message, statusCode: 503 };
    }

    const finalMessage = error.message || err.message || 'Server Error';

    res.status(error.statusCode || err.statusCode || 500).json({
        success: false,
        msg: finalMessage,
        message: finalMessage
    });
};

module.exports = errorHandler;
