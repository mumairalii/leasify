// tenant_manage/backend/controllers/landlord/taskController.js

const Task = require('../../models/Task');

// @desc    Get all tasks for the logged-in user
// @route   GET /api/landlord/tasks
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id }).sort({ isCompleted: 1, dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new task
// @route   POST /api/landlord/tasks
const createTask = async (req, res) => {
    try {
        const { title, dueDate } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Title is required' });
        }
        const task = await Task.create({
            title,
            dueDate,
            user: req.user.id,
            organization: req.user.organization,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a task (e.g., mark as complete)
// @route   PUT /api/landlord/tasks/:id
const updateTask = async (req, res) => {
    try {
        const { isCompleted } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.isCompleted = isCompleted;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/landlord/tasks/:id
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task || task.user.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.status(200).json({ id: req.params.id, message: 'Task deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };