import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// --- Redux Imports ---
import { getProperties, createProperty, updateProperty, deleteProperty, reset as resetProperties } from '../features/properties/propertySlice';
import { getDashboardStats, reset as resetDashboard } from '../features/dashboard/dashboardSlice';
import { getOverdueTenants, getTenants, reset as resetTenants } from '../features/tenants/tenantSlice';
import { logOfflinePayment, reset as resetPayments } from '../features/payments/paymentSlice';
import { assignLease, reset as resetLease } from '../features/lease/leaseSlice';
import { getLogs, createLog, reset as resetLogs } from '../features/logs/logSlice';

// --- UI & Icon Imports ---
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// --- Custom Component Imports ---
import StatCard from '@/components/dashboard/StatCard';
import PropertyCard from '@/components/dashboard/PropertyCard';
import PropertyForm from '@/components/forms/PropertyForm';
import OverdueTenants from '@/components/dashboard/OverdueTenants';
import MaintenanceQueue from '@/components/dashboard/MaintenanceQueue';
import TaskList from '@/components/dashboard/TaskList';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import AssignLeaseForm from '@/components/forms/AssignLeaseForm';
import LogCommunicationForm from '@/components/forms/LogCommunicatonForm';
import PaymentHistoryModal from '../components/modals/PaymentHistoryModal';
import LogOfflinePaymentForm from '@/components/forms/LogOfflinePaymentForm';

function LandlordDashboard() {
    // --- State for Modals ---
    const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
    const [isAssignLeaseModalOpen, setIsAssignLeaseModalOpen] = useState(false);
    const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [selectedLeaseId, setSelectedLeaseId] = useState(null);
    const [editingProperty, setEditingProperty] = useState(null);
    const [propertyToAssign, setPropertyToAssign] = useState(null);
    const [selectedTenantForOffline, setSelectedTenantForOffline] = useState(null);
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const dispatch = useDispatch();

    // --- Redux State Selectors ---
    const { user } = useSelector((state) => state.auth);
    const { properties, page, totalPages, isLoading: isPropertyLoading, isError: isPropertyError, message: propertyMessage } = useSelector((state) => state.properties);
    const { stats, isLoading: isDashboardLoading, isError: isStatsError, message: statsMessage } = useSelector((state) => state.dashboard);
    const { isLoading: isLeaseLoading } = useSelector((state) => state.lease);
    const { isLoading: isPaymentLoading } = useSelector((state) => state.payments);
    const { logs, isLoading: isLogLoading } = useSelector((state) => state.logs);
    const { allTenants } = useSelector((state) => state.tenants);

    // --- Data Fetching Effects ---
    useEffect(() => {
        if (user) {
            dispatch(getProperties({ page: 1 }));
            dispatch(getDashboardStats());
            dispatch(getOverdueTenants());
            dispatch(getLogs());
            dispatch(getTenants());
        }
        return () => {
            dispatch(resetProperties());
            dispatch(resetDashboard());
            dispatch(resetPayments());
            dispatch(resetTenants());
            dispatch(resetLease());
            dispatch(resetLogs());
        };
    }, [dispatch, user]);

    // Effect for handling toast notifications for errors
    useEffect(() => {
        if (isPropertyError) toast.error(propertyMessage);
        if (isStatsError) toast.error(statsMessage);
    }, [isPropertyError, propertyMessage, isStatsError, statsMessage]);

    // --- Event Handlers ---
    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages && newPage !== page) {
            dispatch(getProperties({ page: newPage }));
        }
    };
    
    const handleOpenCreateModal = () => { setEditingProperty(null); setIsPropertyModalOpen(true); };
    const handleOpenEditModal = (property) => { setEditingProperty(property); setIsPropertyModalOpen(true); };
    const handleClosePropertyModal = () => { setIsPropertyModalOpen(false); setEditingProperty(null); };
    const handleFormSubmit = async (propertyData) => { const action = editingProperty ? updateProperty({ _id: editingProperty._id, ...propertyData }) : createProperty(propertyData); try { await dispatch(action).unwrap(); toast.success(`Property ${editingProperty ? 'updated' : 'created'}!`); handleClosePropertyModal(); dispatch(getDashboardStats()); dispatch(getProperties({ page: 1 })); } catch (error) { toast.error(error.message || 'Failed to save property.'); }};
    const handleDelete = (propertyId) => { if (window.confirm('Are you sure?')) { dispatch(deleteProperty(propertyId)).unwrap().then(() => { toast.success('Property deleted.'); dispatch(getDashboardStats()); dispatch(getProperties({ page: 1 })); }).catch((error) => toast.error(error.message || 'Failed to delete property.')); } };
    const handleOpenAssignLeaseModal = (property) => { setPropertyToAssign(property); setIsAssignLeaseModalOpen(true); };
    const handleCloseAssignLeaseModal = () => { setPropertyToAssign(null); setIsAssignLeaseModalOpen(false); };
    const handleAssignLeaseSubmit = async (formData) => { const leaseData = { ...formData, propertyId: propertyToAssign._id }; try { await dispatch(assignLease(leaseData)).unwrap(); toast.success(`Lease assigned!`); handleCloseAssignLeaseModal(); dispatch(getDashboardStats()); dispatch(getProperties({ page })); } catch (error) { toast.error(error.message || 'Failed to assign lease.'); }};
    const handleOpenOfflinePaymentModal = (tenant) => { setSelectedTenantForOffline(tenant); setIsOfflineModalOpen(true); };
    const handleCloseOfflinePaymentModal = () => { setSelectedTenantForOffline(null); setIsOfflineModalOpen(false); };
    const handleOfflinePaymentSubmit = async (formData) => { const paymentData = { ...formData, leaseId: selectedTenantForOffline.leaseId }; try { await dispatch(logOfflinePayment(paymentData)).unwrap(); toast.success('Offline payment logged!'); handleCloseOfflinePaymentModal(); dispatch(getOverdueTenants()); dispatch(getDashboardStats()); } catch (error) { toast.error(error.message || 'Failed to log payment.'); }};
    const handleOpenLogModal = () => setIsLogModalOpen(true);
    const handleCloseLogModal = () => setIsLogModalOpen(false);
    const handleLogSubmit = async (logData) => { try { await dispatch(createLog(logData)).unwrap(); toast.success('Communication logged!'); handleCloseLogModal(); } catch (error) { toast.error(error.message || 'Failed to save log.'); }};
    const handleOpenHistoryModal = (leaseId) => { if (leaseId) { setSelectedLeaseId(leaseId); setIsHistoryModalOpen(true); }};
    const communicationLogs = useMemo(() => logs.filter(log => log.type === 'Communication'), [logs]);
    const systemLogs = useMemo(() => logs.filter(log => log.type !== 'Communication'), [logs]);

    if (isDashboardLoading && !stats) {
        return <div className="flex items-center justify-center h-screen"><p>Loading Dashboard...</p></div>;
    }

    return (
        <div className="space-y-8 p-4 md:p-8">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-muted-foreground">Welcome back, {user?.name}!</p></div>
                <div className="flex gap-2"><Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button><Button variant="outline" onClick={handleOpenLogModal}>Log Communication</Button><Button onClick={handleOpenCreateModal}>+ Add Property</Button></div>
            </header>

            <main className="grid gap-8">
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Properties" value={stats?.totalProperties || 0} description="Managed units" icon={Building2} />
                    <StatCard title="Total Rent (Monthly)" value={`$${stats?.totalMonthlyRent.toLocaleString() || 0}`} description="Across all properties" icon={CircleDollarSign} />
                    <StatCard title="Open Maintenance" value={stats?.openMaintenanceCount || 0} description={`${stats?.highPriorityMaintenance || 0} high priority`} icon={Wrench} color="destructive" />
                    <StatCard title="Occupancy" value={`${stats?.occupancyRate ?? 0}%`} description={`${stats?.vacantUnits || 0} vacant units`} icon={UserCheck} />
                </section>
                
                <section className="grid gap-6 lg:grid-cols-2">
                    <OverdueTenants onLogPayment={handleOpenOfflinePaymentModal} />
                    <MaintenanceQueue />
                </section>
                
                <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <ActivityFeed title="Recent Communications" items={communicationLogs} />
                    <TaskList />
                    <ActivityFeed title="System Activity Log" items={systemLogs} />
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-4">All Properties</h2>
                    {isPropertyLoading && properties.length === 0 ? (<p className="text-center text-muted-foreground">Loading properties...</p>) : properties.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map((property) => (<PropertyCard key={property._id} property={property} context="landlord" onEdit={handleOpenEditModal} onViewPayments={handleOpenHistoryModal} onDelete={handleDelete} onAssignLease={handleOpenAssignLeaseModal}/>))}
                            </div>
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <Button variant="outline" onClick={() => handlePageChange(page - 1)} disabled={page <= 1 || isPropertyLoading}>Previous</Button>
                                <span className="text-sm font-medium">Page {page} of {totalPages}</span>
                                <Button variant="outline" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages || isPropertyLoading}>Next</Button>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6"><p className="text-muted-foreground">You have not added any properties yet.</p><Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button></div>
                    )}
                </section>
            </main>

            <Dialog open={isPropertyModalOpen} onOpenChange={setIsPropertyModalOpen}><DialogContent><PropertyForm isEditing={!!editingProperty} initialData={editingProperty} onSubmit={handleFormSubmit} isLoading={isPropertyLoading} onCancel={handleClosePropertyModal}/></DialogContent></Dialog>
            <Dialog open={isAssignLeaseModalOpen} onOpenChange={setIsAssignLeaseModalOpen}><DialogContent><AssignLeaseForm property={propertyToAssign} onSubmit={handleAssignLeaseSubmit} onCancel={handleCloseAssignLeaseModal} isLoading={isLeaseLoading} /></DialogContent></Dialog>
            <Dialog open={isOfflineModalOpen} onOpenChange={setIsOfflineModalOpen}><DialogContent><DialogHeader><DialogTitle>Log Offline Payment</DialogTitle><DialogDescription>Record a payment received outside of the app.</DialogDescription></DialogHeader><LogOfflinePaymentForm tenant={selectedTenantForOffline} onSubmit={handleOfflinePaymentSubmit} onCancel={handleCloseOfflinePaymentModal} isLoading={isPaymentLoading} /></DialogContent></Dialog>
            <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}><DialogContent><DialogHeader><DialogTitle>Log a Communication</DialogTitle><DialogDescription>Record an offline interaction.</DialogDescription></DialogHeader><LogCommunicationForm onSubmit={handleLogSubmit} onCancel={handleCloseLogModal} isLoading={isLogLoading} tenants={allTenants} properties={properties} /></DialogContent></Dialog>
            <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}><DialogContent className="sm:max-w-lg"><PaymentHistoryModal leaseId={selectedLeaseId} /></DialogContent></Dialog>
        </div>
    );
}

