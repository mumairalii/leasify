const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(err.stack);

    // --- THIS IS THE FIX ---
    // Create the base response object
    const responseBody = {
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    };

    // If the error was caused by express-validator, add the detailed errors
    if (err.cause) {
        responseBody.errors = err.cause;
    }

    res.status(statusCode).json(responseBody);
};

module.exports = { notFound, errorHandler };