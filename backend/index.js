const app = require('./server'); // Import the configured app
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5001;
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in your .env file.');
    process.exit(1);
}

// --- THIS IS THE FIX ---
// Connect to the database FIRST.
mongoose.connect(DB_URI)
    .then(() => {
        console.log('✅ SUCCESS: MongoDB connection established successfully.');
        // Only start the server AFTER the database connection is successful.
        // And only if we are NOT in a test environment.
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => console.log(`🚀 INFO: Server is operational and listening on port ${PORT}`));
        }
    })
    .catch((error) => {
        console.error('❌ ERROR: MongoDB connection failed.', error.message);
        process.exit(1);
    });