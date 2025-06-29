import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import logService from './logService.js';

const initialState = {
    logs: [],
    isLoading: false,
    isError: false,
    message: '',
};

const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();

// Thunks are simplified.
export const getLogs = createAsyncThunk('logs/getAll', async (_, thunkAPI) => {
    try {
        return await logService.getLogs();
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const createLog = createAsyncThunk('logs/create', async (logData, thunkAPI) => {
    try {
        return await logService.createLog(logData);
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const logSlice = createSlice({
    name: 'logs',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLogs.pending, (state) => { state.isLoading = true; })
            .addCase(getLogs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.logs = action.payload;
            })
            .addCase(getLogs.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            .addCase(createLog.fulfilled, (state, action) => {
                state.logs.unshift(action.payload);
            });
    },
});

export const { reset } = logSlice.actions;
export default logSlice.reducer;
// // src/features/logs/logSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import logService from './logService';

// const initialState = {
//     logs: [],
//     isLoading: false,
//     isError: false,
//     message: '',
// };

// const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();

// export const getLogs = createAsyncThunk('logs/getAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await logService.getLogs(token);
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });

// export const createLog = createAsyncThunk('logs/create', async (logData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await logService.createLog(logData, token);
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });

// export const logSlice = createSlice({
//     name: 'logs',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getLogs.pending, (state) => { state.isLoading = true; })
//             .addCase(getLogs.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.logs = action.payload;
//             })
//             .addCase(getLogs.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             .addCase(createLog.fulfilled, (state, action) => {
//                 state.logs.unshift(action.payload); // Add new log to the top of the list
//             });
//     },
// });

// export const { reset } = logSlice.actions;
// export default logSlice.reducer;