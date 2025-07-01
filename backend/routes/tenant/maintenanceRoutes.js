const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { createRequest, getRequests } = require('../../controllers/tenant/maintenanceController');
const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware'); // Import from the correct file

const { isTenant } = require('../../middleware/roleMiddleware'); // Import the correct middleware

// All routes here are protected and for tenants only
router.use(protect, isTenant);

// Validation rules for creating a request
const validateRequestCreation = [
    body('description', 'A description of the issue is required').not().isEmpty().trim().escape()
];

// Apply validation to the POST route
router.route('/')
    .get(getRequests)
    .post(validateRequestCreation, createRequest);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const { protect } = require('../../middleware/authMiddleware');
// const { isTenant } = require('../../middleware/roleMiddleware');

// // This line now correctly imports both functions from the controller
// const {
//     createMaintenanceRequest,
//     getTenantRequests
// } = require('../../controllers/tenant/maintenanceController');

// // This chained route handles both GET and POST requests to the base URL
// router.route('/')
//     .get(protect, isTenant, getTenantRequests)
//     .post(
//         [protect, isTenant, [body('description', 'Description is required').not().isEmpty()]],
//         createMaintenanceRequest
//     );

// module.exports = router;
// // backend/routes/tenant/maintenanceRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const { body } = require('express-validator');
// // const { createMaintenanceRequest } = require('../../controllers/tenant/maintenanceController');
// // const { protect } = require('../../middleware/authMiddleware');
// // const { isTenant } = require('../../middleware/roleMiddleware');

// // router.post(
// //     '/',
// //     [protect, isTenant, [body('description', 'Description is required').not().isEmpty()]],
// //     createMaintenanceRequest
// // );

// // module.exports = router;

// // backend/routes/tenant/maintenanceRoutes.js
// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const { createMaintenanceRequest } = require('../../controllers/tenant/maintenanceController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isTenant } = require('../../middleware/roleMiddleware');

// const { 
     
//     getTenantRequests 
// } = require('../../controllers/tenant/maintenanceController');

// // The path here should just be '/' because the rest of the path is defined in server.js
// router.post(
//     '/',
//     [protect, isTenant, [body('description', 'Description is required').not().isEmpty()]],
//     createMaintenanceRequest
// );
// router.get('/', protect, isTenant, getTenantRequests);
// module.exports = router;