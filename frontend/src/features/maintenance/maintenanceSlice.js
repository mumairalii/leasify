import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceService from './maintenanceService.js';

const getErrorMessage = (error) => (error.response?.data?.message) || error.message || error.toString();
const initialState = { requests: [], isLoading: false, isSuccess: false, isError: false, message: '' };

// Thunks no longer need to pass the token
export const createRequest = createAsyncThunk('maintenance/create', async (requestData, thunkAPI) => {
    try { return await maintenanceService.createRequest(requestData); } 
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});
export const getTenantRequests = createAsyncThunk('maintenance/getTenantAll', async (_, thunkAPI) => {
    try { return await maintenanceService.getTenantRequests(); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});
export const getLandlordRequests = createAsyncThunk('maintenance/getLandlordAll', async (_, thunkAPI) => {
    try { return await maintenanceService.getLandlordRequests(); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});
export const updateRequest = createAsyncThunk('maintenance/update', async (requestData, thunkAPI) => {
    try { return await maintenanceService.updateRequest(requestData); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
});
export const deleteRequest = createAsyncThunk('maintenance/delete', async (id, thunkAPI) => {
    try { return await maintenanceService.deleteRequest(id); }
    catch (error) { return thunkAPI.rejectWithValue(getErrorMessage(error)); }
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
                const index = state.requests.findIndex(req => req._id === action.payload._id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
            })
            .addCase(updateRequest.rejected, (state, action) => {
                state.isError = true;
                state.message = action.payload;
            });
            
            // // Delete Request
            // .addCase(deleteRequest.pending, (state) => {
            //     state.isLoading = true;
            // })
            // .addCase(deleteRequest.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     state.isSuccess = true;
            //     state.requests = state.requests.filter((req) => req._id !== action.payload.id);
            // })
            // .addCase(deleteRequest.rejected, (state, action) => {
            //     state.isLoading = false;
            //     state.isError = true;
            //     state.message = action.payload;
            // });
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