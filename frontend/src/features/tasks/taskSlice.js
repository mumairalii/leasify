// src/features/tasks/taskSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskService from './taskService';

const initialState = {
    tasks: [],
    isLoading: false,
    isError: false,
    message: '',
};

const getErrorMessage = (error) => {
    return (error.response?.data?.message) || error.message || error.toString();
};

// --- Async Thunks for each task operation ---
export const getTasks = createAsyncThunk('tasks/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskService.getTasks(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskService.createTask(taskData, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const updateTask = createAsyncThunk('tasks/update', async (taskData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskService.updateTask(taskData, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await taskService.deleteTask(id, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTasks.pending, (state) => { state.isLoading = true; })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.isLoading = false;
                state.tasks = action.payload;
            })
            .addCase(getTasks.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.map((task) => 
                    task._id === action.payload._id ? action.payload : task
                );
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task._id !== action.payload.id);
            });
    },
});

export const { reset } = taskSlice.actions;
export default taskSlice.reducer;

// // src/features/tasks/taskSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import taskService from './taskService';

// const initialState = {
//     tasks: [],
//     isLoading: false,
//     isError: false,
//     message: '',
// };

// // --- Async Thunks for each CRUD operation ---
// export const getTasks = createAsyncThunk('tasks/getAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await taskService.getTasks(token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await taskService.createTask(taskData, token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const updateTask = createAsyncThunk('tasks/update', async (taskData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await taskService.updateTask(taskData, token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await taskService.deleteTask(id, token);
//     } catch (error) { /* ... error handling ... */ }
// });


// export const taskSlice = createSlice({
//     name: 'tasks',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getTasks.pending, (state) => { state.isLoading = true; })
//             .addCase(getTasks.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.tasks = action.payload;
//             })
//             .addCase(getTasks.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             .addCase(createTask.fulfilled, (state, action) => {
//                 state.tasks.push(action.payload);
//             })
//             .addCase(updateTask.fulfilled, (state, action) => {
//                 state.tasks = state.tasks.map((task) => 
//                     task._id === action.payload._id ? action.payload : task
//                 );
//             })
//             .addCase(deleteTask.fulfilled, (state, action) => {
//                 state.tasks = state.tasks.filter((task) => task._id !== action.payload.id);
//             });
//     },
// });

// export const { reset } = taskSlice.actions;
// export default taskSlice.reducer;