export default LandlordDashboard;

// import React, { useState, useEffect, useMemo } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // --- Redux Imports ---
// // The getProperties thunk is now paginated
// import { getProperties, createProperty, updateProperty, deleteProperty, reset as resetProperties } from '../features/properties/propertySlice';
// import { getDashboardStats, reset as resetDashboard } from '../features/dashboard/dashboardSlice';
// import { getOverdueTenants, getTenants, reset as resetTenants } from '../features/tenants/tenantSlice';
// import { logOfflinePayment, reset as resetPayments } from '../features/payments/paymentSlice';
// import { assignLease, reset as resetLease } from '../features/lease/leaseSlice';
// import { getLogs, createLog, reset as resetLogs } from '../features/logs/logSlice';

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// // --- Custom Component Imports ---
// import StatCard from '@/components/dashboard/StatCard';
// import PropertyCard from '@/components/dashboard/PropertyCard';
// import PropertyForm from '@/components/forms/PropertyForm';
// import OverdueTenants from '@/components/dashboard/OverdueTenants';
// import MaintenanceQueue from '@/components/dashboard/MaintenanceQueue';
// import TaskList from '@/components/dashboard/TaskList';
// import ActivityFeed from '@/components/dashboard/ActivityFeed';
// import AssignLeaseForm from '@/components/forms/AssignLeaseForm';
// import LogCommunicationForm from '@/components/forms/LogCommunicatonForm';
// import PaymentHistoryModal from '../components/modals/PaymentHistoryModal';
// import LogOfflinePaymentForm from '@/components/forms/LogOfflinePaymentForm';

// function LandlordDashboard() {
//     // --- State for Modals (No changes here) ---
//     const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
//     const [isAssignLeaseModalOpen, setIsAssignLeaseModalOpen] = useState(false);
//     const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
//     const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
//     const [selectedLeaseId, setSelectedLeaseId] = useState(null);
//     const [editingProperty, setEditingProperty] = useState(null);
//     const [propertyToAssign, setPropertyToAssign] = useState(null);
//     const [selectedTenantForOffline, setSelectedTenantForOffline] = useState(null);
//     const [isLogModalOpen, setIsLogModalOpen] = useState(false);
//     const dispatch = useDispatch();

//     // --- Redux State Selectors ---
//     const { user } = useSelector((state) => state.auth);
//     // --- 1. GET NEW PAGINATION STATE FROM REDUX ---
//     const { properties, page, totalPages, isLoading: isPropertyLoading } = useSelector((state) => state.properties);
//     const { stats, isLoading: isDashboardLoading, isError, message } = useSelector((state) => state.dashboard);
//     const { isLoading: isLeaseLoading } = useSelector((state) => state.lease);
//     const { isLoading: isPaymentLoading } = useSelector((state) => state.payments);
//     const { logs, isLoading: isLogLoading } = useSelector((state) => state.logs);
//     const { allTenants } = useSelector((state) => state.tenants);

//     // --- Main Data Fetching Effect ---
//     // The main change here is that we no longer fetch properties in this useEffect.
//     // That will be handled by a separate effect tied to the page state.
//     useEffect(() => {
//         if (isError) toast.error(message);
//         if (user) {
//             dispatch(getDashboardStats());
//             dispatch(getOverdueTenants());
//             dispatch(getLogs());
//             dispatch(getTenants());
//         }
//         return () => {
//             dispatch(resetProperties());
//             dispatch(resetDashboard());
//             dispatch(resetPayments());
//             dispatch(resetTenants());
//             dispatch(resetLease());
//             dispatch(resetLogs());
//         };
//     }, [dispatch, user, isError, message]);

//     // --- 2. NEW EFFECT FOR FETCHING PAGINATED PROPERTIES ---
//     // This effect runs on initial load and whenever the 'page' in the Redux store changes.
//     useEffect(() => {
//         dispatch(getProperties({ page }));
//     }, [page, dispatch]);

//     // --- Handler for page changes ---
//     const handlePageChange = (newPage) => {
//         // We ensure the new page is within the valid range before dispatching
//         if (newPage > 0 && newPage <= totalPages) {
//             dispatch(getProperties({ page: newPage }));
//         }
//     };
    
//     // ... (All other handler functions for modals, forms, etc. remain exactly the same)
//     const handleOpenCreateModal = () => { setEditingProperty(null); setIsPropertyModalOpen(true); };
//     const handleOpenEditModal = (property) => { setEditingProperty(property); setIsPropertyModalOpen(true); };
//     const handleClosePropertyModal = () => { setIsPropertyModalOpen(false); setEditingProperty(null); };
//     const handleFormSubmit = async (propertyData) => { const action = editingProperty ? updateProperty({ _id: editingProperty._id, ...propertyData }) : createProperty(propertyData); try { await dispatch(action).unwrap(); toast.success(`Property ${editingProperty ? 'updated' : 'created'}!`); handleClosePropertyModal(); dispatch(getProperties({ page })); } catch (error) { toast.error(error.message || 'Failed to save property.'); }};
//     const handleDelete = (propertyId) => { if (window.confirm('Are you sure?')) { dispatch(deleteProperty(propertyId)).unwrap().then(() => { toast.success('Property deleted.'); dispatch(getProperties({ page })); }).catch((error) => toast.error(error.message || 'Failed to delete property.')); } };
//     const handleOpenAssignLeaseModal = (property) => { setPropertyToAssign(property); setIsAssignLeaseModalOpen(true); };
//     const handleCloseAssignLeaseModal = () => { setPropertyToAssign(null); setIsAssignLeaseModalOpen(false); };
//     const handleAssignLeaseSubmit = async (formData) => { const leaseData = { ...formData, propertyId: propertyToAssign._id }; try { await dispatch(assignLease(leaseData)).unwrap(); toast.success(`Lease assigned to ${propertyToAssign.address.street}!`); handleCloseAssignLeaseModal(); dispatch(getDashboardStats()); dispatch(getProperties({ page })); } catch (error) { toast.error(error.message || 'Failed to assign lease.'); }};
//     const handleOpenOfflinePaymentModal = (tenant) => { setSelectedTenantForOffline(tenant); setIsOfflineModalOpen(true); };
//     const handleCloseOfflinePaymentModal = () => { setSelectedTenantForOffline(null); setIsOfflineModalOpen(false); };
//     const handleOfflinePaymentSubmit = async (formData) => { const paymentData = { ...formData, leaseId: selectedTenantForOffline.leaseId }; try { await dispatch(logOfflinePayment(paymentData)).unwrap(); toast.success('Offline payment logged!'); handleCloseOfflinePaymentModal(); dispatch(getOverdueTenants()); dispatch(getDashboardStats()); } catch (error) { toast.error(error.message || 'Failed to log payment.'); }};
//     const handleOpenLogModal = () => setIsLogModalOpen(true);
//     const handleCloseLogModal = () => setIsLogModalOpen(false);
//     const handleLogSubmit = async (logData) => { try { await dispatch(createLog(logData)).unwrap(); toast.success('Communication logged!'); handleCloseLogModal(); } catch (error) { toast.error(error.message || 'Failed to save log.'); }};
//     const handleOpenHistoryModal = (leaseId) => { if (leaseId) { setSelectedLeaseId(leaseId); setIsHistoryModalOpen(true); }};
//     const communicationLogs = useMemo(() => logs.filter(log => log.type === 'Communication'), [logs]);
//     const systemLogs = useMemo(() => logs.filter(log => log.type !== 'Communication'), [logs]);

//     if (isDashboardLoading || !stats) {
//         return <div className="flex items-center justify-center h-screen"><p>Loading Dashboard...</p></div>;
//     }

//     return (
//         <div className="space-y-8 p-4 md:p-8">
//             <header className="flex flex-wrap justify-between items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button>
//                     <Button variant="outline" onClick={handleOpenLogModal}>Log Communication</Button>
//                     <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//                 </div>
//             </header>

