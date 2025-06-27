// src/features/applications/applicationSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import applicationService from './applicationService';

const initialState = {
    applications: [],
    isLoading: false,
    isError: false,
    message: '',
};

const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();

// --- Async Thunks ---
export const createApplication = createAsyncThunk('applications/create', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await applicationService.createApplication(data, token);
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const getApplications = createAsyncThunk('applications/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await applicationService.getApplications(token);
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async (data, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await applicationService.updateApplicationStatus(data, token);
    } catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});

export const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
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
            // --- THIS IS THE CORRECTED, SINGLE SET OF CASES FOR UPDATING ---
            .addCase(updateApplicationStatus.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                // Remove the approved/rejected application from the pending list
                state.applications = state.applications.filter(app => app._id !== action.payload._id);
            })
            .addCase(updateApplicationStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
            // Note: createApplication does not need a case here as it doesn't affect the landlord's list of applications.
    },
});

export const { reset } = applicationSlice.actions;
export default applicationSlice.reducer;