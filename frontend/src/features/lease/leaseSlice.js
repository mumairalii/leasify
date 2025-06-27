import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import leaseService from './leaseService';

const initialState = {
    lease: null, // We expect a single lease object, so we initialize to null
    isLoading: false,
    isError: false,
    message: '',
};

// Async thunk for getting the tenant's lease
export const getMyLease = createAsyncThunk('lease/getMyLease', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await leaseService.getMyLease(token);
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const assignLease = createAsyncThunk('lease/assign', async (leaseData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await leaseService.assignLease(leaseData, token);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});
// --- END OF NEW THUNK ---

export const leaseSlice = createSlice({
    name: 'lease',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyLease.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyLease.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.lease = action.payload;
            })
            .addCase(getMyLease.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.lease = null;
            })
            .addCase(assignLease.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(assignLease.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                // We don't need to add the lease to the state here, 
                // as this slice is mainly for the tenant's view.
                // We could dispatch another action to refetch properties if needed.
            })
            .addCase(assignLease.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = leaseSlice.actions;
export default leaseSlice.reducer;