//             <main className="grid gap-8">
//                 <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatCard title="Total Properties" value={stats.totalProperties} description="Managed units" icon={Building2} />
//                     <StatCard title="Total Rent (Monthly)" value={`$${stats.totalMonthlyRent.toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                     <StatCard title="Open Maintenance" value={stats.openMaintenanceCount} description={`${stats.highPriorityMaintenance || 0} high priority`} icon={Wrench} color="destructive" />
//                     <StatCard title="Occupancy" value={`${stats.occupancyRate ?? 0}%`} description={`${stats.vacantUnits} vacant units`} icon={UserCheck} />
//                 </section>
                
//                 <section className="grid gap-6 lg:grid-cols-2">
//                     <OverdueTenants onLogPayment={handleOpenOfflinePaymentModal} />
//                     <MaintenanceQueue />
//                 </section>
                
//                 <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     <ActivityFeed title="Recent Communications" items={communicationLogs} />
//                     <TaskList />
//                     <ActivityFeed title="System Activity Log" items={systemLogs} />
//                 </section>

//                 <section>
//                     <h2 className="text-xl font-semibold mb-4">All Properties</h2>
//                     {isPropertyLoading && properties.length === 0 ? (
//                         <p className="text-center text-muted-foreground">Loading properties...</p>
//                     ) : properties.length > 0 ? (
//                         <>
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {properties.map((property) => (
//                                     <PropertyCard 
//                                         key={property._id}
//                                         property={property}
//                                         context="landlord"
//                                         onEdit={handleOpenEditModal}
//                                         onViewPayments={handleOpenHistoryModal}
//                                         onDelete={handleDelete}
//                                         onAssignLease={handleOpenAssignLeaseModal}
//                                     />
//                                 ))}
//                             </div>

//                             {/* --- 3. PAGINATION CONTROLS UI --- */}
//                             <div className="flex items-center justify-center gap-4 mt-8">
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => handlePageChange(page - 1)}
//                                     disabled={page <= 1 || isPropertyLoading}
//                                 >
//                                     Previous
//                                 </Button>
//                                 <span className="text-sm font-medium">
//                                     Page {page} of {totalPages}
//                                 </span>
//                                 <Button
//                                     variant="outline"
//                                     onClick={() => handlePageChange(page + 1)}
//                                     disabled={page >= totalPages || isPropertyLoading}
//                                 >
//                                     Next
//                                 </Button>
//                             </div>
//                         </>
//                     ) : (
//                         <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                             <p className="text-muted-foreground">You have not added any properties yet.</p>
//                             <Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button>
//                         </div>
//                     )}
//                 </section>
//             </main>

//             {/* --- Modals Section (No changes here) --- */}
//             <Dialog open={isPropertyModalOpen} onOpenChange={setIsPropertyModalOpen}>
//                 <DialogContent><PropertyForm isEditing={!!editingProperty} initialData={editingProperty} onSubmit={handleFormSubmit} isLoading={isPropertyLoading} onCancel={handleClosePropertyModal}/></DialogContent>
//             </Dialog>
//             <Dialog open={isAssignLeaseModalOpen} onOpenChange={setIsAssignLeaseModalOpen}>
//                 <DialogContent><AssignLeaseForm property={propertyToAssign} onSubmit={handleAssignLeaseSubmit} onCancel={handleCloseAssignLeaseModal} isLoading={isLeaseLoading} /></DialogContent>
//             </Dialog>
//             <Dialog open={isOfflineModalOpen} onOpenChange={setIsOfflineModalOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>Log Offline Payment</DialogTitle><DialogDescription>Record a payment received outside of the app.</DialogDescription></DialogHeader>
//                     <LogOfflinePaymentForm tenant={selectedTenantForOffline} onSubmit={handleOfflinePaymentSubmit} onCancel={handleCloseOfflinePaymentModal} isLoading={isPaymentLoading} />
//                 </DialogContent>
//             </Dialog>
//             <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
//                 <DialogContent>
//                     <DialogHeader><DialogTitle>Log a Communication</DialogTitle><DialogDescription>Record an offline interaction.</DialogDescription></DialogHeader>
//                     <LogCommunicationForm onSubmit={handleLogSubmit} onCancel={handleCloseLogModal} isLoading={isLogLoading} tenants={allTenants} properties={properties} />
//                 </DialogContent>
//             </Dialog>
//             <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
//                 <DialogContent className="sm:max-w-lg"><PaymentHistoryModal leaseId={selectedLeaseId} /></DialogContent>
//             </Dialog>
//         </div>
//     );
// }

// export default LandlordDashboard;
// import React, { useState, useEffect, useMemo  } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // --- Redux Imports ---
// import { getProperties, createProperty, updateProperty, deleteProperty, reset as resetProperties } from '../features/properties/propertySlice';
// import { getDashboardStats, reset as resetDashboard } from '../features/dashboard/dashboardSlice';
// import { getOverdueTenants,getTenants, reset as resetTenants } from '../features/tenants/tenantSlice';
// import { logOfflinePayment, reset as resetPayments } from '../features/payments/paymentSlice';
// import { assignLease, reset as resetLease } from '../features/lease/leaseSlice';
// import { getLogs, createLog, reset as resetLogs } from '../features/logs/logSlice'; // Import log actions
// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// // --- Custom Component Imports ---
// // import StatCard from '../components/dashboard/StatCard';
// // import PropertyCard from '../components/dashboard/PropertyCard';
// // import PropertyForm from '../components/forms/PropertyForm';
// // import AssignLeaseForm from '../components/forms/AssignLeaseForm';
// // import LogOfflinePaymentForm from '../components/forms/LogOfflinePaymentForm';
// import LogOfflinePaymentForm from '../components/forms/LogOfflinePaymentForm';
// // import OverdueTenants from '../components/dashboard/OverdueTenants';
// // import MaintenanceQueue from '../components/dashboard/MaintenanceQueue';
// // import TaskList from '../components/dashboard/TaskList';
// // import ActivityFeed from '../components/dashboard/ActivityFeed';
// // import LogCommunicationForm from '../components/forms/LogCommunicationForm';
// import StatCard from '@/components/dashboard/StatCard';
// import PropertyCard from '@/components/dashboard/PropertyCard';
// import PropertyForm from '@/components/forms/PropertyForm';
// import OverdueTenants from '@/components/dashboard/OverdueTenants';
// import MaintenanceQueue from '@/components/dashboard/MaintenanceQueue';
// import TaskList from '@/components/dashboard/TaskList';
// import ActivityFeed from '@/components/dashboard/ActivityFeed';
// import AssignLeaseForm from '@/components/forms/AssignLeaseForm';
// import LogCommunicationForm from '@/components/forms/LogCommunicatonForm';
// import PaymentHistoryModal from '../components/modals/PaymentHistoryModal'; // Import the new modal
// // import PropertyCard from '../components/dashboard/PropertyCard';
// import SendInviteForm from '../components/forms/SendInviteForm';
// // --- Mock Data Import (for components not yet connected) ---
// import { communicationItems, systemActivityItems } from '../lib/mockData';

// function LandlordDashboard() {
//     // --- State for Modals ---
//     const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
//     // const [isAssignLeaseModalOpen, setIsAssignLeaseModalOpen] = useState(false);
//     const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
//     // --- NEW State for the payment history modal ---
//     const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
//     const [selectedLeaseId, setSelectedLeaseId] = useState(null);
//     // --- State for Data in Modals ---
//     const [editingProperty, setEditingProperty] = useState(null);
//     const [propertyToAssign, setPropertyToAssign] = useState(null);
//     const [selectedTenantForOffline, setSelectedTenantForOffline] = useState(null);
//     const [isLogModalOpen, setIsLogModalOpen] = useState(false); // New state for log modal
//  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
//     const [propertyToInvite, setPropertyToInvite] = useState(null);
//     const dispatch = useDispatch();


//     // --- Redux State Selectors ---

//     const { user } = useSelector((state) => state.auth);
//     const { properties, isLoading: isPropertyLoading } = useSelector((state) => state.properties);
//     const { stats, isLoading: isDashboardLoading, isError, message } = useSelector((state) => state.dashboard);
//     const { isLoading: isLeaseLoading } = useSelector((state) => state.lease);
//     const { isLoading: isPaymentLoading } = useSelector((state) => state.payments);
//     const { logs, isLoading: isLogLoading } = useSelector((state) => state.logs); // Get logs state
//     const { allTenants } = useSelector((state) => state.tenants);
//     // --- Main Data Fetching Effect ---
//     useEffect(() => {
//         if (isError) toast.error(message);
//         if (user) {
//             dispatch(getProperties());
//             dispatch(getDashboardStats());
//             dispatch(getOverdueTenants());
//             dispatch(getLogs());
//             dispatch(getTenants());
//         }
//         return () => {
//             dispatch(resetProperties());
//             dispatch(resetDashboard());
//             dispatch(resetPayments());
//             dispatch(resetTenants());
//             dispatch(resetLease());
//             dispatch(resetLogs());
//             dispatch(getLogs());
//         };
//     }, [dispatch, user, isError, message]);



//     // --- Filter logs for the different feeds ---
//     const communicationLogs = useMemo(() => 
//         logs.filter(log => log.type === 'Communication'), 
//     [logs]);
//     const systemLogs = useMemo(() => 
//         logs.filter(log => log.type !== 'Communication'), 
//     [logs]);
    

//     // --- Handler Functions for Property CRUD ---
//     const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsPropertyModalOpen(true);
//     };
//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsPropertyModalOpen(true);
//     };
    
//     const handleClosePropertyModal = () => {
//         setIsPropertyModalOpen(false);
//         setEditingProperty(null);
//     };
//     const handleFormSubmit = async (propertyData) => {
//         const actionToDispatch = editingProperty
//             ? updateProperty({ _id: editingProperty._id, ...propertyData })
//             : createProperty(propertyData);
        
//         try {
//             await dispatch(actionToDispatch).unwrap();
//             toast.success(`Property ${editingProperty ? 'updated' : 'created'} successfully!`);
//             handleClosePropertyModal();
//         } catch (error) {
//             toast.error(error.message || 'Failed to save property.');
//         }
//     };
//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId))
//                 .unwrap()
//                 .then(() => toast.success('Property deleted.'))
//                 .catch((error) => toast.error(error.message || 'Failed to delete property.'));
//         }
//     };

//     // --- Handler Functions for Assigning a Lease ---
//     const handleOpenAssignLeaseModal = (property) => {
//         setPropertyToAssign(property);
//         setIsAssignLeaseModalOpen(true);
//     };
//     const handleCloseAssignLeaseModal = () => {
//         setPropertyToAssign(null);
//         setIsAssignLeaseModalOpen(false);
//     };
//     const handleAssignLeaseSubmit = async (formData) => {
//         const leaseData = { ...formData, propertyId: propertyToAssign._id };
//         try {
//             await dispatch(assignLease(leaseData)).unwrap();
//             toast.success(`Lease successfully assigned to ${propertyToAssign.address.street}!`);
//             handleCloseAssignLeaseModal();
//             dispatch(getDashboardStats());
//             dispatch(getProperties());
//         } catch (error) {
//             toast.error(error.message || 'Failed to assign lease.');
//         }
//     };

//     // --- Handler Functions for Logging Offline Payment ---
//     const handleOpenOfflinePaymentModal = (tenant) => {
//         setSelectedTenantForOffline(tenant);
//         setIsOfflineModalOpen(true);
//     };
//     const handleCloseOfflinePaymentModal = () => {
//         setSelectedTenantForOffline(null);
//         setIsOfflineModalOpen(false);
//     };
//     const handleOfflinePaymentSubmit = async (formData) => {
//         const paymentData = { ...formData, leaseId: selectedTenantForOffline.leaseId };
//         try {
//             await dispatch(logOfflinePayment(paymentData)).unwrap();
//             toast.success('Offline payment logged successfully!');
//             handleCloseOfflinePaymentModal();
//             dispatch(getOverdueTenants());
//             dispatch(getDashboardStats());
//         } catch (error) {
//             toast.error(error.message || 'Failed to log payment.');
//         }
//     };
//     const handleOpenLogModal = () => setIsLogModalOpen(true);
//     const handleCloseLogModal = () => setIsLogModalOpen(false);

//     const handleLogSubmit = async (logData) => {
//         try {
//             await dispatch(createLog(logData)).unwrap();
//             toast.success('Communication logged successfully!');
//             handleCloseLogModal();
//         } catch (error) {
//             toast.error(error.message || 'Failed to save log.');
//         }
//     };

//     const handleOpenHistoryModal = (leaseId) => {
//         if (leaseId) {
//             setSelectedLeaseId(leaseId);
//             setIsHistoryModalOpen(true);
//         }
//     };
//     // --- Main Render Logic ---
//     if (isDashboardLoading || !stats) {
//         return <div className="flex items-center justify-center h-screen"><p>Loading Dashboard...</p></div>;
//     }

//     return (
//         <div className="space-y-8 p-4 md:p-8">
//             <header className="flex flex-wrap justify-between items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button>
                    
//                     {/* NEW BUTTON to open the log modal */}
//                     <Button variant="outline" onClick={handleOpenLogModal}>Log Communication</Button>
//                     <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//                 </div>
//             </header>

//             <main className="grid gap-8">
//                 <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatCard title="Total Properties" value={stats.totalProperties} description="Managed units" icon={Building2} />
//                     <StatCard title="Total Rent (Monthly)" value={`$${stats.totalMonthlyRent.toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                     <StatCard title="Open Maintenance" value={stats.openMaintenanceCount} description={`${stats.highPriorityMaintenance || 0} high priority`} icon={Wrench} color="destructive" />
//                     <StatCard title="Occupancy" value={`${stats.occupancyRate ?? 0}%`} description={`${stats.vacantUnits} vacant units`} icon={UserCheck} />
//                 </section>
                
//                 <section className="grid gap-6 lg:grid-cols-2">
//                     <OverdueTenants onLogPayment={handleOpenOfflinePaymentModal} />
//                     <MaintenanceQueue />
//                 </section>
                
//                 <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     {/* <ActivityFeed title="Recent Communications" items={communicationLogs} />
//                     <TaskList />
//                     <ActivityFeed title="System Activity Log" items={systemLogs} /> */}
//                     <ActivityFeed title="Recent Communications" items={communicationLogs} />
//   <TaskList />
//   <ActivityFeed title="System Activity Log" items={systemLogs} compact />
//                 </section>

//                 <section>
//                     <h2 className="text-xl font-semibold mb-4">All Properties</h2>
//                     {properties?.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {properties.map((property) => (
//                                 <PropertyCard 
//                                     key={property._id}
//                                     property={property}
//                                     context="landlord"
//                                     onEdit={handleOpenEditModal}
//                                     onViewPayments={handleOpenHistoryModal}
//                                     onDelete={handleDelete}
//                                     // onAssignLease={handleOpenAssignLeaseModal}
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                             <p className="text-muted-foreground">You have not added any properties yet.</p>
//                             <Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button>
//                         </div>
//                     )}
//                 </section>
//             </main>

//             {/* --- Modals Section --- */}
//             <Dialog open={isPropertyModalOpen} onOpenChange={setIsPropertyModalOpen}>
//                 <DialogContent>
//                     <PropertyForm isEditing={!!editingProperty} initialData={editingProperty} onSubmit={handleFormSubmit} isLoading={isPropertyLoading} onCancel={handleClosePropertyModal}/>
//                 </DialogContent>
//             </Dialog>
//             {/* <Dialog open={isAssignLeaseModalOpen} onOpenChange={setIsAssignLeaseModalOpen}>
//                 <DialogContent>
//                     <AssignLeaseForm property={propertyToAssign} onSubmit={handleAssignLeaseSubmit} onCancel={handleCloseAssignLeaseModal} isLoading={isLeaseLoading} />
//                 </DialogContent>
//             </Dialog> */}
//             <Dialog open={isOfflineModalOpen} onOpenChange={setIsOfflineModalOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Log Offline Payment</DialogTitle>
//                         <DialogDescription>Record a payment received outside of the app.</DialogDescription>
//                     </DialogHeader>
//                     <LogOfflinePaymentForm tenant={selectedTenantForOffline} onSubmit={handleOfflinePaymentSubmit} onCancel={handleCloseOfflinePaymentModal} isLoading={isPaymentLoading} />
//                 </DialogContent>
//             </Dialog>
//             <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Log a Communication</DialogTitle>
//                         <DialogDescription>Record an offline interaction like a phone call or text message.</DialogDescription>
//                     </DialogHeader>
//                     <LogCommunicationForm 
//                         onSubmit={handleLogSubmit}
//                         onCancel={handleCloseLogModal}
//                         isLoading={isLogLoading}
//                         tenants={allTenants} // Pass the list of all tenants
//                 properties={properties} // Pass the list of properties
//                     />
//                 </DialogContent>
//             </Dialog>
//              {/* --- NEW MODAL for Payment History --- */}
//             <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
//                 <DialogContent className="sm:max-w-lg">
//                     <PaymentHistoryModal leaseId={selectedLeaseId} />
//                 </DialogContent>
//             </Dialog>

            
//         </div>
//     );
// }

// export default LandlordDashboard;

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getProperties, createProperty, updateProperty, deleteProperty, reset as resetProperties } from '../features/properties/propertySlice';
// import { getDashboardStats, reset as resetDashboard } from '../features/dashboard/dashboardSlice'
// import { logOfflinePayment, reset as resetPayments } from '../features/payments/paymentSlice';
// import { getOverdueTenants, reset as resetTenants } from '../features/tenants/tenantSlice';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';
// // import { toast } from 'react-toastify';
// import { assignLease, reset as resetLease } from '../features/lease/leaseSlice'; // <-- ADD THIS LINE

// import LogOfflinePaymentForm from '../components/forms/LogOfflinePaymentForm';
// // Import all necessary UI and Icon components

// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import PaymentModal from '../components/modals/PaymentModal';
// import { Button } from "@/components/ui/button";

// import { Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";
// // import { Dialog, DialogContent } from "@/components/ui/dialog"; // Import Dialog for the modal
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Add imports

// // Import all of our custom dashboard components
// import StatCard from '../components/dashboard/StatCard';
// import PropertyCard from '../components/dashboard/PropertyCard';
// import PropertyForm from '../components/forms/PropertyForm';
// import OverdueTenants from '../components/dashboard/OverdueTenants';
// import MaintenanceQueue from '../components/dashboard/MaintenanceQueue';
// import TaskList from '../components/dashboard/TaskList';
// import ActivityFeed from '../components/dashboard/ActivityFeed';
// import AssignLeaseForm from '../components/forms/AssignLeaseForm'; // Import the new form


// // Import our mock data for the UI components that are not yet connected
// import { communicationItems, systemActivityItems, mockTasks } from '../lib/mockData';

// function LandlordDashboard() {
//     // --- State and Redux Hooks ---
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProperty, setEditingProperty] = useState(null);

