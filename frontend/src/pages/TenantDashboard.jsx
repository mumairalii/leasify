import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { format, isPast, parseISO } from "date-fns";

// --- Redux Imports ---
import { getMyLease, reset as resetLease } from "../features/lease/leaseSlice";
import {
  getMyPayments,
  reset as resetPayments,
} from "../features/payments/paymentSlice";
import {
  getTenantRequests,
  reset as resetMaintenance,
} from "../features/maintenance/maintenanceSlice";

// --- UI & Icon Imports ---
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, FileText, Bell } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// --- Custom Component Imports ---
import StripePaymentModal from "../components/modals/StripePaymentModal";

// --- Sub-components for the Dashboard ---

const FinancialSummaryCard = ({ lease, onPayRentClick, paymentHistory }) => {
  const nextDueDate = useMemo(() => {
    if (!lease) return null;
    const startDate = lease.startDate ? parseISO(lease.startDate) : new Date();
    const today = new Date();
    let nextDueDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      startDate.getDate()
    );
    if (isPast(nextDueDate)) {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    }
    return nextDueDate;
  }, [lease]);

  // Check if rent has already been paid for the current month
  const hasPaidCurrentMonth = useMemo(() => {
    if (!lease || !paymentHistory || !paymentHistory.length) return false;

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    return paymentHistory.some((payment) => {
      if (payment.status !== "Completed") return false;

      const paymentDate = new Date(payment.paymentDate);
      return (
        paymentDate.getMonth() === currentMonth &&
        paymentDate.getFullYear() === currentYear
      );
    });
  }, [lease, paymentHistory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rent Payment</CardTitle>
        {lease && (
          <CardDescription>
            Next payment due on {format(nextDueDate, "MMMM dd, yyyy")}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {lease ? (
          <>
            <p className="text-4xl font-bold text-primary">
              $
              {(lease.currentBalance > 0
                ? lease.currentBalance
                : lease.rentAmount
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </p>
            {hasPaidCurrentMonth ? (
              <Button className="w-full" size="lg" variant="outline" disabled>
                <DollarSign className="mr-2 h-4 w-4" />
                Rent Already Paid
              </Button>
            ) : (
              <Button onClick={onPayRentClick} className="w-full" size="lg">
                <DollarSign className="mr-2 h-4 w-4" />
                Pay Rent Online
              </Button>
            )}
          </>
        ) : (
          <p className="text-muted-foreground pt-4">
            You do not currently have an active lease.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

const MaintenanceSummaryCard = ({ requests, isLoading }) => (
  <Card>
    <CardHeader>
      <CardTitle>Recent Maintenance</CardTitle>
    </CardHeader>
    <CardContent>
      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : requests.length > 0 ? (
        <ul className="space-y-4">
          {requests.slice(0, 3).map((req) => (
            <li key={req._id} className="flex justify-between items-center">
              <span className="text-sm truncate pr-2" title={req.description}>
                {req.description}
              </span>
              <Badge
                variant={
                  {
                    Pending: "destructive",
                    "In Progress": "secondary",
                    Completed: "default",
                  }[req.status] || "outline"
                }
              >
                {req.status}
              </Badge>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No recent requests found.
        </p>
      )}
    </CardContent>
  </Card>
);

const AnnouncementsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center">
        <Bell className="mr-2 h-5 w-5" />
        Announcements
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground text-center py-4">
        No new announcements.
      </p>
    </CardContent>
  </Card>
);

const LeaseAgreementModal = ({ isOpen, onClose, lease }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Lease Agreement</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Property Address</h3>
            <p>{lease.property.address.street}</p>
          </div>
          <div>
            <h3 className="font-semibold">Lease Term</h3>
            <p>
              {format(parseISO(lease.startDate), "MMM dd, yyyy")} -{" "}
              {format(parseISO(lease.endDate), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">Monthly Rent</h3>
            <p>${lease.rentAmount.toLocaleString()}</p>
          </div>
          {/* Add more lease details here as needed */}
        </div>
        <div className="text-right mt-8">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
};

const LeaseDetails = ({ lease, onLeaseClick }) => {
  if (!lease) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lease Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No active lease found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lease Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Lease Term</h4>
            <p>
              {lease.startDate &&
                format(parseISO(lease.startDate), "MMM dd, yyyy")}{" "}
              -{" "}
              {lease.endDate && format(parseISO(lease.endDate), "MMM dd, yyyy")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Monthly Rent</h4>
            <p>${lease.rentAmount.toLocaleString()}</p>
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={onLeaseClick}>
          <FileText className="mr-2 h-4 w-4" />
          View Lease Agreement
        </Button>
      </CardContent>
    </Card>
  );
};

const PaymentHistory = ({ payments, isLoading }) => (
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
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                Loading history...
              </TableCell>
            </TableRow>
          ) : payments.length > 0 ? (
            payments.map((p) => (
              <TableRow key={p._id}>
                <TableCell className="font-medium">
                  {format(parseISO(p.paymentDate), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>
                  $
                  {p.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>{p.method}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      {
                        Pending: "destructive",
                        "In Progress": "secondary",
                        Completed: "default",
                      }[p.status] || "outline"
                    }
                  >
                    {p.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-24 text-center text-muted-foreground"
              >
                No payment history found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

function TenantDashboard() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);

  // --- Redux State Selectors ---
  const { user } = useSelector((state) => state.auth);
  const { lease, isLoading: isLeaseLoading } = useSelector(
    (state) => state.lease
  );
  console.log(lease);
  const { paymentHistory, isLoading: isPaymentsLoading } = useSelector(
    (state) => state.payments
  );
  const { requests: maintenanceRequests, isLoading: isMaintenanceLoading } =
    useSelector((state) => state.maintenance);

  // --- Data Fetching and Cleanup Effect ---
  useEffect(() => {
    dispatch(getMyLease());
    dispatch(getMyPayments());
    dispatch(getTenantRequests());

    return () => {
      dispatch(resetLease());
      dispatch(resetPayments());
      dispatch(resetMaintenance());
    };
  }, [dispatch]);

  // --- Stripe Redirect Handling Effect ---
  useEffect(() => {
    const query = new URLSearchParams(location.search);

    if (query.get("payment_status") === "success") {
      const paymentId = query.get("paymentId");
      const message = paymentId
        ? `Your payment (ID: ${paymentId}) has been recorded. Thank you!`
        : "Your payment has been recorded. Thank you!";

      toast.success("Payment successful!", {
        description: message,
        duration: 5000,
      });
      dispatch(getMyPayments());
      navigate(location.pathname, { replace: true });
    }

    if (query.get("payment_status") === "cancelled") {
      toast.info("Payment cancelled.", {
        description: "Your payment process was not completed.",
        duration: 5000,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, dispatch]);

  if (isLeaseLoading) {
    return (
      <div className="space-y-8 p-4 md:p-8">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-8 w-1/4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-64 lg:col-span-1" />
          <Skeleton className="h-96 lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 p-4 md:p-8">
        <header>
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
        </header>

        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="lease">My Lease & Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-2 space-y-8">
                <FinancialSummaryCard
                  lease={lease}
                  onPayRentClick={() => setIsPaymentModalOpen(true)}
                />
              </div>
              <div className="lg:col-span-1 space-y-8">
                <MaintenanceSummaryCard
                  requests={maintenanceRequests}
                  isLoading={isMaintenanceLoading}
                />
                <AnnouncementsCard />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="lease" className="mt-4">
            <div className="space-y-8">
              <LeaseDetails
                lease={lease}
                onLeaseClick={() => setIsLeaseModalOpen(true)}
              />
              <PaymentHistory
                payments={paymentHistory}
                isLoading={isPaymentsLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {lease && (
        <StripePaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          lease={lease}
        />
      )}

      <LeaseAgreementModal
        isOpen={isLeaseModalOpen}
        onClose={() => setIsLeaseModalOpen(false)}
        lease={lease}
      />
    </>
  );
}

export default TenantDashboard;

// /**
//  * TenantDashboard.jsx
//  * The primary dashboard for a logged-in tenant, providing a clear financial summary,
//  * a button to pay rent online, and a history of all past payments.
//  */
// import React, { useState, useEffect, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "sonner"; // Using sonner for consistency
// import { format, isPast, parseISO } from "date-fns";

// // --- Redux Imports ---
// import { getMyLease, reset as resetLease } from "../features/lease/leaseSlice";
// import {
//   getMyPayments,
//   reset as resetPayments,
// } from "../features/payments/paymentSlice";
// import {
//   getTenantRequests,
//   reset as resetMaintenance,
// } from "../features/maintenance/maintenanceSlice";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { DollarSign } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// // --- Custom Component Imports ---
// import StripePaymentModal from "../components/modals/StripePaymentModal";

// function TenantDashboard() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   const {
//     lease,
//     isLoading: isLeaseLoading,
//     isError: isLeaseError,
//   } = useSelector((state) => state.lease);
//   const { paymentHistory, isLoading: isPaymentsLoading } = useSelector(
//     (state) => state.payments
//   );
//   const { requests: maintenanceRequests, isLoading: isMaintenanceLoading } =
//     useSelector((state) => state.maintenance);

//   // --- Data Fetching and Cleanup Effect ---
//   useEffect(() => {
//     dispatch(getMyLease());
//     dispatch(getMyPayments());
//     dispatch(getTenantRequests());

//     return () => {
//       dispatch(resetLease());
//       dispatch(resetPayments());
//       dispatch(resetMaintenance());
//     };
//   }, [dispatch]);

//   // --- Stripe Redirect Handling Effect ---
//   useEffect(() => {
//     const query = new URLSearchParams(location.search);

//     if (query.get("payment_status") === "success") {
//       toast.success("Payment successful!", {
//         description: "Your payment has been recorded. Thank you!",
//         duration: 5000,
//       });
//       // Refetch payments to show the latest one immediately
//       dispatch(getMyPayments());
//       // Clean up the URL
//       navigate(location.pathname, { replace: true });
//     }

//     if (query.get("payment_status") === "cancelled") {
//       toast.info("Payment cancelled.", {
//         description: "Your payment process was not completed.",
//         duration: 5000,
//       });
//       navigate(location.pathname, { replace: true });
//     }
//   }, [location, navigate, dispatch]);

//   // --- Derived State for Financial Summary ---
//   const financialSummary = useMemo(() => {
//     if (!lease || !paymentHistory) return null;

//     const startDate = parseISO(lease.startDate);
//     const today = new Date();

//     // Ensure we don't calculate negative months for future leases
//     if (today < startDate) {
//       return {
//         currentBalance: 0,
//         nextDueDate: startDate,
//         displayText: `Your lease starts on ${format(
//           startDate,
//           "MMMM dd, yyyy"
//         )}`,
//       };
//     }

//     // Complex date logic can be tricky, this is a simplified and common approach
//     const monthsPassed =
//       (today.getFullYear() - startDate.getFullYear()) * 12 +
//       (today.getMonth() - startDate.getMonth());
//     const totalRentDueToDate = (monthsPassed + 1) * lease.rentAmount;
//     const totalPaid = paymentHistory
//       .filter((p) => p.status === "Completed")
//       .reduce((acc, p) => acc + p.amount, 0);
//     const currentBalance = totalRentDueToDate - totalPaid;

//     let nextDueDate = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       startDate.getDate()
//     );
//     if (isPast(nextDueDate)) {
//       nextDueDate.setMonth(nextDueDate.getMonth() + 1);
//     }

//     return { currentBalance, nextDueDate, displayText: null };
//   }, [lease, paymentHistory]);

//   const getStatusBadgeVariant = (status) =>
//     ({
//       Pending: "destructive",
//       "In Progress": "secondary",
//       Completed: "default",
//     }[status] || "outline");

//   if (isLeaseLoading) {
//     return (
//       <div className="space-y-8 p-4 md:p-8">
//         <Skeleton className="h-12 w-1/2" />
//         <Skeleton className="h-8 w-1/4" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <Skeleton className="h-64 lg:col-span-1" />
//           <Skeleton className="h-96 lg:col-span-2" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-8 p-4 md:p-8">
//         <header>
//           <h1 className="text-3xl font-bold">My Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           <div className="lg:col-span-1 space-y-8">
//             {/* --- Main Financial Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Rent Payment</CardTitle>
//                 {financialSummary && !financialSummary.displayText && (
//                   <CardDescription>
//                     Next payment due on{" "}
//                     {format(financialSummary.nextDueDate, "MMMM dd, yyyy")}
//                   </CardDescription>
//                 )}
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {isLeaseError && (
//                   <p className="text-destructive">
//                     Could not load lease details.
//                   </p>
//                 )}
//                 {lease && financialSummary ? (
//                   <>
//                     {financialSummary.displayText ? (
//                       <p className="text-muted-foreground pt-4">
//                         {financialSummary.displayText}
//                       </p>
//                     ) : (
//                       <>
//                         <p className="text-4xl font-bold text-primary">
//                           $
//                           {(financialSummary.currentBalance > 0
//                             ? financialSummary.currentBalance
//                             : lease.rentAmount
//                           ).toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                           })}
//                         </p>
//                         <Button
//                           onClick={() => setIsPaymentModalOpen(true)}
//                           className="w-full"
//                           size="lg"
//                         >
//                           <DollarSign className="mr-2 h-4 w-4" />
//                           Pay Rent Online
//                         </Button>
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   !isLeaseLoading && (
//                     <p className="text-muted-foreground pt-4">
//                       You do not currently have an active lease.
//                     </p>
//                   )
//                 )}
//               </CardContent>
//             </Card>

//             {/* Other cards like Maintenance Summary can go here */}
//           </div>

//           <div className="lg:col-span-2">
//             {/* --- Payment History Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment History</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Method</TableHead>
//                       <TableHead>Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {isPaymentsLoading ? (
//                       <TableRow>
//                         <TableCell colSpan={4} className="h-24 text-center">
//                           Loading history...
//                         </TableCell>
//                       </TableRow>
//                     ) : paymentHistory.length > 0 ? (
//                       paymentHistory.map((p) => (
//                         <TableRow key={p._id}>
//                           <TableCell className="font-medium">
//                             {format(parseISO(p.paymentDate), "MMM dd, yyyy")}
//                           </TableCell>
//                           <TableCell>
//                             $
//                             {p.amount.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                             })}
//                           </TableCell>
//                           <TableCell>{p.method}</TableCell>
//                           <TableCell>
//                             <Badge variant={getStatusBadgeVariant(p.status)}>
//                               {p.status}
//                             </Badge>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={4}
//                           className="h-24 text-center text-muted-foreground"
//                         >
//                           No payment history found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* --- Online Payment Modal --- */}
//       {lease && (
//         <StripePaymentModal
//           isOpen={isPaymentModalOpen}
//           onClose={() => setIsPaymentModalOpen(false)}
//           lease={lease}
//         />
//       )}
//     </>
//   );
// }

// export default TenantDashboard;

// /**
//  * TenantDashboard.jsx
//  * The primary dashboard for a logged-in tenant, providing a clear financial summary,
//  * a button to pay rent online, and a history of all past payments.
//  */
// import React, { useState, useEffect, useMemo } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "sonner"; // Using sonner for consistency
// import { format, isPast, parseISO } from "date-fns";

// // --- Redux Imports ---
// import { getMyLease, reset as resetLease } from "../features/lease/leaseSlice";
// import {
//   getMyPayments,
//   reset as resetPayments,
// } from "../features/payments/paymentSlice";
// import {
//   getTenantRequests,
//   reset as resetMaintenance,
// } from "../features/maintenance/maintenanceSlice";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { DollarSign } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// // --- Custom Component Imports ---
// import StripePaymentModal from "../components/modals/StripePaymentModal";

// function TenantDashboard() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   const {
//     lease,
//     isLoading: isLeaseLoading,
//     isError: isLeaseError,
//   } = useSelector((state) => state.lease);
//   const { paymentHistory, isLoading: isPaymentsLoading } = useSelector(
//     (state) => state.payments
//   );
//   const { requests: maintenanceRequests, isLoading: isMaintenanceLoading } =
//     useSelector((state) => state.maintenance);

//   // --- Data Fetching and Cleanup Effect ---
//   useEffect(() => {
//     dispatch(getMyLease());
//     dispatch(getMyPayments());
//     dispatch(getTenantRequests());

//     return () => {
//       dispatch(resetLease());
//       dispatch(resetPayments());
//       dispatch(resetMaintenance());
//     };
//   }, [dispatch]);

//   // --- Stripe Redirect Handling Effect ---
//   useEffect(() => {
//     const query = new URLSearchParams(location.search);

//     if (query.get("payment_status") === "success") {
//       toast.success("Payment successful!", {
//         description: "Your payment has been recorded. Thank you!",
//         duration: 5000,
//       });
//       // Refetch payments to show the latest one immediately
//       dispatch(getMyPayments());
//       // Clean up the URL
//       navigate(location.pathname, { replace: true });
//     }

//     if (query.get("payment_status") === "cancelled") {
//       toast.info("Payment cancelled.", {
//         description: "Your payment process was not completed.",
//         duration: 5000,
//       });
//       navigate(location.pathname, { replace: true });
//     }
//   }, [location, navigate, dispatch]);

//   // --- Derived State for Financial Summary ---
//   const financialSummary = useMemo(() => {
//     if (!lease || !paymentHistory) return null;

//     const startDate = parseISO(lease.startDate);
//     const today = new Date();

//     // Ensure we don't calculate negative months for future leases
//     if (today < startDate) {
//       return {
//         currentBalance: 0,
//         nextDueDate: startDate,
//         displayText: `Your lease starts on ${format(
//           startDate,
//           "MMMM dd, yyyy"
//         )}`,
//       };
//     }

//     // Complex date logic can be tricky, this is a simplified and common approach
//     const monthsPassed =
//       (today.getFullYear() - startDate.getFullYear()) * 12 +
//       (today.getMonth() - startDate.getMonth());
//     const totalRentDueToDate = (monthsPassed + 1) * lease.rentAmount;
//     const totalPaid = paymentHistory
//       .filter((p) => p.status === "Completed")
//       .reduce((acc, p) => acc + p.amount, 0);
//     const currentBalance = totalRentDueToDate - totalPaid;

//     let nextDueDate = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       startDate.getDate()
//     );
//     if (isPast(nextDueDate)) {
//       nextDueDate.setMonth(nextDueDate.getMonth() + 1);
//     }

//     return { currentBalance, nextDueDate, displayText: null };
//   }, [lease, paymentHistory]);

//   const getStatusBadgeVariant = (status) =>
//     ({
//       Pending: "destructive",
//       "In Progress": "secondary",
//       Completed: "default",
//     }[status] || "outline");

//   if (isLeaseLoading) {
//     return (
//       <div className="space-y-8 p-4 md:p-8">
//         <Skeleton className="h-12 w-1/2" />
//         <Skeleton className="h-8 w-1/4" />
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <Skeleton className="h-64 lg:col-span-1" />
//           <Skeleton className="h-96 lg:col-span-2" />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="space-y-8 p-4 md:p-8">
//         <header>
//           <h1 className="text-3xl font-bold">My Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           <div className="lg:col-span-1 space-y-8">
//             {/* --- Main Financial Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Rent Payment</CardTitle>
//                 {financialSummary && !financialSummary.displayText && (
//                   <CardDescription>
//                     Next payment due on{" "}
//                     {format(financialSummary.nextDueDate, "MMMM dd, yyyy")}
//                   </CardDescription>
//                 )}
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {isLeaseError && (
//                   <p className="text-destructive">
//                     Could not load lease details.
//                   </p>
//                 )}
//                 {lease && financialSummary ? (
//                   <>
//                     {financialSummary.displayText ? (
//                       <p className="text-muted-foreground pt-4">
//                         {financialSummary.displayText}
//                       </p>
//                     ) : (
//                       <>
//                         <p className="text-4xl font-bold text-primary">
//                           $
//                           {(financialSummary.currentBalance > 0
//                             ? financialSummary.currentBalance
//                             : lease.rentAmount
//                           ).toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                           })}
//                         </p>
//                         <Button
//                           onClick={() => setIsPaymentModalOpen(true)}
//                           className="w-full"
//                           size="lg"
//                         >
//                           <DollarSign className="mr-2 h-4 w-4" />
//                           Pay Rent Online
//                         </Button>
//                       </>
//                     )}
//                   </>
//                 ) : (
//                   !isLeaseLoading && (
//                     <p className="text-muted-foreground pt-4">
//                       You do not currently have an active lease.
//                     </p>
//                   )
//                 )}
//               </CardContent>
//             </Card>

//             {/* Other cards like Maintenance Summary can go here */}
//           </div>

//           <div className="lg:col-span-2">
//             {/* --- Payment History Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment History</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Method</TableHead>
//                       <TableHead>Status</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {isPaymentsLoading ? (
//                       <TableRow>
//                         <TableCell colSpan={4} className="h-24 text-center">
//                           Loading history...
//                         </TableCell>
//                       </TableRow>
//                     ) : paymentHistory.length > 0 ? (
//                       paymentHistory.map((p) => (
//                         <TableRow key={p._id}>
//                           <TableCell className="font-medium">
//                             {format(parseISO(p.paymentDate), "MMM dd, yyyy")}
//                           </TableCell>
//                           <TableCell>
//                             $
//                             {p.amount.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                             })}
//                           </TableCell>
//                           <TableCell>{p.paymentMethod}</TableCell>
//                           <TableCell>
//                             <Badge variant={getStatusBadgeVariant(p.status)}>
//                               {p.status}
//                             </Badge>
//                           </TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={4}
//                           className="h-24 text-center text-muted-foreground"
//                         >
//                           No payment history found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* --- Online Payment Modal --- */}
//       {lease && (
//         <StripePaymentModal
//           isOpen={isPaymentModalOpen}
//           onClose={() => setIsPaymentModalOpen(false)}
//           lease={lease}
//         />
//       )}
//     </>
//   );
// }

// export default TenantDashboard;

// // /**
// //  * TenantDashboard.jsx
// //  * The primary dashboard for a logged-in tenant, providing a clear financial summary,
// //  * a button to pay rent online, and a history of all past payments.
// //  */

// import React, { useState, useEffect, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { format, isPast } from "date-fns";

// // --- Redux Imports ---
// import { getMyLease, reset as resetLease } from "../features/lease/leaseSlice";
// import {
//   getMyPayments,
//   reset as resetPayments,
// } from "../features/payments/paymentSlice";
// import {
//   getTenantRequests,
//   reset as resetMaintenance,
// } from "../features/maintenance/maintenanceSlice";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { DollarSign, Wrench } from "lucide-react";

// // --- Custom Component Imports ---
// import StripePaymentModal from "../components/modals/StripePaymentModal";

// function TenantDashboard() {
//   const dispatch = useDispatch();
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   const { lease, isLoading: isLeaseLoading } = useSelector(
//     (state) => state.lease
//   );
//   const { paymentHistory, isLoading: isPaymentsLoading } = useSelector(
//     (state) => state.payments
//   );
//   const { requests: maintenanceRequests, isLoading: isMaintenanceLoading } =
//     useSelector((state) => state.maintenance);

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     if (user) {
//       dispatch(getMyLease());
//       dispatch(getMyPayments());
//       dispatch(getTenantRequests());
//     }
//     return () => {
//       dispatch(resetLease());
//       dispatch(resetPayments());
//       dispatch(resetMaintenance());
//     };
//   }, [dispatch, user]);

//   // --- Derived State & Calculations ---
//   const financialSummary = useMemo(() => {
//     if (!lease || !paymentHistory) return null;

//     const startDate = new Date(lease.startDate);
//     const today = new Date();

//     let monthsPassed = (today.getFullYear() - startDate.getFullYear()) * 12;
//     monthsPassed -= startDate.getMonth();
//     monthsPassed += today.getMonth();

//     const paymentPeriodsPassed = monthsPassed < 0 ? 0 : monthsPassed + 1;
//     const totalRentDue = paymentPeriodsPassed * lease.rentAmount;
//     const totalPaid = paymentHistory.reduce((acc, p) => acc + p.amount, 0);
//     const currentBalance = totalRentDue - totalPaid;

//     let nextDueDate = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       startDate.getDate()
//     );
//     if (isPast(nextDueDate)) {
//       nextDueDate.setMonth(nextDueDate.getMonth() + 1);
//     }

//     return { currentBalance, nextDueDate };
//   }, [lease, paymentHistory]);

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Pending":
//         return "destructive";
//       case "In Progress":
//         return "secondary";
//       case "Completed":
//         return "default";
//       default:
//         return "outline";
//     }
//   };

//   if (isLeaseLoading) {
//     return <div className="text-center p-10">Loading Your Dashboard...</div>;
//   }

//   return (
//     <>
//       <div className="space-y-8 p-4 md:p-8">
//         <header>
//           <h1 className="text-3xl font-bold">My Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           <div className="lg:col-span-1 space-y-8">
//             {/* --- Main Financial Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Rent Payment</CardTitle>
//                 {financialSummary && (
//                   <CardDescription>
//                     Next payment due on{" "}
//                     {format(financialSummary.nextDueDate, "MMMM dd, yyyy")}
//                   </CardDescription>
//                 )}
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {lease ? (
//                   <>
//                     <p className="text-4xl font-bold text-primary">
//                       $
//                       {(financialSummary?.currentBalance > 0
//                         ? financialSummary.currentBalance
//                         : lease.rentAmount
//                       ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </p>
//                     <Button
//                       onClick={() => setIsPaymentModalOpen(true)}
//                       className="w-full"
//                       size="lg"
//                     >
//                       <DollarSign className="mr-2 h-4 w-4" />
//                       Pay Rent Online
//                     </Button>
//                   </>
//                 ) : (
//                   <p className="text-muted-foreground pt-4">
//                     You do not currently have an active lease assigned.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* --- Maintenance Summary Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Maintenance Requests</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {isMaintenanceLoading ? (
//                   <p>Loading requests...</p>
//                 ) : maintenanceRequests.length > 0 ? (
//                   <ul className="space-y-4">
//                     {maintenanceRequests.slice(0, 3).map((req) => (
//                       <li
//                         key={req._id}
//                         className="flex justify-between items-center"
//                       >
//                         <span
//                           className="text-sm truncate pr-2"
//                           title={req.description}
//                         >
//                           {req.description}
//                         </span>
//                         <Badge variant={getStatusBadgeVariant(req.status)}>
//                           {req.status}
//                         </Badge>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-muted-foreground text-center py-4">
//                     No recent requests found.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* --- Payment History Card --- */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment History</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Method</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {isPaymentsLoading ? (
//                       <TableRow>
//                         <TableCell colSpan={3} className="h-24 text-center">
//                           Loading history...
//                         </TableCell>
//                       </TableRow>
//                     ) : paymentHistory.length > 0 ? (
//                       paymentHistory.map((p) => (
//                         <TableRow key={p._id}>
//                           <TableCell className="font-medium">
//                             {format(new Date(p.paymentDate), "MMM dd, yyyy")}
//                           </TableCell>
//                           <TableCell>
//                             $
//                             {p.amount.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                             })}
//                           </TableCell>
//                           <TableCell>{p.method}</TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={3}
//                           className="h-24 text-center text-muted-foreground"
//                         >
//                           No payment history found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* --- Online Payment Modal --- */}
//       <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//         <DialogContent className="max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Online Rent Payment</DialogTitle>
//             <DialogDescription>
//               Your payment will be processed securely by Stripe.
//             </DialogDescription>
//           </DialogHeader>
//           <StripePaymentModal onCancel={() => setIsPaymentModalOpen(false)} />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default TenantDashboard;
// // /**
// //  * TenantDashboard.jsx
// //  * The primary dashboard for a logged-in tenant, providing a clear financial summary,
// //  * a button to pay rent online, and a history of all past payments.
// //  */

// /**
//  * TenantDashboard.jsx
//  * The primary dashboard for a logged-in tenant, providing a clear financial summary,
//  * a an overview of recent maintenance requests, a button to pay rent online,
//  * and a history of all past payments.
//  */
// import React, { useState, useEffect, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { format, isPast } from "date-fns";

// // --- Redux Imports ---
// import { getMyLease, reset as resetLease } from "../features/lease/leaseSlice";
// import {
//   getMyPayments,
//   reset as resetPayments,
// } from "../features/payments/paymentSlice";
// import {
//   getTenantRequests,
//   reset as resetMaintenance,
// } from "../features/maintenance/maintenanceSlice";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Badge } from "@/components/ui/badge";
// import { DollarSign } from "lucide-react";

// // --- Custom Component Imports ---
// import StripePaymentModal from "../components/modals/StripePaymentModal";

// function TenantDashboard() {
//   const dispatch = useDispatch();
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   const { lease, isLoading: isLeaseLoading } = useSelector(
//     (state) => state.lease
//   );
//   const { paymentHistory, isLoading: isPaymentsLoading } = useSelector(
//     (state) => state.payments
//   );
//   const { requests: maintenanceRequests, isLoading: isMaintenanceLoading } =
//     useSelector((state) => state.maintenance);

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     if (user) {
//       dispatch(getMyLease());
//       dispatch(getMyPayments());
//       dispatch(getTenantRequests());
//     }
//     return () => {
//       dispatch(resetLease());
//       dispatch(resetPayments());
//       dispatch(resetMaintenance());
//     };
//   }, [dispatch, user]);

//   // --- Derived State & Calculations ---
//   const financialSummary = useMemo(() => {
//     if (!lease || !paymentHistory) return null;

//     const startDate = new Date(lease.startDate);
//     const today = new Date();

//     let monthsPassed = (today.getFullYear() - startDate.getFullYear()) * 12;
//     monthsPassed -= startDate.getMonth();
//     monthsPassed += today.getMonth();

//     const paymentPeriodsPassed = monthsPassed < 0 ? 0 : monthsPassed + 1;
//     const totalRentDue = paymentPeriodsPassed * lease.rentAmount;
//     const totalPaid = paymentHistory.reduce((acc, p) => acc + p.amount, 0);
//     const currentBalance = totalRentDue - totalPaid;

//     let nextDueDate = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       startDate.getDate()
//     );
//     if (isPast(nextDueDate)) {
//       nextDueDate.setMonth(nextDueDate.getMonth() + 1);
//     }

//     return { currentBalance, nextDueDate };
//   }, [lease, paymentHistory]);

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Pending":
//         return "destructive";
//       case "In Progress":
//         return "secondary";
//       case "Completed":
//         return "default";
//       default:
//         return "outline";
//     }
//   };

//   if (isLeaseLoading) {
//     return <div className="text-center p-10">Loading Your Dashboard...</div>;
//   }

//   return (
//     <>
//       <div className="space-y-8 p-4 md:p-8">
//         <header>
//           <h1 className="text-3xl font-bold">My Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           <div className="lg:col-span-1 space-y-8">
//             {/* --- Main Financial Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Rent Payment</CardTitle>
//                 {financialSummary && (
//                   <CardDescription>
//                     Next payment due on{" "}
//                     {format(financialSummary.nextDueDate, "MMMM dd, yyyy")}
//                   </CardDescription>
//                 )}
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {lease ? (
//                   <>
//                     <p className="text-4xl font-bold text-primary">
//                       $
//                       {(financialSummary?.currentBalance > 0
//                         ? financialSummary.currentBalance
//                         : lease.rentAmount
//                       ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </p>
//                     <Button
//                       onClick={() => setIsPaymentModalOpen(true)}
//                       className="w-full"
//                       size="lg"
//                     >
//                       <DollarSign className="mr-2 h-4 w-4" />
//                       Pay Rent Online
//                     </Button>
//                   </>
//                 ) : (
//                   <p className="text-muted-foreground pt-4">
//                     You do not currently have an active lease assigned.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>

//             {/* --- Maintenance Summary Card --- */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Recent Maintenance Requests</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {isMaintenanceLoading ? (
//                   <p>Loading requests...</p>
//                 ) : maintenanceRequests.length > 0 ? (
//                   <ul className="space-y-4">
//                     {maintenanceRequests.slice(0, 3).map((req) => (
//                       <li
//                         key={req._id}
//                         className="flex justify-between items-center"
//                       >
//                         <span
//                           className="text-sm truncate pr-2"
//                           title={req.description}
//                         >
//                           {req.description}
//                         </span>
//                         <Badge variant={getStatusBadgeVariant(req.status)}>
//                           {req.status}
//                         </Badge>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-muted-foreground text-center py-4">
//                     No recent requests found.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* --- Payment History Card --- */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment History</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Method</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {isPaymentsLoading ? (
//                       <TableRow>
//                         <TableCell colSpan={3} className="h-24 text-center">
//                           Loading history...
//                         </TableCell>
//                       </TableRow>
//                     ) : paymentHistory.length > 0 ? (
//                       paymentHistory.map((p) => (
//                         <TableRow key={p._id}>
//                           <TableCell className="font-medium">
//                             {format(new Date(p.paymentDate), "MMM dd, yyyy")}
//                           </TableCell>
//                           <TableCell>
//                             $
//                             {p.amount.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                             })}
//                           </TableCell>
//                           <TableCell>{p.method}</TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={3}
//                           className="h-24 text-center text-muted-foreground"
//                         >
//                           No payment history found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* --- Online Payment Modal --- */}
//       <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//         <DialogContent className="max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle>Online Rent Payment</DialogTitle>
//             <DialogDescription>
//               Your payment will be processed securely by Stripe.
//             </DialogDescription>
//           </DialogHeader>
//           <StripePaymentModal onCancel={() => setIsPaymentModalOpen(false)} />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default TenantDashboard;
// import React, { useState, useEffect, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { toast } from "react-toastify";
// import { format, isPast } from "date-fns";

// // --- Redux Imports ---
// import { getMyLease, reset as resetLease } from "../features/lease/leaseSlice";
// import {
//   getMyPayments,
//   reset as resetPayments,
// } from "../features/payments/paymentSlice";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { DollarSign } from "lucide-react";

// // --- Custom Component Imports ---
// import StripePaymentModal from "../components/modals/StripePaymentModal";

// function TenantDashboard() {
//   const dispatch = useDispatch();
//   const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   const { lease, isLoading: isLeaseLoading } = useSelector(
//     (state) => state.lease
//   );
//   const { paymentHistory, isLoading: isPaymentsLoading } = useSelector(
//     (state) => state.payments
//   );

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     if (user) {
//       dispatch(getMyLease());
//       dispatch(getMyPayments());
//     }
//     return () => {
//       dispatch(resetLease());
//       dispatch(resetPayments());
//     };
//   }, [dispatch, user]);

//   // --- Derived State & Calculations ---
//   const financialSummary = useMemo(() => {
//     if (!lease) return null;

//     const startDate = new Date(lease.startDate);
//     const today = new Date();

//     let monthsPassed = (today.getFullYear() - startDate.getFullYear()) * 12;
//     monthsPassed -= startDate.getMonth();
//     monthsPassed += today.getMonth();

//     const paymentPeriodsPassed = monthsPassed < 0 ? 0 : monthsPassed + 1;
//     const totalRentDue = paymentPeriodsPassed * lease.rentAmount;
//     const totalPaid = paymentHistory.reduce((acc, p) => acc + p.amount, 0);
//     const currentBalance = totalRentDue - totalPaid;

//     let nextDueDate = new Date(
//       today.getFullYear(),
//       today.getMonth(),
//       startDate.getDate()
//     );
//     if (isPast(nextDueDate)) {
//       nextDueDate.setMonth(nextDueDate.getMonth() + 1);
//     }

//     return {
//       totalRentDue,
//       totalPaid,
//       currentBalance,
//       nextDueDate,
//     };
//   }, [lease, paymentHistory]);

//   if (isLeaseLoading) {
//     return <div className="text-center p-10">Loading Your Dashboard...</div>;
//   }

//   return (
//     <>
//       <div className="space-y-8 p-4 md:p-8">
//         <header>
//           <h1 className="text-3xl font-bold">My Dashboard</h1>
//           <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
//           {/* --- Main Financial Card --- */}
//           <div className="lg:col-span-1">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Rent Payment</CardTitle>
//                 {financialSummary && (
//                   <CardDescription>
//                     Next payment due on{" "}
//                     {format(financialSummary.nextDueDate, "MMMM dd, yyyy")}
//                   </CardDescription>
//                 )}
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {lease ? (
//                   <>
//                     <p className="text-4xl font-bold text-primary">
//                       $
//                       {(financialSummary?.currentBalance > 0
//                         ? financialSummary.currentBalance
//                         : lease.rentAmount
//                       ).toLocaleString(undefined, { minimumFractionDigits: 2 })}
//                     </p>
//                     <Button
//                       onClick={() => setIsPaymentModalOpen(true)}
//                       className="w-full"
//                       size="lg"
//                     >
//                       <DollarSign className="mr-2 h-4 w-4" />
//                       Pay Rent Online
//                     </Button>
//                   </>
//                 ) : (
//                   <p className="text-muted-foreground pt-4">
//                     You do not currently have an active lease assigned. Please
//                     contact your landlord if you believe this is an error.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* --- Payment History Card --- */}
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Payment History</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>Amount</TableHead>
//                       <TableHead>Method</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {isPaymentsLoading ? (
//                       <TableRow>
//                         <TableCell colSpan={3} className="h-24 text-center">
//                           Loading history...
//                         </TableCell>
//                       </TableRow>
//                     ) : paymentHistory.length > 0 ? (
//                       paymentHistory.map((p) => (
//                         <TableRow key={p._id}>
//                           <TableCell className="font-medium">
//                             {format(new Date(p.paymentDate), "MMM dd, yyyy")}
//                           </TableCell>
//                           <TableCell>
//                             $
//                             {p.amount.toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                             })}
//                           </TableCell>
//                           <TableCell>{p.method}</TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell
//                           colSpan={3}
//                           className="h-24 text-center text-muted-foreground"
//                         >
//                           No payment history found.
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>

//       {/* --- Online Payment Modal --- */}
//       <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Online Rent Payment</DialogTitle>
//             <DialogDescription>
//               Your payment will be processed securely by Stripe.
//             </DialogDescription>
//           </DialogHeader>
//           <StripePaymentModal onCancel={() => setIsPaymentModalOpen(false)} />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }

// export default TenantDashboard;

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

//     // --- 1. Refactored Data Fetching Effect ---
//     // This effect now ONLY handles fetching data and only runs when the user changes.
//     useEffect(() => {
//         if (user) {
//             dispatch(getMyLease());
//             dispatch(getMyPayments());
//         }
//         // The cleanup function resets the Redux state when the component is unmounted.
//         return () => {
//             dispatch(resetLease());
//             dispatch(resetPayments());
//         };
//     }, [dispatch, user]);

//     // --- 2. NEW Effect for Handling Unexpected Errors ---
//     // This effect watches for errors and decides if a toast notification is necessary.
//     useEffect(() => {
//         // We only show a toast if it's a REAL error, not just a "404 Not Found" for the lease.
//         if (isLeaseError && leaseMessage !== 'No active lease found for this user.') {
//             toast.error(leaseMessage);
//         }
//         if (isPaymentsError) {
//             toast.error(paymentsMessage);
//         }
//     }, [isLeaseError, isPaymentsError, leaseMessage, paymentsMessage]);

//     // --- Handler Functions ---
//     const handlePaymentSuccess = () => {
//         setIsPaymentModalOpen(false);
//         toast.success("Payment successful! Your history will be updated shortly.");
//         dispatch(getMyPayments());
//     };

//     // --- 3. Refactored Render Logic ---
//     // The loading state is now handled cleanly at the top.
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
//                     // This card is now correctly shown when `lease` is null (i.e., a 404 was returned)
//                     <Card>
//                         <CardHeader><CardTitle>No Active Lease</CardTitle></CardHeader>
//                         <CardContent>
//                             <p className="text-muted-foreground">You do not currently have an active lease assigned to your account. If you have applied for a property, please wait for your landlord to approve the application.</p>
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
