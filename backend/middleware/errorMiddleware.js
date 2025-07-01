// Handles requests for routes that do not exist
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware
};

// Handles all other errors that occur in the application
const errorHandler = (err, req, res, next) => {
  // Sometimes an error might come with a status code, otherwise default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Log the error for the developer
  console.error(err.stack);

  res.status(statusCode).json({
    message: err.message,
    // Only show the stack trace in development for security purposes
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = { notFound, errorHandler };