//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);
//     const { properties } = useSelector((state) => state.properties);
//     const { stats, isLoading, isError, message } = useSelector((state) => state.dashboard);
//     // --- ADD THIS LINE HERE ---
//     const { isLoading: isLeaseLoading } = useSelector((state) => state.lease);
//     const [isAssignLeaseModalOpen, setIsAssignLeaseModalOpen] = useState(false);
//     const [propertyToAssign, setPropertyToAssign] = useState(null);

//      const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//     const [selectedTenant, setSelectedTenant] = useState(null);

//     const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
//     const [selectedTenantForOffline, setSelectedTenantForOffline] = useState(null);


//     // --- Data Fetching Effect ---
//     useEffect(() => {
//         if (isError) {
//             toast.error(message);
//         }
//         if (user) {
//             // Dispatch actions to get all necessary data for the dashboard
//             dispatch(getProperties());
//             dispatch(getDashboardStats());
//         }
//         return () => {
//             // Reset both slices on component unmount to prevent stale data
//             dispatch(resetProperties());
//             dispatch(resetDashboard());
//         };
//     }, [user, isError, message, dispatch]);

//     // --- Handler Functions for Properties ---
//     const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsModalOpen(true);
//     };

//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingProperty(null);
//     };

//     const handleFormSubmit = async (propertyData) => {
//         try {
//             if (editingProperty) {
//                 await dispatch(updateProperty({ _id: editingProperty._id, ...propertyData })).unwrap();
//                 toast.success('Property updated successfully!');
//             } else {
//                 await dispatch(createProperty(propertyData)).unwrap();
//                 toast.success('Property created successfully!');
//             }
//             handleCloseModal();
//         } catch (error) {
//             toast.error(error.message || 'Failed to save property.');
//         }
//     };

