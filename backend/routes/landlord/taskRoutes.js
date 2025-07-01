const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
    getTasks,
    createTask,
    updateTask,
    deleteTask
} = require('../../controllers/landlord/taskController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware'); // Import from the correct file


// All task routes are protected and for landlords only
router.use(protect, isLandlord);

// Validation rules for creating a task
const validateTaskCreation = [
    body('title', 'Title is required').not().isEmpty().trim().escape(),
    body('dueDate', 'Invalid date format').optional({ checkFalsy: true }).isISO8601().toDate()
];

// Validation rules for updating a task
const validateTaskUpdate = [
    param('id', 'Task ID is invalid').isMongoId(),
    body('isCompleted', 'isCompleted must be a boolean').isBoolean()
];

// --- Route Definitions ---
router.route('/')
    .get(getTasks)
    .post(validateTaskCreation, createTask);

router.route('/:id')
    .put(validateTaskUpdate, updateTask)
    .delete(deleteTask);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator'); // 1. Import 'body'
// const {
//     getTasks,
//     createTask,
//     updateTask,
//     deleteTask
// } = require('../../controllers/landlord/taskController');

// // 2. Define the validation rules for creating a task
// const validateTask = [
//     body('title', 'Title is required').not().isEmpty().trim().escape(),
//     body('dueDate', 'Invalid date format').optional({ checkFalsy: true }).isISO8601().toDate()
// ];

// // Apply the validation middleware to the POST route
// router.post('/', validateTask, createTask);

// // We will add validation to the PUT route later
// router.put('/:id', updateTask);
// router.delete('/:id', deleteTask);
// router.get('/', getTasks);

// module.exports = router;

// // tenant_manage/backend/routes/landlord/taskRoutes.js

// const express = require('express');
// const router = express.Router();
// const { getTasks, createTask, updateTask, deleteTask } = require('../../controllers/landlord/taskController');
// const { protect } = require('../../middleware/authMiddleware');
// const { isLandlord } = require('../../middleware/roleMiddleware');

// router.use(protect, isLandlord);

// router.route('/')
//     .get(getTasks)
//     .post(createTask);

// router.route('/:id')
//     .put(updateTask)
//     .delete(deleteTask);

// module.exports = router;