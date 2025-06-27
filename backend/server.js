// // require('dotenv').config();
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');

// // // --- Route Imports ---
// // const authRoutes = require('./routes/authRoutes');
// // const landlordPropertyRoutes = require('./routes/landlord/propertyRoutes');
// // const landlordLeaseRoutes = require('./routes/landlord/leaseRoutes');
// // const landlordMaintenanceRoutes = require('./routes/landlord/maintenanceRoutes');
// // const landlordDashboardRoutes = require('./routes/landlord/dashboardRoutes');
// // const landlordTaskRoutes = require('./routes/landlord/taskRoutes');
// // const landlordPaymentRoutes = require('./routes/landlord/paymentRoutes'); // For landlord payments
// // const tenantLeaseRoutes = require('./routes/tenant/leaseRoutes');
// // const tenantMaintenanceRoutes = require('./routes/tenant/maintenanceRoutes');
// // const tenantPaymentRoutes = require('./routes/tenant/paymentRoutes'); // For tenant payments

// // const { handleStripeWebhook } = require('./controllers/landlord/paymentController');

// // const app = express();
// // const PORT = process.env.PORT || 5001;

// // // --- Webhook Route (MUST be before express.json()) ---
// // app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

// // // --- Middleware ---
// // app.use(cors());
// // app.use(express.json());
// // app.use((req, res, next) => {
// //   res.set('Cache-Control', 'no-store');
// //   next();
// // });

// // // --- API Routes ---
// // app.use('/api/auth', authRoutes);

// // // Landlord Routes
// // app.use('/api/landlord/properties', landlordPropertyRoutes);
// // app.use('/api/landlord/leases', landlordLeaseRoutes);
// // app.use('/api/landlord/maintenance-requests', landlordMaintenanceRoutes);
// // app.use('/api/landlord/dashboard', landlordDashboardRoutes);
// // app.use('/api/landlord/tasks', landlordTaskRoutes);
// // app.use('/api/landlord/payments', landlordPaymentRoutes); // ENSURE THIS LINE IS PRESENT AND CORRECT

// // // Tenant Routes
// // app.use('/api/tenant/lease', tenantLeaseRoutes);
// // app.use('/api/tenant/maintenance-requests', tenantMaintenanceRoutes);
// // app.use('/api/tenant/payments', tenantPaymentRoutes);


// // // --- Database Connection & Server Start ---
// // mongoose.connect(process.env.MONGO_URI)
// //     .then(() => {
// //         app.listen(PORT, () => console.log(`INFO: Server is operational and listening on port ${PORT}`));
// //     })
// //     .catch((error) => console.error('ERROR: MongoDB connection failed.', error.message));

// // 1. INITIAL SETUP
// // =================================
// // This line MUST be the first line of code. It loads all the variables from your .env file
// // and makes them available throughout your application via `process.env`.
// require('dotenv').config();

// // Import the required packages
// const express = require('express');
// const mongoose = require('mongoose');

// const cors = require('cors');

// // Initialize your Express application
// const app = express();

// // Set the port. It will use the PORT from your .env file, or default to 5001.
// const PORT = process.env.PORT || 5001;


// // --- Route Imports ---
// const authRoutes = require('./routes/authRoutes');
// const landlordPropertyRoutes = require('./routes/landlord/propertyRoutes');
// const tenantLeaseRoutes = require('./routes/tenant/leaseRoutes');
// const publicRoutes = require('./routes/publicRoutes');
// const landlordLeaseRoutes = require('./routes/landlord/leaseRoutes');
// const landlordMaintenanceRoutes = require('./routes/landlord/maintenanceRoutes');

// const tenantMaintenanceRoutes = require('./routes/tenant/maintenanceRoutes');
// const landlordDashboardRoutes = require('./routes/landlord/dashboardRoutes');
// const landlordPaymentRoutes = require('./routes/landlord/paymentRoutes');
// // const tenantLeaseRoutes = require('./routes/tenant/leaseRoutes');
// const { handleStripeWebhook } = require('./controllers/landlord/paymentController');
// const landlordTenantRoutes = require('./routes/landlord/tenantRoutes');
// const landlordTaskRoutes = require('./routes/landlord/taskRoutes');
// // const landlordLeaseRoutes = require('./routes/landlord/leaseRoutes');
// const tenantPaymentRoutes = require('./routes/tenant/paymentRoutes');
// const landlordLogRoutes = require('./routes/landlord/logRoutes');

// const applicationRoutes = require('./routes/applicationRoutes');
// // Import public property routes if you create them
// app.post('/api/payments/stripe-webhook', express.raw({type: 'application/json'}), handleStripeWebhook);
// // Middleware
// app.use(cors());
// app.use(express.json());



// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store');
//   next();
// });

// // --- API Routes ---
// app.use('/api/auth', authRoutes);
// app.use('/api/landlord/properties', landlordPropertyRoutes);
// app.use('/api/tenant/lease', tenantLeaseRoutes);
// app.use('/api/properties', publicRoutes);
// app.use('/api/landlord/leases', landlordLeaseRoutes);
// // app.use('/api/tenant/lease', tenantLeaseRoutes);
// app.use('/api/tenant/lease', tenantLeaseRoutes);
// app.use('/api/landlord/maintenance-requests', landlordMaintenanceRoutes); 