//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId))
//               .unwrap()
//               .then(() => toast.success('Property deleted.'))
//               .catch((error) => toast.error(error.message || 'Failed to delete property.'));
//         }
//     };

//      const handleOpenAssignLeaseModal = (property) => {
//         setPropertyToAssign(property);
//         setIsAssignLeaseModalOpen(true);
//     };

//     const handleCloseAssignLeaseModal = () => {
//         setPropertyToAssign(null);
//         setIsAssignLeaseModalOpen(false);
//     };

//     // const handleAssignLeaseSubmit = async (formData) => {
//     //     const leaseData = {
//     //         ...formData,
//     //         propertyId: propertyToAssign._id,
//     //     };
//     //     try {
//     //         await dispatch(assignLease(leaseData)).unwrap();
//     //         toast.success('Lease assigned successfully!');
//     //         handleCloseAssignLeaseModal();
//     //         // Optionally, refetch stats to update occupancy rate
//     //         dispatch(getDashboardStats());
//     //     } catch (error) {
//     //         toast.error(error.message || 'Failed to assign lease.');
//     //     }
//     // };

//     const handleAssignLeaseSubmit = async (formData) => {
//     const leaseData = { ...formData, propertyId: propertyToAssign._id };
//     try {
//         await dispatch(assignLease(leaseData)).unwrap();
//         toast.success(`Lease successfully assigned to ${propertyToAssign.address.street}!`);
//         handleCloseAssignLeaseModal();

//         // --- THIS IS THE KEY ---
//         // We re-fetch both the stats AND the properties list to get the new statuses
//         dispatch(getDashboardStats());
//         dispatch(getProperties()); 

//     } catch (error) {
//         toast.error(error.message || 'Failed to assign lease.');
//     }
// };

//     const handleOpenPaymentModal = (tenant) => {
//         setSelectedTenant(tenant);
//         setIsPaymentModalOpen(true);
//     };

//     const handleClosePaymentModal = () => {
//         setIsPaymentModalOpen(false);
//         setSelectedTenant(null);
//     };

//     const handlePaymentSuccess = (paymentIntent) => {
//         console.log('Payment succeeded!', paymentIntent);
//         handleClosePaymentModal();
//         // Here we would dispatch actions to log the payment in our DB and refresh data
//         // For now, we just close the modal.
//     };


//     const handleOpenOfflinePaymentModal = (tenant) => {
//         setSelectedTenantForOffline(tenant);
//         setIsOfflineModalOpen(true);
//     };

//     const handleCloseOfflinePaymentModal = () => {
//         setSelectedTenantForOffline(null);
//         setIsOfflineModalOpen(false);
//     };

//     const handleOfflinePaymentSubmit = async (formData) => {
//         const paymentData = {
//             ...formData,
//             leaseId: selectedTenantForOffline.leaseId,
//         };
//         try {
//             await dispatch(logOfflinePayment(paymentData)).unwrap();
//             toast.success('Offline payment logged successfully!');
//             handleCloseOfflinePaymentModal();
//             // Refresh dashboard data to show tenant is no longer overdue
//             dispatch(getOverdueTenants());
//             dispatch(getDashboardStats());
//         } catch (error) {
//             toast.error(error.message || 'Failed to log payment.');
//         }
//     };
//     // Show a loading state while fetching initial dashboard data
//     if (isLoading || !stats) {
//         return <div className="text-center p-10">Loading Dashboard...</div>;
//     }

//     return (
//         <div className="space-y-8">
//             {/* Header Section */}
//             <div className="flex flex-wrap justify-between items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button>
//                     <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//                 </div>
//             </div>

//             <main className="grid gap-8">
//                 {/* Phase 1: Stats Section with Live Data */}
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatCard title="Total Properties" value={stats.totalProperties} description="Managed units" icon={Building2} />
//                     <StatCard title="Total Rent (Monthly)" value={`$${stats.totalMonthlyRent.toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                     <StatCard title="Open Maintenance" value={stats.openMaintenanceCount} description="1 high priority" icon={Wrench} color="destructive" />
//                     <StatCard 
//     title="Occupancy" 
//     value={`${stats.occupancyRate ?? 0}%`} 
//     description={`${stats.vacantUnits} vacant units`} 
//     icon={UserCheck} 
// />
//                 </div>

//                 {/* Phase 2: Actionable Summaries (with mock data) */}
//                 <div className="grid gap-6 lg:grid-cols-2">
//                     <OverdueTenants onLogPayment={handleOpenOfflinePaymentModal} />
//                     <MaintenanceQueue />
//                 </div>

                
//                 {/* Phase 3: Activity Feeds (with mock data) */}
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     <ActivityFeed title="Recent Communications" items={communicationItems} />
//                     <TaskList tasks={mockTasks} />
//                     <ActivityFeed title="System Activity Log" items={systemActivityItems} />
//                 </div>

//                 {/* Core Functionality: The Full List of All Properties */}
//                 <section>
//                     <h2 className="text-xl font-semibold mb-4">All Properties</h2>
//                     {properties && properties.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {properties.map((property) => (
//                                 <PropertyCard 
//                                     key={property._id}
//                                     property={property}
//                                     onEdit={handleOpenEditModal}
//                                     onDelete={handleDelete}
//                                     onAssignLease={handleOpenAssignLeaseModal}
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                             <p className="text-muted-foreground">You have not added any properties yet.</p>
//                             <Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button>
//                         </div>
//                     )}
//                 </section>
//             </main>

//             {/* Modal for creating/editing properties */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
//                     <div className="bg-card p-6 rounded-lg shadow-2xl w-full max-w-lg">
//                         <PropertyForm
//                             isEditing={!!editingProperty}
//                             initialData={editingProperty}
//                             onSubmit={handleFormSubmit}
//                             isLoading={isLoading}
//                             onCancel={handleCloseModal}
//                         />
//                     </div>
//                 </div>
//             )}

//             <Dialog open={isAssignLeaseModalOpen} onOpenChange={setIsAssignLeaseModalOpen}>
//     <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//             <DialogTitle>Assign Lease</DialogTitle>
//             <DialogDescription>
//                 Assign a new lease to property: <span className="font-semibold text-foreground">{propertyToAssign?.address.street}</span>
//             </DialogDescription>
//         </DialogHeader>
//         <AssignLeaseForm
//             property={propertyToAssign}
//             onSubmit={handleAssignLeaseSubmit}
//             onCancel={handleCloseAssignLeaseModal}
//             isLoading={isLeaseLoading}
//         />
//     </DialogContent>
// </Dialog>{/* <Dialog open={isAssignLeaseModalOpen} onOpenChange={setIsAssignLeaseModalOpen}>
//         <DialogContent>
//             <AssignLeaseForm
//                 property={propertyToAssign}
//                 onSubmit={handleAssignLeaseSubmit}
//                 onCancel={handleCloseAssignLeaseModal}
//                 isLoading={isLeaseLoading}
//             />
//         </DialogContent>
//     </Dialog> */}

//     {/* <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Log Rent Payment</DialogTitle>
//                         <DialogDescription>
//                             {`Processing payment for ${selectedTenant?.name} (Unit ${selectedTenant?.unit})`}
//                         </DialogDescription>
//                     </DialogHeader>
//                     {selectedTenant && (
//                         <PaymentModal 
//                             amount={selectedTenant.amount}
//                             onPaymentSuccess={handlePaymentSuccess}
//                         />
//                     )}
//                 </DialogContent>
//             </Dialog> */}

//             <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//     <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//             <DialogTitle>Log Rent Payment</DialogTitle>
//             <DialogDescription>
//                 {/* Check if a tenant is selected before trying to access properties */}
//                 {selectedTenant && `Processing payment for ${selectedTenant.name} (Unit ${selectedTenant.unit})`}
//             </DialogDescription>
//         </DialogHeader>
//         {selectedTenant && (
//             <PaymentModal 
//                 amount={selectedTenant.amount}
//                 leaseId={selectedTenant.leaseId} // Pass the leaseId as a prop
//                 onPaymentSuccess={handlePaymentSuccess}
//             />
//         )}
//     </DialogContent>
// </Dialog>

