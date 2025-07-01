import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// --- Redux Imports ---
import { getMyLease, reset as resetLease } from '../features/lease/leaseSlice';
import { getMyPayments, reset as resetPayments } from '../features/payments/paymentSlice';

// --- UI & Icon Imports ---
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DollarSign } from 'lucide-react';

// --- Custom Component Imports ---
import PaymentModal from '../components/modals/PaymentModal';

function TenantDashboard() {
    const dispatch = useDispatch();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    // --- Redux State Selectors ---
    const { user } = useSelector((state) => state.auth);
    const { lease, isLoading: isLeaseLoading, isError: isLeaseError, message: leaseMessage } = useSelector((state) => state.lease);
    const { paymentHistory, isLoading: isPaymentsLoading, isError: isPaymentsError, message: paymentsMessage } = useSelector((state) => state.payments);

    // --- 1. Refactored Data Fetching Effect ---
    // This effect now ONLY handles fetching data and only runs when the user changes.
    useEffect(() => {
        if (user) {
            dispatch(getMyLease());
            dispatch(getMyPayments());
        }
        // The cleanup function resets the Redux state when the component is unmounted.
        return () => {
            dispatch(resetLease());
            dispatch(resetPayments());
        };
    }, [dispatch, user]);

    // --- 2. NEW Effect for Handling Unexpected Errors ---
    // This effect watches for errors and decides if a toast notification is necessary.
    useEffect(() => {
        // We only show a toast if it's a REAL error, not just a "404 Not Found" for the lease.
        if (isLeaseError && leaseMessage !== 'No active lease found for this user.') {
            toast.error(leaseMessage);
        }
        if (isPaymentsError) {
            toast.error(paymentsMessage);
        }
    }, [isLeaseError, isPaymentsError, leaseMessage, paymentsMessage]);

    // --- Handler Functions ---
    const handlePaymentSuccess = () => {
        setIsPaymentModalOpen(false);
        toast.success("Payment successful! Your history will be updated shortly.");
        dispatch(getMyPayments());
    };

    // --- 3. Refactored Render Logic ---
    // The loading state is now handled cleanly at the top.
    if (isLeaseLoading) {
        return <div className="text-center p-10">Loading Your Dashboard...</div>;
    }

    return (
        <>
            <div className="space-y-8">
                <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>

                {lease ? (
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Your Active Lease</CardTitle>
                                    <CardDescription className="pt-1">
                                        Details for your lease at {lease.property.address.street}
                                    </CardDescription>
                                </div>
                                <Button onClick={() => setIsPaymentModalOpen(true)}>
                                    <DollarSign className="mr-2 h-4 w-4" /> Pay Rent
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                    <h4 className="font-bold text-muted-foreground">Monthly Rent</h4>
                                    <p className="text-lg font-semibold text-primary">${lease.rentAmount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-muted-foreground">Lease Start Date</h4>
                                    <p className="text-lg">{new Date(lease.startDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-muted-foreground">Lease End Date</h4>
                                    <p className="text-lg">{new Date(lease.endDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    // This card is now correctly shown when `lease` is null (i.e., a 404 was returned)
                    <Card>
                        <CardHeader><CardTitle>No Active Lease</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">You do not currently have an active lease assigned to your account. If you have applied for a property, please wait for your landlord to approve the application.</p>
                        </CardContent>
                    </Card>
                )}

                {/* Payment History Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isPaymentsLoading ? (
                                    <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading history...</TableCell></TableRow>
                                ) : paymentHistory.length > 0 ? (
                                    paymentHistory.map((p) => (
                                        <TableRow key={p._id}>
                                            <TableCell className="font-medium">{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
                                            <TableCell>${p.amount.toFixed(2)}</TableCell>
                                            <TableCell>{p.method}</TableCell>
                                            <TableCell>{p.notes || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No payment history found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Modal */}
            <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pay Your Rent</DialogTitle>
                        <DialogDescription>
                            {`You are submitting a payment of $${lease?.rentAmount.toLocaleString()} for your lease at ${lease?.property.address.street}.`}
                        </DialogDescription>
                    </DialogHeader>
                    {lease && (
                        <PaymentModal 
                            amount={lease.rentAmount}
                            onPaymentSuccess={handlePaymentSuccess}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

export default TenantDashboard;

// // src/pages/TenantDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';

// // --- Redux Imports ---
// import { getMyLease, reset as resetLease } from '../features/lease/leaseSlice';
// import { getMyPayments, reset as resetPayments } from '../features/payments/paymentSlice';

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { DollarSign } from 'lucide-react';

// // --- Custom Component Imports ---
// import PaymentModal from '../components/modals/PaymentModal';

// function TenantDashboard() {
//     const dispatch = useDispatch();
//     const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//     // --- Redux State Selectors ---
//     const { user } = useSelector((state) => state.auth);
//     const { lease, isLoading: isLeaseLoading, isError: isLeaseError, message: leaseMessage } = useSelector((state) => state.lease);
//     const { paymentHistory, isLoading: isPaymentsLoading, isError: isPaymentsError, message: paymentsMessage } = useSelector((state) => state.payments);

//     // --- Data Fetching Effect ---
//     useEffect(() => {
//         // This guard clause ensures we only fetch data when the user object is available.
//         if (user) {
//             dispatch(getMyLease());
//             dispatch(getMyPayments());
//         }

//         // Display any errors from the Redux slices
//         if (isLeaseError) toast.error(leaseMessage);
//         if (isPaymentsError) toast.error(paymentsMessage);

//         // Cleanup function to reset state when leaving the page
//         return () => {
//             dispatch(resetLease());
//             dispatch(resetPayments());
//         };
//     // The dependency array now includes 'user', so this effect re-runs when the user logs in.
//     }, [dispatch, user, isLeaseError, isPaymentsError, leaseMessage, paymentsMessage]);

//     // --- Handler Functions ---
//     const handlePaymentSuccess = () => {
//         setIsPaymentModalOpen(false);
//         // After a successful payment, refresh the payment history
//         toast.success("Payment successful! Your history will be updated shortly.");
//         dispatch(getMyPayments());
//     };

//     if (isLeaseLoading) {
//         return <div className="text-center p-10">Loading Your Dashboard...</div>;
//     }

//     return (
//         <>
//             <div className="space-y-8">
//                 <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>

//                 {lease ? (
//                     <Card>
//                         <CardHeader>
//                             <div className="flex justify-between items-center">
//                                 <div>
//                                     <CardTitle>Your Active Lease</CardTitle>
//                                     <CardDescription className="pt-1">
//                                         Details for your lease at {lease.property.address.street}
//                                     </CardDescription>
//                                 </div>
//                                 <Button onClick={() => setIsPaymentModalOpen(true)}>
//                                     <DollarSign className="mr-2 h-4 w-4" /> Pay Rent
//                                 </Button>
//                             </div>
//                         </CardHeader>
//                         <CardContent>
//                             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                                 <div>
//                                     <h4 className="font-bold text-muted-foreground">Monthly Rent</h4>
//                                     <p className="text-lg font-semibold text-primary">${lease.rentAmount.toLocaleString()}</p>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-bold text-muted-foreground">Lease Start Date</h4>
//                                     <p className="text-lg">{new Date(lease.startDate).toLocaleDateString()}</p>
//                                 </div>
//                                 <div>
//                                     <h4 className="font-bold text-muted-foreground">Lease End Date</h4>
//                                     <p className="text-lg">{new Date(lease.endDate).toLocaleDateString()}</p>
//                                 </div>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 ) : (
//                     <Card>
//                         <CardHeader><CardTitle>No Active Lease</CardTitle></CardHeader>
//                         <CardContent>
//                             <p>You do not currently have an active lease assigned to your account. If you have applied for a property, please wait for your landlord to approve the application.</p>
//                         </CardContent>
//                     </Card>
//                 )}

//                 {/* Payment History Card */}
//                 <Card>
//                     <CardHeader>
//                         <CardTitle>Payment History</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Date</TableHead>
//                                     <TableHead>Amount</TableHead>
//                                     <TableHead>Method</TableHead>
//                                     <TableHead>Notes</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {isPaymentsLoading ? (
//                                     <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading history...</TableCell></TableRow>
//                                 ) : paymentHistory.length > 0 ? (
//                                     paymentHistory.map((p) => (
//                                         <TableRow key={p._id}>
//                                             <TableCell className="font-medium">{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
//                                             <TableCell>${p.amount.toFixed(2)}</TableCell>
//                                             <TableCell>{p.method}</TableCell>
//                                             <TableCell>{p.notes || 'N/A'}</TableCell>
//                                         </TableRow>
//                                     ))
//                                 ) : (
//                                     <TableRow><TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No payment history found.</TableCell></TableRow>
//                                 )}
//                             </TableBody>
//                         </Table>
//                     </CardContent>
//                 </Card>
//             </div>

//             {/* Payment Modal */}
//             <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Pay Your Rent</DialogTitle>
//                         <DialogDescription>
//                             {`You are submitting a payment of $${lease?.rentAmount.toLocaleString()} for your lease at ${lease?.property.address.street}.`}
//                         </DialogDescription>
//                     </DialogHeader>
//                     {lease && (
//                         <PaymentModal 
//                             amount={lease.rentAmount}
//                             onPaymentSuccess={handlePaymentSuccess}
//                         />
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

// export default TenantDashboard;
// // src/pages/TenantDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getMyLease, reset as resetLease } from '../features/lease/leaseSlice';

// // Import the components needed for the payment modal
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import PaymentModal from '../components/modals/PaymentModal';

// function TenantDashboard() {
//     const dispatch = useDispatch();
    
//     // State to manage the payment modal's visibility
//     const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//     const { user } = useSelector((state) => state.auth);
//     const { lease, isLoading, isError, message } = useSelector((state) => state.lease);

//     useEffect(() => {
//         if (isError) console.error(message);
//         dispatch(getMyLease());
//         return () => { dispatch(resetLease()); };
//     }, [dispatch, isError, message]);

//     // This function will be called by the PaymentModal upon success
//     const handlePaymentSuccess = () => {
//         setIsPaymentModalOpen(false);
//         // We can dispatch an action here later to refresh lease/payment data
//     };

//     if (isLoading) {
//         return <h1>Loading Your Lease Details...</h1>;
//     }

//     return (
//         <>
//             <div className="space-y-6">
//                 <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
//                 <h2 className="text-2xl font-semibold">Your Lease Details</h2>

//                 {lease ? (
//                     <div className="bg-card text-card-foreground shadow-md rounded-lg p-6">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="text-xl font-bold mb-2">Property Address</h3>
//                                 <p className="text-muted-foreground">{lease.property.address.street}</p>
//                             </div>
//                             {/* The "Pay Rent" button, which opens the modal */}
//                             <Button onClick={() => setIsPaymentModalOpen(true)}>Pay Rent</Button>
//                         </div>
                        
//                         <hr className="my-4" />

//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <h4 className="font-bold">Monthly Rent</h4>
//                                 <p className="text-lg text-primary">${lease.rentAmount.toLocaleString()}</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-bold">Lease End Date</h4>
//                                 <p className="text-lg">{new Date(lease.endDate).toLocaleDateString()}</p>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <p>You do not currently have an active lease assigned to your account.</p>
//                 )}
//             </div>

//             {/* The Payment Modal, rendered conditionally */}
//             <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Pay Rent</DialogTitle>
//                         <DialogDescription>
//                             {`You are paying rent for ${lease?.property.address.street}.`}
//                         </DialogDescription>
//                     </DialogHeader>
//                     {lease && (
//                         <PaymentModal 
//                             amount={lease.rentAmount}
//                             onPaymentSuccess={handlePaymentSuccess}
//                         />
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

// export default TenantDashboard;

// // src/pages/TenantDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getMyLease, reset as resetLease } from '../features/lease/leaseSlice';

// // Import the new components and state needed for payments
// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import PaymentModal from '../components/modals/PaymentModal';
// import { toast } from 'react-toastify';


// function TenantDashboard() {
//     const dispatch = useDispatch();
    
//     // State to manage the payment modal
//     const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//     const { user } = useSelector((state) => state.auth);
//     const { lease, isLoading, isError, message } = useSelector((state) => state.lease);

//     useEffect(() => {
//         if (isError) {
//             console.error(message);
//         }
//         dispatch(getMyLease());
//         return () => {
//             dispatch(resetLease());
//         };
//     }, [dispatch, isError, message]);

//     const handlePaymentSuccess = () => {
//         setIsPaymentModalOpen(false);
//         // Optionally, refetch lease data to show updated balance in the future
//     };

//     if (isLoading) {
//         return <h1>Loading Your Lease Details...</h1>;
//     }

//     return (
//         <>
//             <div>
//                 <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>
//                 <h2 className="text-2xl font-semibold mb-4">Your Active Lease</h2>

//                 {lease ? (
//                     <div className="bg-card text-card-foreground shadow-md rounded-lg p-6">
//                         <div className="flex justify-between items-start">
//                             <div>
//                                 <h3 className="text-xl font-bold mb-2">Property Address</h3>
//                                 <p className="text-muted-foreground">{lease.property.address.street}</p>
//                                 <p className="text-muted-foreground">{lease.property.address.city}, {lease.property.address.state} {lease.property.address.zipCode}</p>
//                             </div>
//                             {/* --- THE NEW "PAY RENT" BUTTON --- */}
//                             <Button onClick={() => setIsPaymentModalOpen(true)}>Pay Rent</Button>
//                         </div>
                        
//                         <hr className="my-4" />

//                         <div className="grid grid-cols-2 gap-4">
//                             <div>
//                                 <h4 className="font-bold">Monthly Rent</h4>
//                                 <p className="text-lg text-primary">${lease.rentAmount.toLocaleString()}</p>
//                             </div>
//                             <div>
//                                 <h4 className="font-bold">Lease End Date</h4>
//                                 <p className="text-lg">{new Date(lease.endDate).toLocaleDateString()}</p>
//                             </div>
//                         </div>
//                     </div>
//                 ) : (
//                     <p>You do not currently have an active lease assigned to your account.</p>
//                 )}
//             </div>

//             {/* --- THE PAYMENT MODAL RENDERED IN THE TENANT'S DASHBOARD --- */}
//             <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Pay Rent</DialogTitle>
//                         <DialogDescription>
//                             {`You are paying rent for ${lease?.property.address.street}.`}
//                         </DialogDescription>
//                     </DialogHeader>
//                     {lease && (
//                         <PaymentModal 
//                             amount={lease.rentAmount}
//                             leaseId={lease._id} // Pass the tenant's own leaseId
//                             onPaymentSuccess={handlePaymentSuccess}
//                         />
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// }

// export default TenantDashboard;

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getMyLease, reset } from '../features/lease/leaseSlice';

// function TenantDashboard() {
//     const dispatch = useDispatch();

//     const { user } = useSelector((state) => state.auth);
//     // Select the relevant state from our new lease slice
//     const { lease, isLoading, isError, message } = useSelector(
//         (state) => state.lease
//     );

//     useEffect(() => {
//         if (isError) {
//             console.error(message);
//         }
//         // Fetch the lease details when the component loads
//         dispatch(getMyLease());

//         return () => {
//             dispatch(reset());
//         };
//     }, [dispatch, isError, message]);


//     if (isLoading) {
//         return <h1>Loading Your Lease Details...</h1>;
//     }

//     return (
//         <div>
//             <h1 className="text-3xl font-bold mb-4">Welcome, {user && user.name}!</h1>
            
//             <h2 className="text-2xl font-semibold mb-4">Your Active Lease</h2>

//             {lease ? (
//                 <div className="bg-white shadow-md rounded-lg p-6">
//                     <h3 className="text-xl font-bold mb-2">Property Address</h3>
//                     <p className="text-gray-700">{lease.property.address.street}</p>
//                     <p className="text-gray-700">{lease.property.address.city}, {lease.property.address.state} {lease.property.address.zipCode}</p>
                    
//                     <hr className="my-4" />

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <h4 className="font-bold">Monthly Rent</h4>
//                             <p className="text-lg text-green-600">${lease.rentAmount}</p>
//                         </div>
//                         <div>
//                             <h4 className="font-bold">Lease End Date</h4>
//                             <p className="text-lg">{new Date(lease.endDate).toLocaleDateString()}</p>
//                         </div>
//                     </div>
//                 </div>
//             ) : (
//                 <p>You do not currently have an active lease assigned to your account.</p>
//             )}
//         </div>
//     );
// }

// export default TenantDashboard;