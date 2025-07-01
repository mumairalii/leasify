const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Task = require('../../models/Task');

const getTasks = asyncHandler(async (req, res) => {
    const tasks = await Task.find({
        user: req.user.id,
        organization: req.user.organization
    }).sort({ isCompleted: 1, dueDate: 1 });

    res.status(200).json(tasks);
});

const createTask = asyncHandler(async (req, res) => {
    // Check for validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }

    const { title, dueDate } = req.body;

    const task = await Task.create({
        title,
        dueDate,
        user: req.user.id,
        organization: req.user.organization,
    });

    res.status(201).json(task);
});

const updateTask = asyncHandler(async (req, res) => {
    // Check for validation errors first
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400);
        throw new Error('Validation failed', { cause: errors.array() });
    }

    const { isCompleted } = req.body;

    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, organization: req.user.organization },
        { isCompleted },
        { new: true }
    );

    if (!task) {
        res.status(404);
        throw new Error('Task not found or you are not authorized');
    }

    res.status(200).json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await Task.findOneAndDelete({
        _id: req.params.id,
        organization: req.user.organization
    });

    if (!task) {
        res.status(404);
        throw new Error('Task not found or you are not authorized');
    }

    res.status(200).json({ id: req.params.id, message: 'Task deleted' });
});

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask
};

// const asyncHandler = require('express-async-handler');
// const { validationResult } = require('express-validator');
// const Task = require('../../models/Task');

// /**
//  * @desc    Get all tasks for the logged-in user
//  * @route   GET /api/landlord/tasks
//  * @access  Private (Landlord Only)
//  */
// const getTasks = asyncHandler(async (req, res) => {
//     const tasks = await Task.find({
//         user: req.user.id,
//         organization: req.user.organization
//     }).sort({ isCompleted: 1, dueDate: 1 });

//     res.status(200).json(tasks);
// });

// /**
//  * @desc    Create a new task
//  * @route   POST /api/landlord/tasks
//  * @access  Private (Landlord Only)
//  */
// const createTask = asyncHandler(async (req, res) => {
//     // Check for validation errors first
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         res.status(400);
//         // The 'cause' will be picked up by our custom errorHandler to show detailed validation messages
//         throw new Error('Validation failed', { cause: errors.array() });
//     }

//     const { title, dueDate } = req.body;

//     const task = await Task.create({
//         title,
//         dueDate,
//         user: req.user.id,
//         organization: req.user.organization,
//     });

//     res.status(201).json(task);
// });

// /**
//  * @desc    Update a task (e.g., mark as complete)
//  * @route   PUT /api/landlord/tasks/:id
//  * @access  Private (Landlord Only)
//  */
// const updateTask = asyncHandler(async (req, res) => {
//     const { isCompleted } = req.body;

//     const task = await Task.findOneAndUpdate(
//         { _id: req.params.id, organization: req.user.organization },
//         { isCompleted },
//         { new: true }
//     );

//     if (!task) {
//         res.status(404);
//         throw new Error('Task not found or you are not authorized');
//     }

//     res.status(200).json(task);
// });

// /**
//  * @desc    Delete a task
//  * @route   DELETE /api/landlord/tasks/:id
//  * @access  Private (Landlord Only)
//  */
// const deleteTask = asyncHandler(async (req, res) => {
//     const task = await Task.findOneAndDelete({
//         _id: req.params.id,
//         organization: req.user.organization
//     });

//     if (!task) {
//         res.status(404);
//         throw new Error('Task not found or you are not authorized');
//     }

//     res.status(200).json({ id: req.params.id, message: 'Task deleted' });
// });

// module.exports = {
//     getTasks,
//     createTask,
//     updateTask,
//     deleteTask
// };

// const asyncHandler = require('express-async-handler');
// const Task = require('../../models/Task');
// const { validationResult } = require('express-validator'); // 1. Import validationResult

// /**
//  * @desc    Get all tasks for the logged-in user
//  * @route   GET /api/landlord/tasks
//  * @access  Private (Landlord Only)
//  */
// const getTasks = asyncHandler(async (req, res) => {
//     const tasks = await Task.find({ 
//         user: req.user.id,
//         organization: req.user.organization 
//     }).sort({ isCompleted: 1, dueDate: 1 });
    
//     res.status(200).json(tasks);
// });

// /**
//  * @desc    Create a new task
//  * @route   POST /api/landlord/tasks
//  * @access  Private (Landlord Only)
//  */
// const createTask = asyncHandler(async (req, res) => {
//     const { title, dueDate } = req.body;
//     if (!title) {
//         res.status(400);
//         throw new Error('Title is required');
//     }

//     const task = await Task.create({
//         title,
//         dueDate,
//         user: req.user.id,
//         organization: req.user.organization,
//     });

//     res.status(201).json(task);
// });

// /**
//  * @desc    Update a task (e.g., mark as complete)
//  * @route   PUT /api/landlord/tasks/:id
//  * @access  Private (Landlord Only)
//  */
// const updateTask = asyncHandler(async (req, res) => {
//     const { isCompleted } = req.body;