// <Dialog open={isOfflineModalOpen} onOpenChange={setIsOfflineModalOpen}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Log Offline Payment</DialogTitle>
//                         <DialogDescription>
//                             Record a payment received outside of the app (e.g., cash, check).
//                         </DialogDescription>
//                     </DialogHeader>
//                     <LogOfflinePaymentForm
//                         tenant={selectedTenantForOffline}
//                         onSubmit={handleOfflinePaymentSubmit}
//                         onCancel={handleCloseOfflinePaymentModal}
//                         isLoading={isPaymentLoading}
//                     />
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }

// export default LandlordDashboard;












// src/pages/LandLordDashboard.jsx



// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getProperties, createProperty, updateProperty, deleteProperty, reset } from '../features/properties/propertySlice';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // Import all necessary UI and Icon components
// import { Button } from "@/components/ui/button";
// import { Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// // Import all of our custom dashboard components
// import StatCard from '../components/dashboard/StatCard';
// import PropertyCard from '../components/dashboard/PropertyCard';
// import PropertyForm from '../components/forms/PropertyForm';
// import OverdueTenants from '../components/dashboard/OverdueTenants';
// import MaintenanceQueue from '../components/dashboard/MaintenanceQueue';
// import TaskList from '../components/dashboard/TaskList';
// import ActivityFeed from '../components/dashboard/ActivityFeed';

// // Import our mock data
// import { communicationItems, systemActivityItems, mockTasks } from '../lib/mockData';

// function LandlordDashboard() {
//     // --- State and Redux Hooks ---
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProperty, setEditingProperty] = useState(null);

//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);
//     const { properties, isLoading, isError, message } = useSelector((state) => state.properties);


    
//     // --- Data Fetching Effect ---
//     useEffect(() => {
//         if (isError) toast.error(message || 'An error occurred.');
//         if (user) dispatch(getProperties());
//         return () => { dispatch(reset()); };
//     }, [user, isError, message, dispatch]);

//     // --- Handler Functions for Properties ---
//     const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsModalOpen(true);
//     };

//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingProperty(null);
//     };

//     const handleFormSubmit = async (propertyData) => {
//         try {
//             if (editingProperty) {
//                 await dispatch(updateProperty({ _id: editingProperty._id, ...propertyData })).unwrap();
//                 toast.success('Property updated successfully!');
//             } else {
//                 await dispatch(createProperty(propertyData)).unwrap();
//                 toast.success('Property created successfully!');
//             }
//             handleCloseModal();
//         } catch (error) {
//             toast.error(error.message || 'Failed to save property.');
//         }
//     };

//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId))
//               .unwrap()
//               .then(() => toast.success('Property deleted.'))
//               .catch((error) => toast.error(error.message || 'Failed to delete property.'));
//         }
//     };

//     if (isLoading && (!properties || properties.length === 0)) {
//         return <div className="text-center p-10">Loading Dashboard...</div>;
//     }

//     return (
//         <div className="space-y-8">
//             {/* Header Section */}
//             <div className="flex flex-wrap justify-between items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button>
//                     <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//                 </div>
//             </div>

//             <main className="grid gap-8">
//                 {/* Phase 1: Stats Section */}
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatCard title="Total Properties" value={properties.length} description="Managed units" icon={Building2} />
//                     <StatCard title="Total Rent (Monthly)" value={`$${properties.reduce((acc, p) => acc + p.rentAmount, 0).toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                     <StatCard title="Open Maintenance" value="3" description="1 high priority" icon={Wrench} color="destructive" />
//                     <StatCard title="Occupancy" value="95%" description="2 vacant units" icon={UserCheck} />
//                 </div>

//                 {/* Phase 2: Actionable Summaries */}
//                 <div className="grid gap-6 lg:grid-cols-2">
//                     <OverdueTenants />
//                     <MaintenanceQueue />
//                 </div>
                
//                 {/* Phase 3: Activity Feeds */}
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     <ActivityFeed title="Recent Communications" items={communicationItems} />
//                     <TaskList tasks={mockTasks} />
//                     <ActivityFeed title="System Activity Log" items={systemActivityItems} />
//                 </div>

//                 {/* --- Core Functionality: The Full List of All Properties --- */}
//                 <section>
//                     <h2 className="text-xl font-semibold mb-4">All Properties</h2>
//                     {properties && properties.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {properties.map((property) => (
//                                 <PropertyCard 
//                                     key={property._id}
//                                     property={property}
//                                     onEdit={handleOpenEditModal}
//                                     onDelete={handleDelete}
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                             <p className="text-muted-foreground">You have not added any properties yet.</p>
//                             <Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button>
//                         </div>
//                     )}
//                 </section>
//             </main>

//             {/* Modal for creating/editing properties */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
//                     <div className="bg-card p-6 rounded-lg shadow-2xl w-full max-w-lg">
//                         <PropertyForm
//                             isEditing={!!editingProperty}
//                             initialData={editingProperty}
//                             onSubmit={handleFormSubmit}
//                             isLoading={isLoading}
//                             onCancel={handleCloseModal}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default LandlordDashboard;

// // src/pages/LandLordDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getProperties, createProperty, updateProperty, deleteProperty, reset } from '../features/properties/propertySlice';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // Import all necessary UI and Icon components
// import { Button } from "@/components/ui/button";
// import { Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// // Import all of our custom dashboard components
// import StatCard from '../components/dashboard/StatCard';
// import PropertyCard from '../components/dashboard/PropertyCard';
// import PropertyForm from '../components/forms/PropertyForm';
// import OverdueTenants from '../components/dashboard/OverdueTenants';
// import MaintenanceQueue from '../components/dashboard/MaintenanceQueue';
// import TaskList from '../components/dashboard/TaskList';
// import ActivityFeed from '../components/dashboard/ActivityFeed';

// // Import our mock data
// import { communicationItems, systemActivityItems, mockTasks } from '../lib/mockData';

// function LandlordDashboard() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProperty, setEditingProperty] = useState(null);

//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);
//     const { properties, isLoading, isError, message } = useSelector((state) => state.properties);

//     useEffect(() => {
//         if (isError) {
//             toast.error(message || 'An error occurred.');
//         }
//         if (user) {
//             dispatch(getProperties());
//         }
//         return () => {
//             dispatch(reset());
//         };
//     }, [user, isError, message, dispatch]);

//     // --- All handler functions are complete and functional ---
//     const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsModalOpen(true);
//     };

//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingProperty(null);
//     };

//     const handleFormSubmit = async (propertyData) => {
//         try {
//             if (editingProperty) {
//                 await dispatch(updateProperty({ _id: editingProperty._id, ...propertyData })).unwrap();
//                 toast.success('Property updated successfully!');
//             } else {
//                 await dispatch(createProperty(propertyData)).unwrap();
//                 toast.success('Property created successfully!');
//             }
//             handleCloseModal();
//         } catch (error) {
//             toast.error(error.message || 'Failed to save property.');
//         }
//     };

//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId))
//                 .unwrap()
//                 .then(() => toast.success('Property deleted.'))
//                 .catch((error) => toast.error(error.message || 'Failed to delete property.'));
//         }
//     };

//     if (isLoading && (!properties || properties.length === 0)) {
//         return <div className="text-center p-10">Loading Dashboard...</div>;
//     }

//     return (
//         <div className="space-y-8">
//             {/* Header Section */}
//             <div className="flex flex-wrap justify-between items-center gap-4">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button>
//                     <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//                 </div>
//             </div>

//             <main className="grid gap-8">
//                 {/* Phase 1: Stats Section */}
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatCard title="Total Properties" value={properties.length} description="Managed units" icon={Building2} />
//                     <StatCard title="Total Rent (Monthly)" value={`$${properties.reduce((acc, p) => acc + p.rentAmount, 0).toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                     <StatCard title="Open Maintenance" value="3" description="1 high priority" icon={Wrench} color="destructive" />
//                     <StatCard title="Occupancy" value="95%" description="2 vacant units" icon={UserCheck} />
//                 </div>

//                 {/* Phase 2: Actionable Summaries */}
//                 <div className="grid gap-6 lg:grid-cols-2">
//                     <OverdueTenants />
//                     <MaintenanceQueue />
//                 </div>
                
//                 {/* Phase 3: Activity Feeds */}
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     <ActivityFeed title="Recent Communications" items={communicationItems} />
//                     <TaskList tasks={mockTasks} />
//                     <ActivityFeed title="System Activity Log" items={systemActivityItems} />
//                 </div>

//                 {/* --- Original Core Functionality RESTORED --- */}
//                 <section>
//                     <h2 className="text-xl font-semibold mb-4">All Properties</h2>
//                     {properties && properties.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {properties.map((property) => (
//                                 <PropertyCard 
//                                     key={property._id}
//                                     property={property}
//                                     onEdit={handleOpenEditModal}
//                                     onDelete={handleDelete}
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                             <p className="text-muted-foreground">You have not added any properties yet.</p>
//                             <Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button>
//                         </div>
//                     )}
//                 </section>
//             </main>

