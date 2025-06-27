import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentService from './paymentService';

const initialState = {
    paymentHistory: [], // This will hold the list of fetched payments
    isLoading: false,
    isError: false,
    message: '',
};

const getErrorMessage = (error) => {
    return (error.response?.data?.message) || error.message || error.toString();
};

// --- Async Thunks ---

// For landlords to log an offline payment
export const logOfflinePayment = createAsyncThunk('payments/logOffline', async (paymentData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await paymentService.logOfflinePayment(paymentData, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

// For landlords to get the payment history for a specific lease
export const getPaymentsForLease = createAsyncThunk('payments/getForLease', async (leaseId, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await paymentService.getPaymentsForLease(leaseId, token);
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

// For tenants to get their own payment history
export const getMyPayments = createAsyncThunk('payments/getMyPayments', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await paymentService.getMyPayments(token);
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});


export const paymentSlice = createSlice({
    name: 'payments',
    initialState,
    reducers: {
        reset: (state) => {
            // Reset all state fields to their initial values
            state.paymentHistory = [];
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Cases for logging an offline payment
            .addCase(logOfflinePayment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logOfflinePayment.fulfilled, (state) => {
                state.isLoading = false;
                // No state change needed here, we will refetch the list instead
            })
            .addCase(logOfflinePayment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Cases for getting payment history (both landlord and tenant can use this)
            .addCase(getPaymentsForLease.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getPaymentsForLease.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentHistory = action.payload;
            })
            .addCase(getPaymentsForLease.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getMyPayments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMyPayments.fulfilled, (state, action) => {
                state.isLoading = false;
                state.paymentHistory = action.payload;
            })
            .addCase(getMyPayments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = paymentSlice.actions;
export default paymentSlice.reducer;
// // src/features/payments/paymentSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import paymentService from './paymentService';

// const initialState = {
//     isLoading: false,
//     isError: false,
//     message: '',
// };

// export const logOfflinePayment = createAsyncThunk('payments/logOffline', async (paymentData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await paymentService.logOfflinePayment(paymentData, token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const paymentSlice = createSlice({
//     name: 'payments',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(logOfflinePayment.pending, (state) => { state.isLoading = true; })
//             .addCase(logOfflinePayment.fulfilled, (state) => { state.isLoading = false; })
//             .addCase(logOfflinePayment.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = paymentSlice.actions;
// export default paymentSlice.reducer;