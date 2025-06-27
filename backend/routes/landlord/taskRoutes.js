// tenant_manage/backend/routes/landlord/taskRoutes.js

const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../../controllers/landlord/taskController');
const { protect } = require('../../middleware/authMiddleware');
const { isLandlord } = require('../../middleware/roleMiddleware');

router.use(protect, isLandlord);

router.route('/')
    .get(getTasks)
    .post(createTask);

router.route('/:id')
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;