//             {/* Modal for creating/editing properties */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
//                     <div className="bg-card p-6 rounded-lg shadow-2xl w-full max-w-lg">
//                         <PropertyForm
//                             isEditing={!!editingProperty}
//                             initialData={editingProperty}
//                             onSubmit={handleFormSubmit}
//                             isLoading={isLoading}
//                             onCancel={handleCloseModal}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default LandlordDashboard;

// // src/pages/LandLordDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getProperties, createProperty, updateProperty, deleteProperty, reset } from '../features/properties/propertySlice';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // Import UI components
// import { Button } from "@/components/ui/button";
// import { Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// // Import custom dashboard components
// import StatCard from '../components/dashboard/StatCard';
// import PropertyCard from '../components/dashboard/PropertyCard'; // We now use this new component
// import PropertyForm from '../components/forms/PropertyForm';

// function LandlordDashboard() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProperty, setEditingProperty] = useState(null);

//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);
//     const { properties, isLoading, isError, message } = useSelector((state) => state.properties);

//     useEffect(() => {
//         if (isError) {
//             toast.error(message || 'An error occurred.');
//         }
//         if (user) {
//             dispatch(getProperties());
//         }
//         return () => {
//             dispatch(reset());
//         };
//     }, [user, isError, message, dispatch]);

//     // --- All handler functions restored to full functionality ---
//     const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsModalOpen(true);
//     };

//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingProperty(null);
//     };

//     const handleFormSubmit = async (propertyData) => {
//         try {
//             if (editingProperty) {
//                 await dispatch(updateProperty({ _id: editingProperty._id, ...propertyData })).unwrap();
//                 toast.success('Property updated successfully!');
//             } else {
//                 await dispatch(createProperty(propertyData)).unwrap();
//                 toast.success('Property created successfully!');
//             }
//             handleCloseModal();
//         } catch (error) {
//             // Use error.message if available, otherwise a default message
//             toast.error(error.message || 'Failed to save property.');
//         }
//     };

//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId))
//               .unwrap()
//               .then(() => toast.success('Property deleted.'))
//               .catch((error) => toast.error(error.message || 'Failed to delete property.'));
//         }
//     };
    
//     if (isLoading && (!properties || properties.length === 0)) {
//         return <h1 className="text-center p-10">Loading Properties...</h1>;
//     }

//     return (
//         <div className="space-y-8">
//             {/* Header Section */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button>
//                     <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//                 </div>
//             </div>

//             <main className="grid gap-8">
//                 {/* Stats Section */}
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatCard title="Total Properties" value={properties.length} description="Managed units" icon={Building2} />
//                     <StatCard title="Total Rent (Monthly)" value={`$${properties.reduce((acc, p) => acc + p.rentAmount, 0).toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                     <StatCard title="Open Maintenance" value="3" description="1 high priority" icon={Wrench} color="destructive" />
//                     <StatCard title="Occupancy" value="95%" description="2 vacant units" icon={UserCheck} />
//                 </div>

//                 {/* Properties List Section */}
//                 <section>
//                     <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
//                     {properties && properties.length > 0 ? (
//                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                             {properties.map((property) => (
//                                 <PropertyCard 
//                                     key={property._id}
//                                     property={property}
//                                     onEdit={handleOpenEditModal}
//                                     onDelete={handleDelete}
//                                 />
//                             ))}
//                         </div>
//                     ) : (
//                         <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                             <p className="text-muted-foreground">You have not added any properties yet.</p>
//                             <Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button>
//                         </div>
//                     )}
//                 </section>
//             </main>

//             {/* Modal for creating/editing properties */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
//                     <div className="bg-card p-6 rounded-lg shadow-2xl w-full max-w-lg">
//                         <PropertyForm
//                             isEditing={!!editingProperty}
//                             initialData={editingProperty}
//                             onSubmit={handleFormSubmit}
//                             isLoading={isLoading}
//                             onCancel={handleCloseModal}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default LandlordDashboard;

