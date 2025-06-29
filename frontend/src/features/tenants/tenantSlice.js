import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import tenantService from './tenantService.js';

const initialState = {
    overdueTenants: [],
    allTenants: [],
    isLoading: false,
    isError: false,
    message: '',
};

const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();

// Thunks are simplified, no longer handle tokens.
export const getOverdueTenants = createAsyncThunk('tenants/getOverdue', async (_, thunkAPI) => {
    try {
        return await tenantService.getOverdueTenants();
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const getTenants = createAsyncThunk('tenants/getAll', async (_, thunkAPI) => {
    try {
        return await tenantService.getTenants();
    } catch (error) {
        return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
});

export const tenantSlice = createSlice({
    name: 'tenants',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOverdueTenants.pending, (state) => { state.isLoading = true; })
            .addCase(getOverdueTenants.fulfilled, (state, action) => {
                state.isLoading = false;
                state.overdueTenants = action.payload;
            })
            .addCase(getOverdueTenants.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            .addCase(getTenants.pending, (state) => { state.isLoading = true; })
            .addCase(getTenants.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allTenants = action.payload;
            })
            .addCase(getTenants.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            });
    },
});

export const { reset } = tenantSlice.actions;
export default tenantSlice.reducer;
// // src/features/tenants/tenantSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import tenantService from './tenantService';

// const initialState = {
//     overdueTenants: [],
//     allTenants: [],
//     isLoading: false,
//     isError: false,
//     message: '',
// };

// // Async thunk to fetch the overdue tenants
// export const getOverdueTenants = createAsyncThunk('tenants/getOverdue', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await tenantService.getOverdueTenants(token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });
// export const getTenants = createAsyncThunk('tenants/getAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await tenantService.getTenants(token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const tenantSlice = createSlice({
//     name: 'tenants',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getOverdueTenants.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getOverdueTenants.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.overdueTenants = action.payload;
//             })
//             .addCase(getOverdueTenants.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//              // --- ADD CASES FOR THE NEW THUNK ---
//             .addCase(getTenants.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getTenants.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.allTenants = action.payload;
//             })
//             .addCase(getTenants.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = tenantSlice.actions;
// export default tenantSlice.reducer;

// // src/features/tenants/tenantSlice.js

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import tenantService from './tenantService';

// const initialState = {
//     overdueTenants: [],
//     isLoading: false,
//     isError: false,
//     message: '',
// };

// export const getOverdueTenants = createAsyncThunk('tenants/getOverdue', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await tenantService.getOverdueTenants(token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const tenantSlice = createSlice({
//     name: 'tenants',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getOverdueTenants.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getOverdueTenants.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.overdueTenants = action.payload;
//             })
//             .addCase(getOverdueTenants.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = tenantSlice.actions;
// export default tenantSlice.reducer;