//     // Atomically find a task by its ID AND the user's organization and update it.
//     const task = await Task.findOneAndUpdate(
//         { _id: req.params.id, organization: req.user.organization },
//         { isCompleted },
//         { new: true }
//     );

//     if (!task) {
//         res.status(404);
//         throw new Error('Task not found or you are not authorized');
//     }

//     res.status(200).json(task);
// });

// /**
//  * @desc    Delete a task
//  * @route   DELETE /api/landlord/tasks/:id
//  * @access  Private (Landlord Only)
//  */
// const deleteTask = asyncHandler(async (req, res) => {
//     // Atomically find a task by its ID AND the user's organization and delete it.
//     const task = await Task.findOneAndDelete({ 
//         _id: req.params.id, 
//         organization: req.user.organization 
//     });

//     if (!task) {
//         res.status(404);
//         throw new Error('Task not found or you are not authorized');
//     }

//     res.status(200).json({ id: req.params.id, message: 'Task deleted' });
// });

// module.exports = { 
//     getTasks, 
//     createTask, 
//     updateTask, 
//     deleteTask 
// };

// const Task = require('../../models/Task');

// // @desc    Get all tasks for the logged-in user
// // @route   GET /api/landlord/tasks
// const getTasks = async (req, res) => {
//     try {
//         // This query is already secure because it uses req.user.id, which is implicitly
//         // tied to the organization. For consistency, we can add the org check.
//         const tasks = await Task.find({ 
//             user: req.user.id,
//             organization: req.user.organization 
//         }).sort({ isCompleted: 1, dueDate: 1 });
//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Create a new task
// // @route   POST /api/landlord/tasks
// const createTask = async (req, res) => {
//     // This function is already secure. No changes needed.
//     try {
//         const { title, dueDate } = req.body;
//         if (!title) {
//             return res.status(400).json({ message: 'Title is required' });
//         }
//         const task = await Task.create({
//             title,
//             dueDate,
//             user: req.user.id,
//             organization: req.user.organization,
//         });
//         res.status(201).json(task);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Update a task (e.g., mark as complete)
// // @route   PUT /api/landlord/tasks/:id
// const updateTask = async (req, res) => {
//     try {
//         const { isCompleted } = req.body;

//         // --- REFACTOR ---
//         // Atomically find a task by its ID AND the user's organization and update it.
//         const task = await Task.findOneAndUpdate(
//             { _id: req.params.id, organization: req.user.organization },
//             { isCompleted },
//             { new: true }
//         );

//         if (!task) {
//             // If no task is found/updated, it's either the wrong ID or the user is not authorized.
//             return res.status(404).json({ message: 'Task not found or you are not authorized' });
//         }

//         res.status(200).json(task);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Delete a task
// // @route   DELETE /api/landlord/tasks/:id
// const deleteTask = async (req, res) => {
//     try {
//         // --- REFACTOR ---
//         // Atomically find a task by its ID AND the user's organization and delete it.
//         const task = await Task.findOneAndDelete({ 
//             _id: req.params.id, 
//             organization: req.user.organization 
//         });

//         if (!task) {
//             // If no task is found/deleted, it's either the wrong ID or the user is not authorized.
//             return res.status(404).json({ message: 'Task not found or you are not authorized' });
//         }

//         res.status(200).json({ id: req.params.id, message: 'Task deleted' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getTasks, createTask, updateTask, deleteTask };



// const Task = require('../../models/Task');

// // @desc    Get all tasks for the logged-in user
// // @route   GET /api/landlord/tasks
// const getTasks = async (req, res) => {
//     try {
//         const tasks = await Task.find({ user: req.user.id }).sort({ isCompleted: 1, dueDate: 1 });
//         res.status(200).json(tasks);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Create a new task
// // @route   POST /api/landlord/tasks
// const createTask = async (req, res) => {
//     try {
//         const { title, dueDate } = req.body;
//         if (!title) {
//             return res.status(400).json({ message: 'Title is required' });
//         }
//         const task = await Task.create({
//             title,
//             dueDate,
//             user: req.user.id,
//             organization: req.user.organization,
//         });
//         res.status(201).json(task);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Update a task (e.g., mark as complete)
// // @route   PUT /api/landlord/tasks/:id
// const updateTask = async (req, res) => {
//     try {
//         const { isCompleted } = req.body;
//         const task = await Task.findById(req.params.id);

//         if (!task || task.user.toString() !== req.user.id) {
//             return res.status(404).json({ message: 'Task not found' });
//         }

//         task.isCompleted = isCompleted;
//         await task.save();
//         res.status(200).json(task);
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// // @desc    Delete a task
// // @route   DELETE /api/landlord/tasks/:id
// const deleteTask = async (req, res) => {
//     try {
//         const task = await Task.findById(req.params.id);

//         if (!task || task.user.toString() !== req.user.id) {
//             return res.status(404).json({ message: 'Task not found' });
//         }

//         await Task.findByIdAndDelete(req.params.id);
//         res.status(200).json({ id: req.params.id, message: 'Task deleted' });
//     } catch (error) {
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// module.exports = { getTasks, createTask, updateTask, deleteTask };