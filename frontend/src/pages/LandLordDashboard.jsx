/**
 * LandlordDashboard.jsx
 * This is the primary dashboard page for the landlord, designed as an actionable "Command Center".
 */
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner"; // Switched to sonner for consistency

// --- Redux Action Imports ---
import {
  getDashboardStats,
  reset as resetDashboard,
} from "../features/dashboard/dashboardSlice";
import { fetchDashboardProperties } from "../features/properties/propertySlice";
import { getOverdueTenants, getTenants } from "../features/tenants/tenantSlice";
import { getApplicationSummary } from "../features/applications/applicationSlice";
import {
  logOfflinePayment,
  reset as resetPayments,
} from "../features/payments/paymentSlice";
import {
  getLogs,
  createLog,
  reset as resetLogs,
} from "../features/logs/logSlice";

// --- UI & Icon Imports ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CircleDollarSign, UserCheck, Wrench, FileWarning } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// --- Custom Component Imports ---
import StatCard from "@/components/dashboard/StatCard";
import PropertyCard from "@/components/dashboard/PropertyCard";
import RentChart from "@/components/dashboard/RentChart";
import OccupancyChart from "@/components/dashboard/OccupancyChart";
import OverdueTenants from "@/components/dashboard/OverdueTenants";
import MaintenanceQueue from "@/components/dashboard/MaintenanceQueue";
import TaskList from "@/components/dashboard/TaskList";
import PendingApplications from "@/components/dashboard/PendingApplications";
import LogOfflinePaymentForm from "@/components/forms/LogOfflinePaymentForm";
import ActivityFeed from "@/components/dashboard/ActivityFeed";
import LogCommunicationForm from "@/components/forms/LogCommunicatonForm";
import UpcomingPayments from "@/components/dashboard/UpcomingPayments";
import ActionHub from "@/components/dashboard/ActionHub";

