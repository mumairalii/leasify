import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from './propertyService.js';

const initialState = {
    // State for the main "All Properties" page, which is paginated
    properties: [],
    page: 1,
    totalPages: 1,
    isLoading: false,
    selectedProperty: { // <-- NEW STATE FOR THE EDIT PAGE
        data: null,
        isLoading: true,
    },

    // --- Dedicated state for the dashboard's property list ---
    dashboardProperties: [],
    isDashboardLoading: false,
    
    isError: false,
    isSuccess: false,
    message: '',
};

// --- ASYNC THUNKS ---

// Thunk for the paginated "All Properties" page
export const getProperties = createAsyncThunk('properties/getAll', async (paginationArgs, thunkAPI) => {
    try {
        return await propertyService.getProperties(paginationArgs);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk specifically for the dashboard's "Recent Properties" list
export const fetchDashboardProperties = createAsyncThunk('properties/fetchDashboard', async (_, thunkAPI) => {
    try {
        // Call the service with the specific params for the dashboard's needs
        return await propertyService.getProperties({ sort: 'recent', limit: 4 });
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunks for CRUD operations
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

export const getPropertyById = createAsyncThunk('properties/getById', async (id, thunkAPI) => {
    try {
        return await propertyService.getPropertyById(id);
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
    try {
        await propertyService.deleteProperty(id);
        return id;
    } catch (error) {
        const message = (error.response?.data?.message) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});


// --- THE SLICE DEFINITION ---
export const propertySlice = createSlice({
    name: 'properties',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Cases for getProperties (All Properties Page)
            .addCase(getProperties.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProperties.fulfilled, (state, action) => {
                state.isLoading = false;
                state.properties = action.payload.properties;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getProperties.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })

            // Cases for fetchDashboardProperties
            .addCase(fetchDashboardProperties.pending, (state) => {
                state.isDashboardLoading = true;
            })
            .addCase(fetchDashboardProperties.fulfilled, (state, action) => {
                state.isDashboardLoading = false;
                state.dashboardProperties = action.payload.properties;
            })
            .addCase(fetchDashboardProperties.rejected, (state, action) => {
                state.isDashboardLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            
            // Cases for create, update, delete (you can add these as needed)
            .addCase(createProperty.fulfilled, (state, action) => {
                state.properties.unshift(action.payload);
                state.dashboardProperties.unshift(action.payload);
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.properties = state.properties.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                );
                state.dashboardProperties = state.dashboardProperties.map((p) =>
                    p._id === action.payload._id ? action.payload : p
                );
            })
            .addCase(deleteProperty.fulfilled, (state, action) => {
                state.properties = state.properties.filter((p) => p._id !== action.payload);
                state.dashboardProperties = state.dashboardProperties.filter((p) => p._id !== action.payload);
            })
            .addCase(getPropertyById.pending, (state) => {
        state.selectedProperty.isLoading = true;
    })
    .addCase(getPropertyById.fulfilled, (state, action) => {
        state.selectedProperty.isLoading = false;
        state.selectedProperty.data = action.payload;
    })
    .addCase(getPropertyById.rejected, (state, action) => {
        state.selectedProperty.isLoading = false;
        state.isError = true;
        state.message = action.payload;
    });
    },
});

export const { reset } = propertySlice.actions;
export default propertySlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService.js';

// const initialState = {
//     // State for the main "All Properties" page, which is paginated
//     properties: [],
//     page: 1,
//     totalPages: 1,
//     isLoading: false,
//     selectedProperty: { // <-- NEW STATE FOR THE EDIT PAGE
//         data: null,
//         isLoading: true,
//     },

//      publicProperties: [], // For the "Browse Properties" page
//     publicSelectedProperty: { // For the public "Property Detail" page
//         data: null,
//         isLoading: true,
//     },

//     // --- Dedicated state for the dashboard's property list ---
//     dashboardProperties: [],
//     isDashboardLoading: false,

//      recommendations: [],
//     isRecommendationsLoading: false,
    
//     isError: false,
//     isSuccess: false,
//     message: '',
// };

// // --- ASYNC THUNKS ---

// // Thunk for the paginated "All Properties" page
// export const getProperties = createAsyncThunk('properties/getAll', async (paginationArgs, thunkAPI) => {
//     try {
//         return await propertyService.getProperties(paginationArgs);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// // Thunk specifically for the dashboard's "Recent Properties" list
// export const fetchDashboardProperties = createAsyncThunk('properties/fetchDashboard', async (_, thunkAPI) => {
//     try {
//         // Call the service with the specific params for the dashboard's needs
//         return await propertyService.getProperties({ sort: 'recent', limit: 4 });
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// // Thunks for CRUD operations
// export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
//     try {
//         return await propertyService.createProperty(propertyData);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// // --- THIS IS THE NEW THUNK THAT FIXES THE ERROR ---
// export const getPublicPropertyById = createAsyncThunk('properties/getPublicById', async (propertyId, thunkAPI) => {
//     try {
//         // You will need a corresponding 'getPublicPropertyById' in your service file
//         return await propertyService.getPublicPropertyById(propertyId);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const updateProperty = createAsyncThunk('properties/update', async (propertyData, thunkAPI) => {
//     try {
//         return await propertyService.updateProperty(propertyData);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const getPropertyById = createAsyncThunk('properties/getById', async (id, thunkAPI) => {
//     try {
//         return await propertyService.getPropertyById(id);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });
// export const getRecommendedProperties = createAsyncThunk('properties/getRecommendations', async (propertyId, thunkAPI) => {
//     try {
//         // This function in your propertyService.js makes the API call.
//         return await propertyService.getRecommendedProperties(propertyId);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
//     try {
//         await propertyService.deleteProperty(id);
//         return id;
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });


// // --- THE SLICE DEFINITION ---
// export const propertySlice = createSlice({
//     name: 'properties',
//     initialState,
//     reducers: {
//         reset: (state) => initialState,
//     },
//     extraReducers: (builder) => {
//         builder
//             // Cases for getProperties (All Properties Page)
//             .addCase(getProperties.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getProperties.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.properties = action.payload.properties;
//                 state.page = action.payload.page;
//                 state.totalPages = action.payload.totalPages;
//             })
//             .addCase(getProperties.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })

//             // Cases for fetchDashboardProperties
//             .addCase(fetchDashboardProperties.pending, (state) => {
//                 state.isDashboardLoading = true;
//             })
//             .addCase(fetchDashboardProperties.fulfilled, (state, action) => {
//                 state.isDashboardLoading = false;
//                 state.dashboardProperties = action.payload.properties;
//             })
//             .addCase(fetchDashboardProperties.rejected, (state, action) => {
//                 state.isDashboardLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
            
//             // Cases for create, update, delete (you can add these as needed)
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 state.properties.unshift(action.payload);
//                 state.dashboardProperties.unshift(action.payload);
//             })
//             .addCase(updateProperty.fulfilled, (state, action) => {
//                 state.properties = state.properties.map((p) =>
//                     p._id === action.payload._id ? action.payload : p
//                 );
//                 state.dashboardProperties = state.dashboardProperties.map((p) =>
//                     p._id === action.payload._id ? action.payload : p
//                 );
//             })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 state.properties = state.properties.filter((p) => p._id !== action.payload);
//                 state.dashboardProperties = state.dashboardProperties.filter((p) => p._id !== action.payload);
//             })
//             .addCase(getPropertyById.pending, (state) => {
//         state.selectedProperty.isLoading = true;
//     })
//     .addCase(getPropertyById.fulfilled, (state, action) => {
//         state.selectedProperty.isLoading = false;
//         state.selectedProperty.data = action.payload;
//     })
//     .addCase(getPropertyById.rejected, (state, action) => {
//         state.selectedProperty.isLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//     })
//     .addCase(getPublicPropertyById.pending, (state) => {
//                 state.publicSelectedProperty.isLoading = true;
//             })
//             .addCase(getPublicPropertyById.fulfilled, (state, action) => {
//                 state.publicSelectedProperty.isLoading = false;
//                 state.publicSelectedProperty.data = action.payload;
//             })
//             .addCase(getPublicPropertyById.rejected, (state, action) => {
//                 state.publicSelectedProperty.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//      .addCase(getRecommendedProperties.pending, (state) => {
//         state.isRecommendationsLoading = true;
//     })
//     .addCase(getRecommendedProperties.fulfilled, (state, action) => {
//         state.isRecommendationsLoading = false;
//         state.recommendations = action.payload;
//     })
//     .addCase(getRecommendedProperties.rejected, (state, action) => {
//         state.isRecommendationsLoading = false;
//         state.isError = true;
//         state.message = action.payload;
//     });
//     },
// });

// export const { reset } = propertySlice.actions;
// export default propertySlice.reducer;
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService.js';

// const initialState = {
//     // State for the main "All Properties" page
//     properties: [],
//     page: 1,
//     totalPages: 1,
//     isLoading: false,

//     // --- NEW: Dedicated state for the dashboard's property list ---
//     dashboardProperties: [],
//     isDashboardLoading: false,
    
//     isError: false,
//     isSuccess: false,
//     message: '',
// };

// // --- THUNKS ---

// // Thunk for the "All Properties" page (remains mostly the same)
// export const getProperties = createAsyncThunk('properties/getAll', async (paginationArgs, thunkAPI) => {
//     try {
//         return await propertyService.getProperties(paginationArgs);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// // --- NEW: Thunk specifically for the dashboard's recent properties ---
// export const fetchDashboardProperties = createAsyncThunk('properties/fetchDashboard', async (_, thunkAPI) => {
//     try {
//         // Call the service with the specific params for the dashboard
//         return await propertyService.getProperties({ sort: 'recent', limit: 4 });
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });



// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService.js';

// const initialState = {
//     properties: [],
//     page: 1,
//     totalPages: 1,
//     totalProperties: 0,
//     recentProperties: [],
//     isRecentLoading: false,
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     message: '',
// };

// --- ASYNC THUNKS ---

// export const getProperties = createAsyncThunk('properties/getAll', async (paginationArgs, thunkAPI) => {
//     try {
//         return await propertyService.getProperties(paginationArgs);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
//     try {
//         return await propertyService.createProperty(propertyData);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const updateProperty = createAsyncThunk('properties/update', async (propertyData, thunkAPI) => {
//     try {
//         return await propertyService.updateProperty(propertyData);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
//     try {
//         await propertyService.deleteProperty(id);
//         return id; // Return the ID of the deleted property
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });




// // --- THE SLICE ---

// export const propertySlice = createSlice({
//     name: 'properties',
//     initialState,
//     reducers: {
//         reset: (state) => {
//             state.isLoading = false;
//             state.isError = false;
//             state.isSuccess = false;
//             state.message = '';
//             state.isRecentLoading = false;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             // Get Properties Cases
//             .addCase(getProperties.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(getProperties.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.properties = action.payload.properties;
//                 state.page = action.payload.page;
//                 state.totalPages = action.payload.totalPages;
//             })
//             .addCase(getProperties.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })

//             // --- NEW: Cases for fetchDashboardProperties ---
//             .addCase(fetchDashboardProperties.pending, (state) => {
//                 state.isDashboardLoading = true;
//             })
//             .addCase(fetchDashboardProperties.fulfilled, (state, action) => {
//                 state.isDashboardLoading = false;
//                 state.dashboardProperties = action.payload.properties;
//             })
//             .addCase(fetchDashboardProperties.rejected, (state, action) => {
//                 state.isDashboardLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             // Create Property Cases
//             .addCase(createProperty.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties.unshift(action.payload);
//             })
//             .addCase(createProperty.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             // Update Property Cases
//             .addCase(updateProperty.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(updateProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = state.properties.map((p) =>
//                     p._id === action.payload._id ? action.payload : p
//                 )
//             })
//             .addCase(updateProperty.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
//             // Delete Property Cases
//             .addCase(deleteProperty.pending, (state) => {
//                 state.isLoading = true;
//             })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = state.properties.filter((p) => p._id !== action.payload);
//             })
//             .addCase(deleteProperty.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.isError = true;
//                 state.message = action.payload;
//             })
            
// });

// export const { reset } = propertySlice.actions;
// export default propertySlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import propertyService from './propertyService.js';

// const initialState = {
//     properties: [],
//     page: 1,
//     totalPages: 1,
//     totalProperties: 0,
//     recentProperties: [],
//     isRecentLoading: false,
//     isLoading: false,
//     isError: false,
//     isSuccess: false,
//     message: '',
// };

// // The thunks no longer need to access the state for the token
// export const getProperties = createAsyncThunk('properties/getAll', async (paginationArgs, thunkAPI) => {
//     try {
//         // Just call the service directly. The interceptor handles the token.
//         return await propertyService.getProperties(paginationArgs);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const createProperty = createAsyncThunk('properties/create', async (propertyData, thunkAPI) => {
//     try {
//         return await propertyService.createProperty(propertyData);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const getRecentProperties = createAsyncThunk(
//     'properties/getRecent',
//     async (_, thunkAPI) => {
//         try {
//             return await propertyService.getRecentProperties();
//         } catch (error) {
//             const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//         }
//     }
// );

// export const updateProperty = createAsyncThunk('properties/update', async (propertyData, thunkAPI) => {
//     try {
//         return await propertyService.updateProperty(propertyData);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const deleteProperty = createAsyncThunk('properties/delete', async (id, thunkAPI) => {
//     try {
//         return await propertyService.deleteProperty(id);
//     } catch (error) {
//         const message = (error.response?.data?.message) || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

// export const propertySlice = createSlice({
//     name: 'properties',
//     initialState,
//     reducers: {
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
//             .addCase(getProperties.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.isSuccess = true;
//                 state.properties = action.payload.properties;
//                 state.page = action.payload.page;
//                 state.totalPages = action.payload.totalPages;
//                 state.totalProperties = action.payload.totalProperties;
//             })
//             .addCase(getProperties.rejected, (state, action) => {
//                 state.isLoading = false; state.isError = true; state.message = action.payload;
//             })
//             .addCase(createProperty.fulfilled, (state, action) => {
//                 // For simplicity, we can just refetch the current page to see the new property
//                 // This avoids complex logic for adding an item to a paginated list
//             })
//             .addCase(updateProperty.fulfilled, (state, action) => {
//                 state.properties = state.properties.map((p) =>
//                     p._id === action.payload._id ? action.payload : p
//                 );
//             })
//             .addCase(deleteProperty.fulfilled, (state, action) => {
//                 // Refetching is also a good strategy after a delete
//             })
//             .addCase(getRecentProperties.pending, (state) => {
//         state.isRecentLoading = true;
//     })
//     .addCase(getRecentProperties.fulfilled, (state, action) => {
//         state.isRecentLoading = false;
//         state.recentProperties = action.payload;
//     })
//     .addCase(getRecentProperties.rejected, (state, action) => {
//         state.isRecentLoading = false;
//         // ... handle error
//     });

//     },
// });

// export const { reset } = propertySlice.actions;
// export default propertySlice.reducer;

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