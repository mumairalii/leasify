const app = require('./server'); // Import the configured app
const PORT = process.env.PORT || 5001;

// Start the server
app.listen(PORT, () => console.log(`INFO: Server is operational and listening on port ${PORT}`));