// app.use('/api/tenant/maintenance-requests', tenantMaintenanceRoutes);
// app.use('/api/landlord/dashboard', landlordDashboardRoutes);
// app.use('/api/payments', landlordPaymentRoutes);
// app.use('/api/landlord/tasks', landlordTaskRoutes);
// app.use('/api/landlord/tenants', landlordTenantRoutes);
// app.use('/api/landlord/payments', landlordPaymentRoutes);
// app.use('/api/tenant/payments', tenantPaymentRoutes);

// app.use('/api/landlord/logs', landlordLogRoutes);
// app.use('/api/applications', applicationRoutes);

// // app.use('/api/landlord/leases', landlordLeaseRoutes);
// // Use other routes...




// // 2. DATABASE CONNECTION
// // =================================
// // This is the most important part for checking your connection.
// // Mongoose will try to connect to the MongoDB URI stored in your .env file.
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => {
//     // This block of code will run if the connection is successful.
//     // We will log a success message to the console.
//     console.log('SUCCESS: MongoDB connection established successfully.');
// })
// .catch((error) => {
//     // This block of code will run if there is an error during connection.
//     // We will log the error message to the console to help with debugging.
//     console.error('ERROR: MongoDB connection failed.', error.message);
//     // Exit the Node.js process with a "failure" code of 1 if we can't connect.
//     process.exit(1);
// });


// // 3. START THE SERVER
// // =================================
// // This command starts your Express server and makes it listen for requests on the specified PORT.
// app.listen(PORT, () => {
//     console.log(`INFO: Server is operational and listening on port ${PORT}`);
// });

// 1. INITIAL SETUP
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// --- ROUTE IMPORTS (One for each feature) ---
const authRoutes = require('./routes/authRoutes');
const publicRoutes = require('./routes/publicRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
// Landlord-specific routes
const landlordPropertyRoutes = require('./routes/landlord/propertyRoutes');
const landlordLeaseRoutes = require('./routes/landlord/leaseRoutes');
const landlordMaintenanceRoutes = require('./routes/landlord/maintenanceRoutes');
const landlordDashboardRoutes = require('./routes/landlord/dashboardRoutes');
const landlordTaskRoutes = require('./routes/landlord/taskRoutes');
const landlordPaymentRoutes = require('./routes/landlord/paymentRoutes');
const landlordTenantRoutes = require('./routes/landlord/tenantRoutes');
const landlordLogRoutes = require('./routes/landlord/logRoutes');
// Tenant-specific routes
const tenantLeaseRoutes = require('./routes/tenant/leaseRoutes');
const tenantMaintenanceRoutes = require('./routes/tenant/maintenanceRoutes');
const tenantPaymentRoutes = require('./routes/tenant/paymentRoutes');
// Controller import for webhook
const { handleStripeWebhook } = require('./controllers/landlord/paymentController');


// --- APP INITIALIZATION ---
const app = express();
const PORT = process.env.PORT || 5001;


// // --- MIDDLEWARE SETUP ---

// // IMPORTANT: The Stripe webhook route must be registered BEFORE express.json()
// // It needs the raw request body, not the parsed JSON.
// app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

// // Standard middleware
// app.use(cors());
// app.use(express.json());
// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store');
//   next();
// });
// --- MIDDLEWARE SETUP ---

// IMPORTANT: The Stripe webhook route must be registered BEFORE express.json()
// It needs the raw request body, not the parsed JSON.
app.post('/api/stripe-webhook', express.raw({type: 'application/json'}), handleStripeWebhook);

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173', // Your Vite dev server
  // Add your deployed frontend URL here once you have it
  'https://leaseify.netlify.app/'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions)); // Use the new options

// Standard middleware
app.use(express.json());



// --- API ROUTE REGISTRATION ---
app.use('/api/auth', authRoutes);
app.use('/api/properties', publicRoutes); // For public property listings
app.use('/api/applications', applicationRoutes); // For tenants applying and landlords managing

// Landlord-specific route groups
app.use('/api/landlord/properties', landlordPropertyRoutes);
app.use('/api/landlord/leases', landlordLeaseRoutes);
app.use('/api/landlord/maintenance-requests', landlordMaintenanceRoutes);
app.use('/api/landlord/dashboard', landlordDashboardRoutes);
app.use('/api/landlord/tasks', landlordTaskRoutes);
app.use('/api/landlord/payments', landlordPaymentRoutes);
app.use('/api/landlord/tenants', landlordTenantRoutes);
app.use('/api/landlord/logs', landlordLogRoutes);

// Tenant-specific route groups
app.use('/api/tenant/lease', tenantLeaseRoutes);
app.use('/api/tenant/maintenance-requests', tenantMaintenanceRoutes);
app.use('/api/tenant/payments', tenantPaymentRoutes);


// --- DATABASE CONNECTION & SERVER START ---
const DB_URI = process.env.MONGO_URI;
if (!DB_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined in your .env file. The application cannot start.');
    process.exit(1);
}

mongoose.connect(DB_URI)
    .then(() => {
        console.log('SUCCESS: MongoDB connection established successfully.');
        app.listen(PORT, () => console.log(`INFO: Server is operational and listening on port ${PORT}`));
    })
    .catch((error) => {
        console.error('ERROR: MongoDB connection failed.', error.message);
        process.exit(1);
    });