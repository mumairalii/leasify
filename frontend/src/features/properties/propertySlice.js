import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from './propertyService.js';

const initialState = {
    properties: [],
    page: 1,
    totalPages: 1,
    totalProperties: 0,
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// The thunks no longer need to access the state for the token
export const getProperties = createAsyncThunk('properties/getAll', async (paginationArgs, thunkAPI) => {
    try {
        // Just call the service directly. The interceptor handles the token.
        return await propertyService.getProperties(paginationArgs);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
    try {
        return await propertyService.createProperty(propertyData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const updateProperty = createAsyncThunk('properties/update', async (propertyData, thunkAPI) => {
    try {
        return await propertyService.updateProperty(propertyData);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
    try {
        return await propertyService.deleteProperty(id);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const propertySlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.isSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProperties.pending, (state) => { state.isLoading = true; })
            .addCase(getProperties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.properties = action.payload.properties;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
                state.totalProperties = action.payload.totalProperties;
            })
            .addCase(getProperties.rejected, (state, action) => {
                state.isLoading = false; state.isError = true; state.message = action.payload;
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                // For simplicity, we can just refetch the current page to see the new property
                // This avoids complex logic for adding an item to a paginated list
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.properties = state.properties.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                );
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                // Refetching is also a good strategy after a delete
            });
    },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService';

// const initialState = {
//    properties: [],
//     page: 1,
//     totalPages: 1,
//     totalProperties: 0,
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     message: '',
// };

// // --- ASYNC THUNKS (Your versions are correct) ---
// // export const getProperties = createAsyncThunk('properties/getAll', async (_, thunkAPI) => {
// //     try {
// //         const token = thunkAPI.getState().auth.user.token;
// //         return await propertyService.getProperties(token);
// //     } catch (error) {
// //         const message = (error.response?.data?.message) || error.message || error.toString();
// //         return thunkAPI.rejectWithValue(message);
// //     }
// // });
// // 2. Update the getProperties thunk to accept pagination args
// export const getProperties = createAsyncThunk('properties/getAll', async (paginationArgs, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         // Pass the pagination arguments to the service
//         return await propertyService.getProperties(token, paginationArgs);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });
// export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.createProperty(propertyData, token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });
// export const updateProperty = createAsyncThunk('properties/update', async (propertyData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.updateProperty(propertyData, token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });
// export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.deleteProperty(id, token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });


// export const propertySlice = createSlice({
//     name: 'properties',
//     initialState,
//     reducers: {
//         // --- THIS IS THE CORRECTED RESET REDUCER ---
//         // It now only resets the status fields, leaving the data intact.
//         reset: (state) => {
//             state.isLoading = false;
//             state.isError = false;
//             state.isSuccess = false;
//             state.message = '';
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getProperties.pending, (state) => { state.isLoading = true; })
//             // 3. Update the fulfilled case to handle the new response object
//             .addCase(getProperties.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = action.payload.properties;
//                 state.page = action.payload.page;
//                 state.totalPages = action.payload.totalPages;
//                 state.totalProperties = action.payload.totalProperties;
//             })
//             .addCase(getProperties.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 state.properties.push(action.payload);
//             })
//             .addCase(updateProperty.fulfilled, (state, action) => {
//                 state.properties = state.properties.map((property) =>
//                     property._id === action.payload._id ? action.payload : property
//                 );
//             })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 state.properties = state.properties.filter(
//                     (property) => property._id !== action.payload.id
//                 );
//             });
//     },
// });

// export const { reset } = propertySlice.actions;
// export default propertySlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService';

// const initialState = {
//     properties: [],
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     message: '',
// };

// // Async thunk for getting properties
// export const getProperties = createAsyncThunk('properties/getAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.getProperties(token);
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// // Async thunk for creating a property
// export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.createProperty(propertyData, token);
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.deleteProperty(id, token);
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const propertySlice = createSlice({
//     name: 'properties',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getProperties.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getProperties.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = action.payload;
//             })
//             .addCase(getProperties.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             .addCase(createProperty.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties.push(action.payload);
//             })
//             .addCase(createProperty.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             }).addCase(deleteProperty.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 // This is the key logic: we create a new array that filters out
//                 // the property with the ID that was just deleted.
//                 state.properties = state.properties.filter(
//                     (property) => property._id !== action.payload.id
//                 );
//             })
//             .addCase(deleteProperty.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = propertySlice.actions;
// export default propertySlice.reducer;




// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService';

// const initialState = { properties: [], isLoading: false, isError: false, isSuccess: false, message: '' };

// // Thunks for each CRUD operation
// export const getProperties = createAsyncThunk('properties/getAll', async (_, thunkAPI) => {/*...*/});
// export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {/*...*/});
// export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {/*...*/});

// // --- ADD THIS NEW THUNK FOR UPDATING ---
// export const updateProperty = createAsyncThunk('properties/update', async (propertyData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.updateProperty(propertyData, token);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const propertySlice = createSlice({
//     name: 'properties',
//     initialState,
//     reducers: { reset: (state) => initialState },
//     extraReducers: (builder) => {
//         builder
//             // Get Properties Cases
//             .addCase(getProperties.pending, (state) => { state.isLoading = true; })
//             .addCase(getProperties.fulfilled, (state, action) => {
//                  console.log('STEP 2: "getProperties" fulfilled. API returned this payload:', action.payload);
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = action.payload;
//             })
//             .addCase(getProperties.rejected, (state, action) => { /* ... */ })
            
//             // Create Property Cases
//             .addCase(createProperty.pending, (state) => { state.isLoading = true; })
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties.push(action.payload);
//             })
//             .addCase(createProperty.rejected, (state, action) => { /* ... */ })

//             // --- ADD UPDATE PROPERTY CASES ---
//             .addCase(updateProperty.pending, (state) => { state.isLoading = true; })
//             .addCase(updateProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 // Find the property in the array and replace it with the updated one
//                 state.properties = state.properties.map((property) =>
//                     property._id === action.payload._id ? action.payload : property
//                 );
//             })
//             .addCase(updateProperty.rejected, (state, action) => { /* ... */ })

//             // Delete Property Cases
//             .addCase(deleteProperty.pending, (state) => { state.isLoading = true; })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = state.properties.filter(
//                     (property) => property._id !== action.payload.id
//                 );
//             })
//             .addCase(deleteProperty.rejected, (state, action) => { /* ... */ });
//     },
// });

// export const { reset } = propertySlice.actions;
// export default propertySlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService';

// const initialState = {
//     properties: [],
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     message: '',
// };

// // Async thunk for getting properties
// export const getProperties = createAsyncThunk('properties/getAll', async (_, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.getProperties(token);
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// // Async thunk for creating a property
// export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.createProperty(propertyData, token);
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
//     try {
//         const token = thunkAPI.getState().auth.user.token;
//         return await propertyService.deleteProperty(id, token);
//     } catch (error) {
//         const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const propertySlice = createSlice({
//     name: 'properties',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(getProperties.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getProperties.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = action.payload;
//             })
//             .addCase(getProperties.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             .addCase(createProperty.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties.push(action.payload);
//             })
//             .addCase(createProperty.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             }).addCase(deleteProperty.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 // This is the key logic: we create a new array that filters out
//                 // the property with the ID that was just deleted.
//                 state.properties = state.properties.filter(
//                     (property) => property._id !== action.payload.id
//                 );
//             })
//             .addCase(deleteProperty.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             });
//     },
// });

// export const { reset } = propertySlice.actions;
// export default propertySlice.reducer;