import api from '../../services/api.js';

const API_URL = 'landlord/tasks/';

// The 'token' argument is removed from all functions.
// The interceptor will handle authentication.

const getTasks = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

const createTask = async (taskData) => {
    const response = await api.post(API_URL, taskData);
    return response.data;
};

const updateTask = async (taskData) => {
    const response = await api.put(API_URL + taskData.id, { isCompleted: taskData.isCompleted });
    return response.data;
};

const deleteTask = async (taskId) => {
    const response = await api.delete(API_URL + taskId);
    return response.data;
};

const taskService = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};

export default taskService;
// // src/features/tasks/taskService.js

// import api from '../../services/api';

// const API_URL = 'landlord/tasks/';

// // Get user tasks from the backend
// const getTasks = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(API_URL, config);
//     return response.data;
// };

// // Create a new task
// const createTask = async (taskData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(API_URL, taskData, config);
//     return response.data;
// };

// // Update a task (e.g., mark as complete)
// const updateTask = async (taskData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.put(API_URL + taskData.id, { isCompleted: taskData.isCompleted }, config);
//     return response.data;
// };

// // Delete a task
// const deleteTask = async (taskId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.delete(API_URL + taskId, config);
//     return response.data;
// };


// const taskService = {
//     getTasks,
//     createTask,
//     updateTask,
//     deleteTask,
// };

// export default taskService;

// // src/features/tasks/taskService.js

// import api from '../../services/api';

// const API_URL = 'landlord/tasks/';

// // Get user tasks
// const getTasks = async (token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.get(API_URL, config);
//     return response.data;
// };

// // Create new task
// const createTask = async (taskData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.post(API_URL, taskData, config);
//     return response.data;
// };

// // Update user task (e.g., mark as complete)
// const updateTask = async (taskData, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.put(API_URL + taskData.id, { isCompleted: taskData.isCompleted }, config);
//     return response.data;
// };

// // Delete user task
// const deleteTask = async (taskId, token) => {
//     const config = { headers: { Authorization: `Bearer ${token}` } };
//     const response = await api.delete(API_URL + taskId, config);
//     return response.data;
// };


// const taskService = {
//     getTasks,
//     createTask,
//     updateTask,
//     deleteTask,
// };

// export default taskService;