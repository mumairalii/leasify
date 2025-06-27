import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import propertyReducer from '../features/properties/propertySlice';
import leaseReducer from '../features/lease/leaseSlice';
import maintenanceReducer from '../features/maintenance/maintenanceSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice'
import taskReducer from '../features/tasks/taskSlice';
import tenantReducer from '../features/tenants/tenantSlice';
import paymentReducer from '../features/payments/paymentSlice';
// import invitationReducer from '../features/invitations/invitationSlice';
import logReducer from '../features/logs/logSlice';
import applicationReducer from '../features/applications/applicationSlice';
// import tenantReducer from '../features/tenants/tenantSlice'; // 1. Import new reducer

export const store = configureStore({
  reducer: {
    // The 'auth' key here is how we will access this state in our components
    auth: authReducer,
    properties: propertyReducer,
    lease: leaseReducer,
    maintenance: maintenanceReducer,
    dashboard: dashboardReducer,
    tasks: taskReducer,
    tenants: tenantReducer,
    payments: paymentReducer,
    logs: logReducer,
      applications: applicationReducer,
  },
});