function LandlordDashboard() {
  const dispatch = useDispatch();

  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [selectedTenantForOffline, setSelectedTenantForOffline] =
    useState(null);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // --- Redux State Selectors ---
  const { user } = useSelector((state) => state.auth);
  const { stats, isLoading, isError, message } = useSelector(
    (state) => state.dashboard
  );
  const { dashboardProperties, isDashboardLoading } = useSelector(
    (state) => state.properties
  );
  const { allTenants } = useSelector((state) => state.tenants);
  const { properties } = useSelector((state) => state.properties); // Needed for LogCommunicationForm
  const { logs, isLoading: isLogLoading } = useSelector((state) => state.logs);
  const { isLoading: isPaymentLoading } = useSelector(
    (state) => state.payments
  );

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Fetch all essential dashboard data on component mount
    const fetchData = () => {
      dispatch(getDashboardStats());
      dispatch(getOverdueTenants());
      dispatch(getApplicationSummary());
      dispatch(fetchDashboardProperties());
      dispatch(getLogs());
      dispatch(getTenants());
    };
    fetchData();

    // Cleanup function to reset states on component unmount
    return () => {
      dispatch(resetDashboard());
      dispatch(resetPayments());
      dispatch(resetLogs());
    };
  }, [dispatch]);

  // --- Error Handling Effect ---
  useEffect(() => {
    if (isError) {
      toast.error("Dashboard Error", {
        description: message || "Failed to load dashboard data.",
      });
    }
  }, [isError, message]);

  // --- Handler Functions ---
  const handleLogSubmit = (logData) => {
    dispatch(createLog(logData))
      .unwrap()
      .then(() => {
        toast.success("Communication logged successfully!");
        setIsLogModalOpen(false);
      })
      .catch((err) =>
        toast.error("Failed to save log", { description: err.message })
      );
  };

  const handleOpenOfflinePaymentModal = (tenant) => {
    setSelectedTenantForOffline(tenant);
    setIsOfflineModalOpen(true);
  };

  const handleOfflinePaymentSubmit = (formData) => {
    const paymentData = {
      ...formData,
      leaseId: selectedTenantForOffline?.leaseId || formData.leaseId,
    };
    dispatch(logOfflinePayment(paymentData))
      .unwrap()
      .then(() => {
        toast.success("Offline payment logged successfully!");
        setIsOfflineModalOpen(false);
        setSelectedTenantForOffline(null);
        // Refresh data that would be affected by a new payment
        dispatch(getOverdueTenants());
        dispatch(getDashboardStats());
      })
      .catch((error) =>
        toast.error("Failed to log payment", { description: error.message })
      );
  };

  const dashboardTabs = [
    {
      id: "overdue",
      label: "Overdue",
      content: <OverdueTenants onLogPayment={handleOpenOfflinePaymentModal} />,
    },
    { id: "maintenance", label: "Maintenance", content: <MaintenanceQueue /> },
    {
      id: "applications",
      label: "Applications",
      content: <PendingApplications />,
    },
    { id: "tasks", label: "My Tasks", content: <TaskList /> },
    {
      id: "upcoming",
      label: "Upcoming",
      content: (
        <UpcomingPayments onLogPayment={handleOpenOfflinePaymentModal} />
      ),
    },
  ];

  // Destructure stats with default values to prevent errors
  const { kpis = {}, charts = {} } = stats || {};

  // --- SKELETON LOADER ---
  // Show a skeleton loader on the initial load for a better UX
  if (isLoading && !stats) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-1/3" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              onClick={() => handleOpenOfflinePaymentModal(null)}
            >
              Log Offline Payment
            </Button>
            <Button variant="outline" onClick={() => setIsLogModalOpen(true)}>
              Log Communication
            </Button>
            <Button asChild>
              <Link to="/landlord/properties/new">+ Add Property</Link>
            </Button>
          </div>
        </header>

        <main className="grid gap-8">
          {/* --- Key Performance Indicators --- */}
          <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Collected vs. Potential Rent"
              value={`$${(kpis.collectedThisMonth || 0).toLocaleString()}`}
              description={`of $${(
                kpis.potentialMonthlyRent || 0
              ).toLocaleString()}`}
              icon={CircleDollarSign}
              color="success"
              progress={
                kpis.potentialMonthlyRent
                  ? (kpis.collectedThisMonth / kpis.potentialMonthlyRent) * 100
                  : 0
              }
            />
            <StatCard
              title="Occupancy Rate"
              value={`${kpis.occupancyRate || 0}%`}
              description={`${kpis.vacantUnits || 0} vacant of ${
                kpis.totalUnits || 0
              }`}
              icon={UserCheck}
              color="info"
              progress={kpis.occupancyRate || 0}
            />
            <StatCard
              title="Open Maintenance"
              value={kpis.openMaintenanceCount || 0}
              description={`${
                kpis.recentlyCompletedMaintenance || 0
              } recently resolved`}
              icon={Wrench}
              color="destructive"
            />
            <StatCard
              title="Leases Expiring"
              value={kpis.leasesExpiringSoon || 0}
              description={`${kpis.recentlyRenewed || 0} recently renewed`}
              icon={FileWarning}
              color="warning"
            />
          </section>

          {/* --- Financial & Occupancy Charts --- */}
          <section className="grid gap-6 lg:grid-cols-2">
            <RentChart data={charts.rentCollection || []} />
            <OccupancyChart data={charts.occupancy || []} />
          </section>

          {/* --- Action Hub with Tabs --- */}
          <ActionHub tabs={dashboardTabs} defaultTab="overdue" />

          {/* --- Recent Properties Summary --- */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h2 className="text-2xl font-bold">Recent Properties</h2>
              <Button variant="outline" asChild>
                <Link to="/landlord/properties">View All Properties</Link>
              </Button>
            </div>
            {isDashboardLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardProperties.map((property) => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </div>
            )}
          </section>

          {/* --- Activity Feeds --- */}
          <section className="grid gap-6 md:grid-cols-2">
            <ActivityFeed
              variant="dashboard"
              title="Recent Communications"
              items={logs.filter((log) => log.type === "Communication")}
              limit={3}
              viewAllLink="/landlord/logs/communications"
            />
            <ActivityFeed
              variant="dashboard"
              title="System Activity Log"
              items={logs.filter((log) => log.type !== "Communication")}
              limit={3}
              viewAllLink="/landlord/logs/system"
            />
          </section>
        </main>
      </div>

      {/* --- Modals for Interactivity --- */}
      <Dialog open={isOfflineModalOpen} onOpenChange={setIsOfflineModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log Offline Payment</DialogTitle>
            <DialogDescription>
              Record a payment received outside of the app (e.g., cash, check).
            </DialogDescription>
          </DialogHeader>
          <LogOfflinePaymentForm
            tenant={selectedTenantForOffline}
            onSubmit={handleOfflinePaymentSubmit}
            onCancel={() => setIsOfflineModalOpen(false)}
            isLoading={isPaymentLoading}
            tenants={allTenants}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log a Communication</DialogTitle>
            <DialogDescription>
              Record an offline interaction with a tenant (e.g., phone call,
              text message).
            </DialogDescription>
          </DialogHeader>
          <LogCommunicationForm
            tenants={allTenants}
            properties={properties}
            onSubmit={handleLogSubmit}
            onCancel={() => setIsLogModalOpen(false)}
            isLoading={isLogLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default LandlordDashboard;

// /**
//  * LandlordDashboard.jsx
//  * This is the primary dashboard page for the landlord, designed as an actionable "Command Center".
//  */
// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// // --- Redux Action Imports ---
// import {
//   getDashboardStats,
//   reset as resetDashboard,
// } from "../features/dashboard/dashboardSlice";
// import { fetchDashboardProperties } from "../features/properties/propertySlice"; // Correct action for dashboard properties
// import { getOverdueTenants, getTenants } from "../features/tenants/tenantSlice";
// import { getApplicationSummary } from "../features/applications/applicationSlice";
// import {
//   logOfflinePayment,
//   reset as resetPayments,
// } from "../features/payments/paymentSlice";
// import {
//   getLogs,
//   createLog,
//   reset as resetLogs,
// } from "../features/logs/logSlice";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { CircleDollarSign, UserCheck, Wrench, FileWarning } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// // --- Custom Component Imports ---
// import StatCard from "@/components/dashboard/StatCard";
// import PropertyCard from "@/components/dashboard/PropertyCard";
// import RentChart from "@/components/dashboard/RentChart";
// import OccupancyChart from "@/components/dashboard/OccupancyChart";
// import OverdueTenants from "@/components/dashboard/OverdueTenants";
// import MaintenanceQueue from "@/components/dashboard/MaintenanceQueue";
// import TaskList from "@/components/dashboard/TaskList";
// import PendingApplications from "@/components/dashboard/PendingApplications";
// import LogOfflinePaymentForm from "@/components/forms/LogOfflinePaymentForm";
// import ActivityFeed from "@/components/dashboard/ActivityFeed";
// import LogCommunicationForm from "@/components/forms/LogCommunicatonForm";
// import UpcomingPayments from "@/components/dashboard/UpcomingPayments";
// import ActionHub from "@/components/dashboard/ActionHub";

// function LandlordDashboard() {
//   const dispatch = useDispatch();

//   // --- Component State for Modals ---
//   const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
//   const [selectedTenantForOffline, setSelectedTenantForOffline] =
//     useState(null);
//   const [isLogModalOpen, setIsLogModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   const { stats, isLoading, isError, message } = useSelector(
//     (state) => state.dashboard
//   );
//   const { dashboardProperties, isDashboardLoading } = useSelector(
//     (state) => state.properties
//   );
//   const { allTenants } = useSelector((state) => state.tenants); // For the communication log form
//   const { properties } = useSelector((state) => state.properties); // For the communication log form
//   const { logs, isLoading: isLogLoading } = useSelector((state) => state.logs);
//   const { isLoading: isPaymentLoading } = useSelector(
//     (state) => state.payments
//   );

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     // Dispatch all actions needed to populate the dashboard on load
//     dispatch(getDashboardStats());
//     dispatch(getOverdueTenants());
//     dispatch(getApplicationSummary());
//     dispatch(fetchDashboardProperties()); // CORRECTED: Use the correct action
//     dispatch(getLogs());
//     dispatch(getTenants()); // Needed for the log communication modal

//     return () => {
//       dispatch(resetDashboard());
//       dispatch(resetPayments());
//       dispatch(resetLogs());
//     };
//   }, [dispatch]);

//   useEffect(() => {
//     if (isError) {
//       toast.error(message || "Failed to load dashboard data.");
//     }
//   }, [isError, message]);

//   // --- Handler Functions ---
//   const handleLogSubmit = async (logData) => {
//     dispatch(createLog(logData))
//       .unwrap()
//       .then(() => {
//         toast.success("Communication logged!");
//         setIsLogModalOpen(false);
//         dispatch(getLogs());
//       })
//       .catch((err) => toast.error(err.message || "Failed to save log."));
//   };

//   const handleOpenOfflinePaymentModal = (tenant) => {
//     setSelectedTenantForOffline(tenant);
//     setIsOfflineModalOpen(true);
//   };

//   const handleCloseOfflinePaymentModal = () => {
//     setSelectedTenantForOffline(null);
//     setIsOfflineModalOpen(false);
//   };

//   const handleOfflinePaymentSubmit = async (formData) => {
//     const paymentData = {
//       ...formData,
//       leaseId: selectedTenantForOffline.leaseId,
//     };
//     try {
//       await dispatch(logOfflinePayment(paymentData)).unwrap();
//       toast.success("Offline payment logged!");
//       handleCloseOfflinePaymentModal();
//       // Refresh relevant data after logging a payment
//       dispatch(getOverdueTenants());
//       dispatch(getDashboardStats());
//     } catch (error) {
//       toast.error(error.message || "Failed to log payment.");
//     }
//   };

//   const dashboardTabs = [
//     {
//       id: "overdue",
//       label: "Overdue",
//       urgent: true,
//       content: <OverdueTenants onLogPayment={handleOpenOfflinePaymentModal} />,
//     },
//     {
//       id: "maintenance",
//       label: "Maintenance",
//       urgent: true,
//       content: <MaintenanceQueue />,
//     },
//     {
//       id: "applications",
//       label: "Applications",
//       urgent: false,
//       content: <PendingApplications />,
//     },
//     {
//       id: "tasks",
//       label: "My Tasks",
//       urgent: false,
//       content: <TaskList />,
//     },
//     {
//       id: "upcoming",
//       label: "Upcoming",
//       urgent: false,
//       content: (
//         <div className="space-y-6">
//           <UpcomingPayments onLogPayment={handleOpenOfflinePaymentModal} />
//         </div>
//       ),
//     },
//   ];

//   const { kpis = {}, charts = {} } = stats || {};

//   if (isLoading && !kpis.totalProperties) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Loading Your Dashboard...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-8 p-4 md:p-8">
//         <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//           <div>
//             <h1 className="text-3xl font-bold">Dashboard</h1>
//             <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//           </div>
//           {/* CORRECTED: Grouped action buttons together */}
//           <div className="flex flex-wrap items-center justify-start md:justify-end gap-2 w-full md:w-auto">
//             <Button
//               variant="outline"
//               onClick={() => handleOpenOfflinePaymentModal(null)}
//             >
//               Log Offline Payment
//             </Button>
//             <Button variant="outline" onClick={() => setIsLogModalOpen(true)}>
//               Log Communication
//             </Button>
//             <Button asChild>
//               <Link to="/landlord/properties/new">+ Add Property</Link>
//             </Button>
//           </div>
//         </header>

//         <main className="grid gap-8">
//           {/* --- ZONE A: Key Performance Indicators --- */}

//           {/* --- ZONE A: Key Performance Indicators --- */}
//           {/* --- ZONE A: Key Performance Indicators --- */}
//           {/* <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//             <StatCard
//               title="Collected vs. Potential Rent"
//               value={`$${kpis.collectedThisMonth?.toLocaleString() || 0}`}
//               description={`of $${
//                 kpis.potentialMonthlyRent?.toLocaleString() || 0
//               }`}
//               icon={CircleDollarSign}
//               color="success"
//               progress={
//                 (kpis.collectedThisMonth / kpis.potentialMonthlyRent) * 100
//               }
//             />
//             <StatCard
//               title="Occupancy Rate"
//               value={`${kpis.occupancyRate || 0}%`}
//               description={`${kpis.vacantUnits || 0} vacant of ${
//                 kpis.totalUnits || 0
//               }`}
//               icon={UserCheck}
//               color="info"
//               progress={kpis.occupancyRate}
//             />
//             <StatCard
//               title="Open Maintenance"
//               value={kpis.openMaintenanceCount || 0}
//               description={`${
//                 kpis.recentlyCompletedMaintenance || 0
//               } recently resolved`}
//               icon={Wrench}
//               color="destructive"
//             />
//             <StatCard
//               title="Leases Expiring"
//               value={kpis.leasesExpiringSoon || 0}
//               description={`${kpis.recentlyRenewed || 0} recently renewed`}
//               icon={FileWarning}
//               color="warning"
//             />
//           </section> */}

//           <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//             <StatCard
//               title="Collected vs. Potential Rent"
//               // --- FIX #2: Safe `toLocaleString` ---
//               // Default to 0 *before* calling toLocaleString.
//               value={`$${(kpis.collectedThisMonth || 0).toLocaleString()}`}
//               description={`of $${(
//                 kpis.potentialMonthlyRent || 0
//               ).toLocaleString()}`}
//               icon={CircleDollarSign}
//               color="success"
//               // --- FIX #3: Safe Division ---
//               // Check if potential rent is a non-zero number before dividing.
//               progress={
//                 kpis.potentialMonthlyRent
//                   ? (kpis.collectedThisMonth / kpis.potentialMonthlyRent) * 100
//                   : 0
//               }
//             />
//             <StatCard
//               title="Occupancy Rate"
//               // This card was already safe, no changes needed.
//               value={`${kpis.occupancyRate || 0}%`}
//               description={`${kpis.vacantUnits || 0} vacant of ${
//                 kpis.totalUnits || 0
//               }`}
//               icon={UserCheck}
//               color="info"
//               progress={kpis.occupancyRate || 0} // Add a fallback for progress just in case
//             />
//             <StatCard
//               title="Open Maintenance"
//               // This card was already safe, no changes needed.
//               value={kpis.openMaintenanceCount || 0}
//               description={`${
//                 kpis.recentlyCompletedMaintenance || 0
//               } recently resolved`}
//               icon={Wrench}
//               color="destructive"
//             />
//             <StatCard
//               title="Leases Expiring"
//               // This card was already safe, no changes needed.
//               value={kpis.leasesExpiringSoon || 0}
//               description={`${kpis.recentlyRenewed || 0} recently renewed`}
//               icon={FileWarning}
//               color="warning"
//             />
//           </section>

//           {/* --- ZONE B: Financial & Occupancy Charts --- */}
//           <section className="grid gap-6 lg:grid-cols-2">
//             <RentChart data={charts.rentCollection || []} />
//             <OccupancyChart data={charts.occupancy || []} />
//           </section>

//           <ActionHub tabs={dashboardTabs} defaultTab="overdue" />

//           {/* --- ZONE D: Recent Properties Summary --- */}
//           <section>
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
//               <h2 className="text-2xl font-bold">Recent Properties</h2>
//               <Button variant="outline" asChild>
//                 <Link to="/landlord/properties">View All Properties</Link>
//               </Button>
//             </div>
//             {isDashboardLoading ? (
//               <p className="text-muted-foreground">
//                 Loading recent properties...
//               </p>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {dashboardProperties.map((property) => (
//                   <PropertyCard key={property._id} property={property} />
//                 ))}
//               </div>
//             )}
//           </section>

//           <section className="grid gap-6 md:grid-cols-2">
//             <ActivityFeed
//               variant="dashboard"
//               title="Recent Communications"
//               items={logs.filter((log) => log.type === "Communication")}
//               limit={3}
//               viewAllLink="/landlord/logs/communications"
//             />
//             <ActivityFeed
//               variant="dashboard"
//               title="System Activity Log"
//               items={logs.filter((log) => log.type !== "Communication")}
//               limit={3}
//               viewAllLink="/landlord/logs/system"
//             />
//           </section>
//         </main>
//       </div>

//       {/* --- Modals for Interactivity --- */}
//       <Dialog open={isOfflineModalOpen} onOpenChange={setIsOfflineModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Log Offline Payment</DialogTitle>
//             <DialogDescription>
//               Record a payment received outside of the app.
//             </DialogDescription>
//           </DialogHeader>
//           <LogOfflinePaymentForm
//             tenant={selectedTenantForOffline}
//             onSubmit={handleOfflinePaymentSubmit}
//             onCancel={handleCloseOfflinePaymentModal}
//             isLoading={isPaymentLoading}
//           />
//         </DialogContent>
//       </Dialog>

//       <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Log a Communication</DialogTitle>
//             <DialogDescription>
//               Record an offline interaction.
//             </DialogDescription>
//           </DialogHeader>
//           {/* CORRECTED: Pass state variables as props */}
//           <LogCommunicationForm
//             tenants={allTenants}
//             properties={properties}
//             onSubmit={handleLogSubmit}
//             onCancel={() => setIsLogModalOpen(false)}
//             isLoading={isLogLoading}
//           />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default LandlordDashboard;