// src/pages/LandLordDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getProperties, createProperty, updateProperty, deleteProperty, reset } from '../features/properties/propertySlice';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // Import shadcn/ui and lucide-react components
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { MoreHorizontal, Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// // Import custom components
// import StatCard from '../components/dashboard/StatCard';
// import PropertyForm from '../components/forms/PropertyForm';
// import OverdueTenants from '../components/dashboard/OverdueTenants';
// import MaintenanceQueue from '../components/dashboard/MaintenanceQueue';
// import TaskList from '../components/dashboard/TaskList';
// import ActivityFeed from '../components/dashboard/ActivityFeed';

// // Import our separated mock data
// import { communicationItems, systemActivityItems, mockTasks } from '../lib/mockData';

// function LandlordDashboard() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProperty, setEditingProperty] = useState(null);

//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);
//     const { properties, isLoading, isError, message } = useSelector((state) => state.properties);

//     useEffect(() => {
//         if (isError) toast.error(message || 'An error occurred.');
//         if (user) dispatch(getProperties());
//         return () => { dispatch(reset()); };
//     }, [user, isError, message, dispatch]);

//     // --- Handler function implementations ---
//     const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsModalOpen(true);
//     };

//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingProperty(null);
//     };

//     const handleFormSubmit = async (propertyData) => {
//         try {
//             if (editingProperty) {
//                 await dispatch(updateProperty({ _id: editingProperty._id, ...propertyData })).unwrap();
//                 toast.success('Property updated successfully!');
//             } else {
//                 await dispatch(createProperty(propertyData)).unwrap();
//                 toast.success('Property created successfully!');
//             }
//             handleCloseModal();
//         } catch (error) {
//             toast.error(error.message || 'Failed to save property.');
//         }
//     };

//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId))
//                 .unwrap()
//                 .then(() => toast.success('Property deleted.'))
//                 .catch((error) => toast.error(error.message || 'Failed to delete property.'));
//         }
//     };

//     if (isLoading && !properties.length) {
//         return <div className="text-center p-10">Loading Dashboard...</div>;
//     }

//     return (
//         <div className="space-y-8">
//             {/* Page Header */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild><Link to="/landlord/maintenance">View Maintenance</Link></Button>
//                     <Button onClick={handleOpenCreateModal}>+ Add Property</Button>
//                 </div>
//             </div>

//             {/* Main Content Grid */}
//             <main className="grid gap-8">
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <StatCard title="Total Properties" value={properties.length} description="Managed units" icon={Building2} />
//                     <StatCard title="Total Rent (Monthly)" value={`$${properties.reduce((acc, p) => acc + p.rentAmount, 0).toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                     <StatCard title="Open Maintenance" value="3" description="1 high priority" icon={Wrench} color="destructive" />
//                     <StatCard title="Occupancy" value="95%" description="2 vacant units" icon={UserCheck} />
//                 </div>

//                 <div className="grid gap-6 lg:grid-cols-2">
//                     <OverdueTenants />
//                     <MaintenanceQueue />
//                 </div>
                
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     <ActivityFeed title="Recent Communications" items={communicationItems} />
//                     <TaskList tasks={mockTasks} />
//                     <ActivityFeed title="System Activity Log" items={systemActivityItems} />
//                 </div>
//             </main>

//             {/* Modal for creating/editing properties */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50">
//                     <div className="bg-card p-6 rounded-lg shadow-2xl w-full max-w-lg">
//                         <PropertyForm
//                             isEditing={!!editingProperty}
//                             initialData={editingProperty}
//                             onSubmit={handleFormSubmit}
//                             isLoading={isLoading}
//                             onCancel={handleCloseModal}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default LandlordDashboard;

// // src/pages/LandLordDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getProperties, createProperty, updateProperty, deleteProperty, reset } from '../features/properties/propertySlice';
// import { Link } from 'react-router-dom';
// import { toast } from 'react-toastify';

// // Import shadcn/ui and lucide-react components
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { MoreHorizontal, Building2, Wrench, CircleDollarSign, UserCheck } from "lucide-react";

// // Import our new custom components
// import StatCard from '../components/dashboard/StatCard';
// import PropertyForm from '../components/forms/PropertyForm'; // Assuming PropertyForm is still used for the modal
// import OverdueTenants from '../components/dashboard/OverdueTenants';
// import MaintenanceQueue from '../components/dashboard/MaintenanceQueue';
// import TaskList from '../components/dashboard/TaskList';
// import ActivityFeed from '../components/dashboard/ActivityFeed';

// function LandlordDashboard() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProperty, setEditingProperty] = useState(null);

//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);
//     const { properties, isLoading, isError, message } = useSelector((state) => state.properties);

//     useEffect(() => {
//         if (isError) {
//             toast.error(message || 'An error occurred.');
//         }
//         if (user) {
//             dispatch(getProperties());
//         }
//         return () => {
//             dispatch(reset());
//         };
//     }, [user, isError, message, dispatch]);

//     // --- All your handler functions (handleOpenCreateModal, etc.) remain exactly the same ---
//      const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsModalOpen(true);
//     };

//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingProperty(null);
//     };

//     const handleFormSubmit = async (propertyData) => {
//         try {
//             if (editingProperty) {
//                 await dispatch(updateProperty({ _id: editingProperty._id, ...propertyData })).unwrap();
//                 toast.success('Property updated successfully!');
//             } else {
//                 await dispatch(createProperty(propertyData)).unwrap();
//                 toast.success('Property created successfully!');
//             }
//             handleCloseModal();
//         } catch (error) {
//             toast.error(error);
//         }
//     };

//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId));
//         }
//     };

//     // --- MOCK DATA for Phase 3 Components ---
//     const communicationItems = [
//         { actor: 'Alice Johnson', action: '(Unit 101)', details: 'Sent: Overdue Rent Reminder', time: '2h ago', actorIcon: User },
//         { actor: 'Bob Williams', action: '(Unit 205)', details: 'Logged call regarding late payment.', time: '17m ago', actorIcon: User },
//         { actor: 'Frank Green', action: '(Unit 301)', details: 'Can we schedule maintenance for...', time: '3h ago', actorIcon: User },
//     ];

//     const systemActivityItems = [
//         { actor: 'System:', action: 'Generated "Late Rent Notice" batch for Oak Apartments', details: '', time: '10m ago', actorIcon: Bell },
//         { actor: 'Property Manager:', action: 'Logged $1200 rent payment for T. Brown (Unit 301)', details: '', time: '17m ago', actorIcon: Bell },
//         { actor: 'Dave M:', action: 'Maintenance Request #1225 status changed to "In Progress"', details: '', time: '32m ago', actorIcon: Bell },
//     ];
//     // --- End Mock Data ---

//     if (isLoading && !properties.length) {
//         return <div className="text-center p-10">Loading Dashboard...</div>;
//     }

//     return (
//         <div className="space-y-6">
//             {/* Page Header */}
//             <div className="flex justify-between items-center">
//                 <div>
//                     <h1 className="text-2xl font-bold">Dashboard</h1>
//                     <p className="text-muted-foreground">A high-level overview of your properties.</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" asChild>
//                         <Link to="/landlord/maintenance">View Maintenance</Link>
//                     </Button>
//                     <Button onClick={handleOpenCreateModal}>
//                         + Add Property
//                     </Button>
//                 </div>
//             </div>

//             {/* PHASE 1: AT-A-GLANCE METRICS ROW */}
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                 <StatCard title="Total Properties" value={properties.length} description="Managed units" icon={Building2} />
//                 <StatCard title="Total Rent (Monthly)" value={`$${properties.reduce((acc, p) => acc + p.rentAmount, 0).toLocaleString()}`} description="Across all properties" icon={CircleDollarSign} />
//                 <StatCard title="Open Maintenance" value="3" description="1 high priority" icon={Wrench} color="destructive" />
//                 <StatCard title="Occupancy" value="95%" description="2 vacant units" icon={UserCheck} />
//             </div>

//             {/* --- PHASE 2: ACTION-ORIENTED SUMMARY LISTS --- */}
//             <div className="grid gap-6 lg:grid-cols-2">
//                 <OverdueTenants />
//                 <MaintenanceQueue />
//             </div>
//             {/* --- END OF PHASE 2 --- */}
//             {/* --- PHASE 3: LIVE ACTIVITY FEEDS --- */}
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                 <ActivityFeed title="Recent Communications" items={communicationItems} />
//                 <TaskList />
//                 <ActivityFeed title="System Activity Log" items={systemActivityItems} />
//             </div>
//              {/* --- END OF PHASE 3 --- */}

//             {/* Property List Section */}
//             <section>
//                 <h2 className="text-xl font-semibold mb-4">Your Properties</h2>
//                 {properties && properties.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {properties.map((property) => (
//                             <Card key={property._id} className="flex flex-col">
//                                 <CardHeader className="flex-row gap-4 items-start pb-4">
//                                     <div className="flex-grow">
//                                         <CardTitle>{property.address.street}</CardTitle>
//                                         <CardDescription>{property.address.city}, {property.address.state}</CardDescription>
//                                     </div>
//                                     <DropdownMenu>
//                                         <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
//                                         <DropdownMenuContent align="end">
//                                             <DropdownMenuItem onClick={() => handleOpenEditModal(property)}>Edit</DropdownMenuItem>
//                                             <DropdownMenuItem onClick={() => handleDelete(property._id)} className="text-destructive focus:text-destructive">Delete</DropdownMenuItem>
//                                         </DropdownMenuContent>
//                                     </DropdownMenu>
//                                 </CardHeader>
//                                 <CardContent className="flex-grow">
//                                     <div className="text-2xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</div>
//                                 </CardContent>
//                                 <CardFooter>
//                                     <Badge variant="secondary">Vacant</Badge>
//                                 </CardFooter>
//                             </Card>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                         <p className="text-muted-foreground">You have not added any properties yet.</p>
//                         <Button onClick={handleOpenCreateModal} className="mt-4">Add Your First Property</Button>
//                     </div>
//                 )}
//             </section>

//             {/* The Modal for creating/editing properties remains the same */}
//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//                     <div className="bg-card p-6 rounded-lg shadow-2xl w-full max-w-lg">
//                         <PropertyForm
//                             isEditing={!!editingProperty}
//                             initialData={editingProperty}
//                             onSubmit={handleFormSubmit}
//                             isLoading={isLoading}
//                             onCancel={handleCloseModal}
//                         />
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default LandlordDashboard;

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// // --- THIS IS THE CORRECTED IMPORT ---
// // We import getProperties for this dashboard. getLandlordRequests will be used on the maintenance page.
// import { getProperties, createProperty, updateProperty, deleteProperty, reset } from '../features/properties/propertySlice';
// import PropertyForm from '../components/forms/PropertyForm';
// import { toast } from 'react-toastify';
// import { Link } from 'react-router-dom';

// function LandlordDashboard() {
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [editingProperty, setEditingProperty] = useState(null);

//     const dispatch = useDispatch();
//     const { user } = useSelector((state) => state.auth);
//     const { properties, isLoading, isError, message } = useSelector((state) => state.properties);

//     useEffect(() => {
//         if (isError) {
//             toast.error(message || 'An error occurred.');
//         }

//         if (user) {
//             // --- THIS IS THE CORRECTED FUNCTION CALL ---
//             dispatch(getProperties());
//         }

//         return () => {
//             dispatch(reset());
//         };
//     }, [user, isError, message, dispatch]);

//     const handleOpenCreateModal = () => {
//         setEditingProperty(null);
//         setIsModalOpen(true);
//     };

//     const handleOpenEditModal = (property) => {
//         setEditingProperty(property);
//         setIsModalOpen(true);
//     };

//     const handleCloseModal = () => {
//         setIsModalOpen(false);
//         setEditingProperty(null);
//     };

//     const handleFormSubmit = async (propertyData) => {
//         try {
//             if (editingProperty) {
//                 await dispatch(updateProperty({ _id: editingProperty._id, ...propertyData })).unwrap();
//                 toast.success('Property updated successfully!');
//             } else {
//                 await dispatch(createProperty(propertyData)).unwrap();
//                 toast.success('Property created successfully!');
//             }
//             handleCloseModal();
//         } catch (error) {
//             toast.error(error);
//         }
//     };

//     const handleDelete = (propertyId) => {
//         if (window.confirm('Are you sure you want to delete this property?')) {
//             dispatch(deleteProperty(propertyId));
//         }
//     };

//     if (isLoading && (!properties || properties.length === 0)) {
//         return <h1 className="text-center text-2xl mt-10">Loading Properties...</h1>;
//     }

//     return (

        
//         <div className="p-4 md:p-8 max-w-7xl mx-auto">
//             <div className="flex justify-between items-center mb-6">
                
//                 <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
//                 <div className="flex gap-4">
//                     <Link to="/landlord/maintenance" className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
//                         View Maintenance Requests
//                     </Link>
//                     <button onClick={handleOpenCreateModal} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-lg">
//                         + Add New Property
//                     </button>
//                 </div>
//             </div>

//             <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>

//             {isModalOpen && (
//                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
//                     <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
//                         <PropertyForm
//                             isEditing={!!editingProperty}
//                             initialData={editingProperty}
//                             onSubmit={handleFormSubmit}
//                             isLoading={isLoading}
//                             onCancel={handleCloseModal}
//                         />
//                     </div>
//                 </div>
//             )}

//             <section className="mt-8">
//                 {properties && properties.length > 0 ? (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {/* {properties.map((property) => (
//                             <div key={property._id} className="border p-4 rounded-lg shadow-md bg-white flex flex-col justify-between">
//                                 <div>
//                                     <h4 className="font-bold text-lg">{property.address.street}</h4>
//                                     <p className="text-gray-600">{property.address.city}, {property.address.state}</p>
//                                     <p className="mt-2 text-xl font-semibold text-green-600">${property.rentAmount}/month</p>
//                                 </div>
//                                 <div className="flex justify-end gap-2 mt-4">
//                                     <button onClick={() => handleOpenEditModal(property)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm">Edit</button>
//                                     <button onClick={() => handleDelete(property._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">Delete</button>
//                                 </div>
//                             </div>
//                         ))} */}
//                         {properties.map((property) => (
//     // Use bg-card, text-foreground, and text-muted-foreground
//     <div key={property._id} className="border bg-card text-card-foreground p-4 rounded-lg shadow-md flex flex-col justify-between">
//         <div>
//             <h4 className="font-bold text-lg">{property.address.street}</h4>
//             <p className="text-muted-foreground">{property.address.city}, {property.address.state}</p>
//             <p className="mt-2 text-xl font-semibold text-primary">${property.rentAmount}/month</p>
//         </div>
//         <div className="flex justify-end gap-2 mt-4">
//             <button onClick={() => handleOpenEditModal(property)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded text-sm">Edit</button>
//             <button onClick={() => handleDelete(property._id)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">Delete</button>
//         </div>
//     </div>
// ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-10 border-2 border-dashed rounded-lg mt-6">
//                         <p className="text-gray-500">You have not added any properties yet.</p>
//                     </div>
//                 )}
//             </section>
//         </div>
//     );
// }

// export default LandlordDashboard;


