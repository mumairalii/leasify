import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import Layouts
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";
// Import Components
import ProtectedRoute from "./components/ProtectedRoute";

// Import Pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LandlordDashboard from "./pages/LandLordDashboard";
import TenantDashboard from "./pages/TenantDashboard";
import LandLordMaintenancePage from "./pages/LandLordMaintenancePage";
import TenantMaintenancePage from "./pages/TenantMaintenancePage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import HomePage from "./pages/HomePage"; // Assuming you have this from our previous step
import LandLordPropertiesPage from "./pages/LandLordPropertiesPage";
import BrowsePropertiesPage from "./pages/BrowsePropertiesPage"; // <-- Import the new page
import AllTenantsPage from "./pages/AllTenantsPage";
import TenantDetailPage from "./pages/TenantDetailPage";
// import LandlordApplicationsPage from './pages/LandlordApplicationsPage'
import LogDisplayPage from "./pages/LogDisplayPage";
import LandlordApplicationsPage from "./pages/LandLordAplicationsPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import CommunicationLogPage from "./pages/CommunicationLogPage";
import EditPropertyPage from "./pages/EditPropertyPage";

function App() {
  return (
    <>
      <Router>
        <div className="font-sans">
          <Routes>
            {/* === Public Routes (No Layout) === */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/properties" element={<BrowsePropertiesPage />} />

            <Route path="/properties/:id" element={<PropertyDetailPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Landlord Routes */}
              <Route
                path="/landlord/dashboard"
                element={<LandlordDashboard />}
              />
              <Route
                path="/landlord/maintenance"
                element={<LandLordMaintenancePage />}
              />
              <Route
                path="/landlord/applications"
                element={<LandlordApplicationsPage />}
              />
              <Route path="/landlord/tenants" element={<AllTenantsPage />} />
              <Route
                path="/landlord/tenants/:tenantId"
                element={<TenantDetailPage />}
              />
              <Route
                path="landlord/properties/edit/:propertyId"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <EditPropertyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/logs/communications"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <CommunicationLogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/properties/new"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <AddPropertyPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/logs/system"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <LogDisplayPage
                      title="System Activity Logs"
                      filterType="System"
                    />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/properties"
                element={
                  <ProtectedRoute roles={["landlord"]}>
                    <LandLordPropertiesPage />
                  </ProtectedRoute>
                }
              />{" "}
              {/* 2. Add the new route here */}
              {/* Tenant Routes */}
              <Route path="/tenant/dashboard" element={<TenantDashboard />} />
              <Route
                path="/tenant/maintenance/new"
                element={<TenantMaintenancePage />}
              />
            </Route>
          </Routes>
        </div>
      </Router>
      {/* This container is for toast notifications */}
      <ToastContainer />
    </>
  );
}

export default App;
// import { useState } from 'react'
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import './App.css'
// import RegisterPage from './pages/RegisterPage';
// import LoginPage from './pages/LoginPage';
// import LandlordDashboard from './pages/LandLordDashboard';
// import TenantDashboard from './pages/TenantDashboard';
// import ProtectedRoute from './components/ProtectedRoute';
// import PropertyTestPage from './pages/PropertyTestPage';
// import TenantMaintenancePage from './pages/TenantMaintenancePage';
// import LandlordMaintenancePage from './pages/LandLordMaintenancePage';
// function App() {

//   return (
//     <>
//       <Router>
//       <div className="container mx-auto p-4"> {/* Added some basic padding */}
//         <Routes>
//           {/* Public Routes */}
//           <Route path="/register" element={<RegisterPage />} /> {/* <-- 2. ADD THE NEW ROUTE */}
//           <Route path="/login" element={<LoginPage />} />
//            {/* === Landlord Protected Routes === */}
//           <Route
//             path="/landlord/dashboard"
//             element={<ProtectedRoute><LandlordDashboard /></ProtectedRoute>}
//             />
//           <Route
//             path="/test-properties"
//             element={<ProtectedRoute><PropertyTestPage /></ProtectedRoute>}
//           />
//           <Route
//             path="/tenant/dashboard"
//             element={<ProtectedRoute><TenantDashboard /></ProtectedRoute>}
//             />
//             <Route
//           path="/tenant/maintenance"
//          element={<ProtectedRoute><TenantMaintenancePage /></ProtectedRoute>}

//             />
//             <Route
//           path="/landlord/maintenance"
//          element={<ProtectedRoute><LandlordMaintenancePage /></ProtectedRoute>}
//             />
//           {/* We will add private routes for the dashboards later */}
//         </Routes>
//       </div>
//     </Router>
//     </>
//   )
// }

// export default App
