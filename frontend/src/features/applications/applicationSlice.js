import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from './applicationService.js';

const initialState = {
    applications: [],
    summary: [],
    isSummaryLoading: false,
    isLoading: false,
    isError: false,
    message: '',
};

const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();

// --- ASYNC THUNKS ---
export const getApplications = createAsyncThunk('applications/getAll', async (_, thunkAPI) => {
    try { return await applicationService.getApplications(); } 
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const getApplicationSummary = createAsyncThunk('applications/getSummary', async (_, thunkAPI) => {
    try { return await applicationService.getApplicationSummary(); } 
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const updateApplication = createAsyncThunk('applications/updateStatus', async (data, thunkAPI) => {
    try { return await applicationService.updateApplicationStatus(data); } 
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const createApplication = createAsyncThunk('applications/create', async (data, thunkAPI) => {
    try { return await applicationService.createApplication(data); } 
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});


export const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Get ALL applications
            .addCase(getApplications.pending, (state) => { state.isLoading = true; })
            .addCase(getApplications.fulfilled, (state, action) => {
                state.isLoading = false;
                state.applications = action.payload;
            })
            .addCase(getApplications.rejected, (state, action) => {
                state.isLoading = false; 
                state.isError = true; 
                state.message = action.payload;
            })
            // Get dashboard SUMMARY
            .addCase(getApplicationSummary.pending, (state) => { state.isSummaryLoading = true; })
            .addCase(getApplicationSummary.fulfilled, (state, action) => {
                state.isSummaryLoading = false;
                state.summary = action.payload;
            })
            .addCase(getApplicationSummary.rejected, (state, action) => {
                state.isSummaryLoading = false; 
                state.isError = true; 
                state.message = action.payload;
            })
            // Update application STATUS
            .addCase(updateApplication.pending, (state) => { state.isLoading = true; })
            .addCase(updateApplication.fulfilled, (state, action) => {
                state.isLoading = false;
                // --- THIS IS THE CORRECT LOGIC ---
                // Find the application in the state array and update it in place.
                const index = state.applications.findIndex(app => app._id === action.payload._id);
                if (index !== -1) {
                    state.applications[index] = action.payload;
                }
            })
            .addCase(updateApplication.rejected, (state, action) => {
                state.isLoading = false; 
                state.isError = true; 
                state.message = action.payload;
            });
    },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import applicationService from './applicationService.js';

// const initialState = {
//     applications: [],
//     summary: [], // --- ADD THIS ---
//     isSummaryLoading: false, // --- ADD THIS ---
//     isLoading: false,
    
//     isError: false,
//     message: '',
// };

// const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();

// // Thunks are simplified, no longer handle tokens.
// export const createApplication = createAsyncThunk('applications/create', async (data, thunkAPI) => {
//     try {
//         return await applicationService.createApplication(data);
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });

// export const getApplications = createAsyncThunk('applications/getAll', async (_, thunkAPI) => {
//     try {
//         return await applicationService.getApplications();
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });


// export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async (data, thunkAPI) => {
//     try {
//         return await applicationService.updateApplicationStatus(data);
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });


// export const getApplicationSummary = createAsyncThunk(
//     'applications/getSummary',
//     async (_, thunkAPI) => {
//         try {
//             // We no longer need to get the token here.
//             // The service function doesn't require it as an argument anymore.
//             return await applicationService.getApplicationSummary();
//         } catch (error) {
//             const message = (error.response?.data?.message) || error.message || error.toString();
//             return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const applicationSlice = createSlice({
//     name: 'applications',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getApplications.pending, (state) => { state.isLoading = true; })
//             .addCase(getApplications.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.applications = action.payload;
//             })
//             .addCase(getApplications.rejected, (state, action) => {
//                 state.isLoading = false; state.isError = true; state.message = action.payload;
//             })
//             .addCase(updateApplicationStatus.pending, (state) => { state.isLoading = true; })
//             .addCase(updateApplicationStatus.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.applications = state.applications.filter(app => app._id !== action.payload._id);
//             })
//             .addCase(updateApplicationStatus.rejected, (state, action) => {
//                 state.isLoading = false; state.isError = true; state.message = action.payload;
//             })
//             .addCase(getApplicationSummary.pending, (state) => {
//                 state.isSummaryLoading = true;
//             })
//             .addCase(getApplicationSummary.fulfilled, (state, action) => {
//                 state.isSummaryLoading = false;
//                 state.summary = action.payload;
//             })
//             .addCase(getApplicationSummary.rejected, (state, action) => {
//                 state.isSummaryLoading = false;
//                 state.isError = true; // You might want a separate error state for this
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = applicationSlice.actions;
// export default applicationSlice.reducer;

// // src/features/applications/applicationSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import applicationService from './applicationService';

// const initialState = {
//     applications: [],
//     isLoading: false,
//     isError: false,
//     message: '',
// };

// const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();

// // --- Async Thunks ---
// export const createApplication = createAsyncThunk('applications/create', async (data, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await applicationService.createApplication(data, token);
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });

// export const getApplications = createAsyncThunk('applications/getAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await applicationService.getApplications(token);
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });

// export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async (data, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await applicationService.updateApplicationStatus(data, token);
//     } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
// });

// export const applicationSlice = createSlice({
//     name: 'applications',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getApplications.pending, (state) => { state.isLoading = true; })
//             .addCase(getApplications.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.applications = action.payload;
//             })
//             .addCase(getApplications.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             // --- THIS IS THE CORRECTED, SINGLE SET OF CASES FOR UPDATING ---
//             .addCase(updateApplicationStatus.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(updateApplicationStatus.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 // Remove the approved/rejected application from the pending list
//                 state.applications = state.applications.filter(app => app._id !== action.payload._id);
//             })
//             .addCase(updateApplicationStatus.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//             // Note: createApplication does not need a case here as it doesn't affect the landlord's list of applications.
//     },
// });

// export const { reset } = applicationSlice.actions;
// export default applicationSlice.reducer;