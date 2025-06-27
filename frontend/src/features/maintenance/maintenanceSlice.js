import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceService from './maintenanceService';

// A helper function to consistently extract error messages
const getErrorMessage = (error) => {
    return (error.response?.data?.message) || error.message || error.toString();
};

const initialState = {
    requests: [],
    isLoading: false,
    isSuccess: false, // It's good practice to track success state as well
    isError: false,
    message: '',
};

// --- Thunks with Full Error Handling ---

export const createRequest = createAsyncThunk('maintenance/create', async (requestData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await maintenanceService.createRequest(requestData, token);
    } catch (error) {
        const message = getErrorMessage(error);
        return thunkAPI.rejectWithValue(message);
    }
});

export const getTenantRequests = createAsyncThunk('maintenance/getTenantAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await maintenanceService.getTenantRequests(token);
    } catch (error) {
        const message = getErrorMessage(error);
        return thunkAPI.rejectWithValue(message);
    }
});

export const getLandlordRequests = createAsyncThunk('maintenance/getLandlordAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await maintenanceService.getLandlordRequests(token);
    } catch (error) {
        const message = getErrorMessage(error);
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateRequest = createAsyncThunk('maintenance/update', async (requestData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await maintenanceService.updateRequest(requestData, token);
    } catch (error) {
        const message = getErrorMessage(error);
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteRequest = createAsyncThunk('maintenance/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token;
        return await maintenanceService.deleteRequest(id, token);
    } catch (error) {
        const message = getErrorMessage(error);
        return thunkAPI.rejectWithValue(message);
    }
});


export const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        }
    },
    // --- Extra Reducers with All Cases for Proper State Management ---
    extraReducers: (builder) => {
        builder
            // Get Tenant Requests
            .addCase(getTenantRequests.pending, (state) => { state.isLoading = true; })
            .addCase(getTenantRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.requests = action.payload;
            })
            .addCase(getTenantRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Landlord Requests
            .addCase(getLandlordRequests.pending, (state) => { state.isLoading = true; })
            .addCase(getLandlordRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.requests = action.payload;
            })
            .addCase(getLandlordRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Create Request
            .addCase(createRequest.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.requests.unshift(action.payload);
            })
            .addCase(createRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Update Request
            .addCase(updateRequest.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.requests = state.requests.map((req) => req._id === action.payload._id ? action.payload : req);
            })
            .addCase(updateRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Delete Request
            .addCase(deleteRequest.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.requests = state.requests.filter((req) => req._id !== action.payload.id);
            })
            .addCase(deleteRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import maintenanceService from './maintenanceService';

// const initialState = { requests: [], isLoading: false, isError: false, message: '' };

// // Thunks
// export const createRequest = createAsyncThunk('maintenance/create', async (requestData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await maintenanceService.createRequest(requestData, token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const getTenantRequests = createAsyncThunk('maintenance/getTenantAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await maintenanceService.getTenantRequests(token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const getLandlordRequests = createAsyncThunk('maintenance/getLandlordAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await maintenanceService.getLandlordRequests(token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const updateRequest = createAsyncThunk('maintenance/update', async (requestData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await maintenanceService.updateRequest(requestData, token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const deleteRequest = createAsyncThunk('maintenance/delete', async (id, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await maintenanceService.deleteRequest(id, token);
//     } catch (error) { /* ... error handling ... */ }
// });

// export const maintenanceSlice = createSlice({
//     name: 'maintenance',
//     initialState,
//     reducers: {
//         reset: (state) => {
//             state.isLoading = false;
//             state.isError = false;
//             state.isSuccess = false;
//             state.message = '';
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             // Cases for both getTenantRequests and getLandlordRequests
//             .addCase(getTenantRequests.pending, (state) => { state.isLoading = true; })
//             .addCase(getTenantRequests.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.requests = action.payload;
//             })
//             .addCase(getTenantRequests.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             .addCase(getLandlordRequests.pending, (state) => { state.isLoading = true; })
//             .addCase(getLandlordRequests.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.requests = action.payload;
//             })
//             .addCase(getLandlordRequests.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             // Other cases
//             .addCase(createRequest.fulfilled, (state, action) => {
//                 state.requests.unshift(action.payload); // Add new request to the top of the list
//             })
//             .addCase(updateRequest.fulfilled, (state, action) => {
//                 state.requests = state.requests.map((req) => req._id === action.payload._id ? action.payload : req);
//             })
//             .addCase(deleteRequest.fulfilled, (state, action) => {
//                 state.requests = state.requests.filter((req) => req._id !== action.payload.id);
//             });
//     },
// });

// export const { reset } = maintenanceSlice.actions;
// export default maintenanceSlice.reducer;



// // // import maintenanceService from './maintenanceService';

// // // const initialState = {
// // //     requests: [],
// // //     isLoading: false,
// // //     isError: false,
// // //     isSuccess: false,
// // //     message: '',
// // // };

// // // // Async thunk for creating a request
// // // export const createRequest = createAsyncThunk('maintenance/create', async (requestData, thunkAPI) => {
// // //     try {
// // //         const token = thunkAPI.getState().auth.user.token;
// // //         return await maintenanceService.createRequest(requestData, token);
// // //     } catch (error) {
// // //         const message = (error.response?.data?.message) || error.message || error.toString();
// // //         return thunkAPI.rejectWithValue(message);
// // //     }
// // // });

// // // export const maintenanceSlice = createSlice({
// // //     name: 'maintenance',
// // //     initialState,
// // //     reducers: {
// // //         reset: (state) => initialState
// // //     },
// // //     extraReducers: (builder) => {
// // //         builder
// // //             .addCase(createRequest.pending, (state) => {
// // //                 state.isLoading = true;
// // //             })
// // //             .addCase(createRequest.fulfilled, (state, action) => {
// // //                 state.isLoading = false;
// // //                 state.isSuccess = true;
// // //                 // Optionally add the new request to the state if you want to display a list
// // //                 state.requests.push(action.payload);
// // //             })
// // //             .addCase(createRequest.rejected, (state, action) => {
// // //                 state.isLoading = false;
// // //                 state.isError = true;
// // //                 state.message = action.payload;
// // //             });
// // //     },
// // // });

// // // export const { reset } = maintenanceSlice.actions;
// // // export default maintenanceSlice.reducer;