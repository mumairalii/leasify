import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import dashboardService from './dashboardService';

// Define the initial state with the new nested structure
const initialState = {
    stats: {
        kpis: {
            totalProperties: 0,
            occupancyRate: 0,
            vacantUnits: 0,
            openMaintenanceCount: 0,
            leasesExpiringSoon: 0,
            totalOutstandingDebt: 0,
            collectedThisMonth: 0,
            potentialMonthlyRent: 0,
        },
        charts: {
            rentCollection: [],
            occupancy: [],
        },
    },
    isLoading: true,
    isError: false,
    message: '',
};

// The thunk for fetching data remains the same, but it will receive the new data structure
export const getDashboardStats = createAsyncThunk(
    'dashboard/getStats',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await dashboardService.getDashboardStats(token);
        } catch (error) {
            const message = (error.response?.data?.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                // The entire payload is now assigned to the stats object
                state.stats = action.payload;
            })
            .addCase(getDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = dashboardSlice.actions;
export default dashboardSlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import dashboardService from './dashboardService.js';

// const initialState = {
//     stats: null,
//     isError: false,
//     isSuccess: false,
//     isLoading: false,
//     message: '',
// };

// // The thunk is simplified.
// export const getDashboardStats = createAsyncThunk('dashboard/getStats', async (_, thunkAPI) => {
//     try {
//         return await dashboardService.getDashboardStats();
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const dashboardSlice = createSlice({
//     name: 'dashboard',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getDashboardStats.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getDashboardStats.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.stats = action.payload;
//             })
//             .addCase(getDashboardStats.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = dashboardSlice.actions;
// export default dashboardSlice.reducer;
// // src/features/dashboard/dashboardSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import dashboardService from './dashboardService';

// const initialState = {
//     stats: null,
//     isError: false,
//     isSuccess: false,
//     isLoading: false,
//     message: '',
// };

// // Async thunk to get dashboard stats
// export const getDashboardStats = createAsyncThunk('dashboard/getStats', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await dashboardService.getDashboardStats(token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const dashboardSlice = createSlice({
//     name: 'dashboard',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getDashboardStats.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getDashboardStats.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.stats = action.payload;
//             })
//             .addCase(getDashboardStats.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = dashboardSlice.actions;
// export default dashboardSlice.reducer;