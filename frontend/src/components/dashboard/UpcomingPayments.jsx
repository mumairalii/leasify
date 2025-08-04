import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUpcomingPayments } from "@/features/tenants/tenantSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { format } from "date-fns";
import { CalendarDays, CheckCircle2 } from "lucide-react"; // Import icons

// --- Helper Components for Cleanliness ---

// A more visually appealing loading state using Skeletons
const LoadingSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-3 w-[130px]" />
          </div>
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-5 w-[70px] ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

// A more engaging empty state when no payments are due
const EmptyState = () => (
  <TableRow>
    <TableCell colSpan="3" className="h-48 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <p className="text-lg font-medium text-muted-foreground">
          All Caught Up!
        </p>
        <p className="text-sm text-muted-foreground">
          There are no upcoming payments.
        </p>
      </div>
    </TableCell>
  </TableRow>
);

// --- Main Component ---

const UpcomingPayments = () => {
  const dispatch = useDispatch();
  const { upcomingPayments, isUpcomingLoading } = useSelector(
    (state) => state.tenants
  );

  useEffect(() => {
    dispatch(getUpcomingPayments());
  }, [dispatch]);

  const formatDueDate = (days) => {
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    if (days === 1) return "Due tomorrow";
    return `Due in ${days} days`;
  };

  // Helper to determine the badge color based on urgency
  const getStatusBadgeVariant = (days) => {
    if (days < 0) return "destructive";
    if (days === 0) return "destructive";
    if (days <= 7) return "secondary"; // Using secondary for a subtle warning
    return "outline"; // Or "default" if you prefer
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <CalendarDays className="h-6 w-6 text-muted-foreground" />
          <CardTitle>Upcoming Payments</CardTitle>
        </div>
        <CardDescription>A summary of rent payments due soon.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant / Unit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isUpcomingLoading ? (
              <LoadingSkeleton />
            ) : upcomingPayments && upcomingPayments.length > 0 ? (
              upcomingPayments.map((tenant) => (
                <TableRow key={tenant.tenantId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {tenant.unit}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge
                        variant={getStatusBadgeVariant(tenant.daysUntilDue)}
                        className="w-fit"
                      >
                        {formatDueDate(tenant.daysUntilDue)}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(tenant.dueDate), "EEEE, MMM dd")}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono font-medium">
                    ${tenant.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyState />
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UpcomingPayments;

// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getUpcomingPayments } from "@/features/tenants/tenantSlice";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { format } from "date-fns";

// const UpcomingPayments = () => {
//   const dispatch = useDispatch();
//   const { upcomingPayments, isUpcomingLoading } = useSelector(
//     (state) => state.tenants
//   );

//   useEffect(() => {
//     dispatch(getUpcomingPayments());
//   }, [dispatch]);

//   const formatDueDate = (days) => {
//     if (days === 0) return "Due today";
//     if (days === 1) return "Due tomorrow";
//     return `Due in ${days} days`;
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Upcoming Payments</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Tenant / Unit</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Amount</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isUpcomingLoading ? (
//               <TableRow>
//                 <TableCell colSpan="3" className="h-24 text-center">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : upcomingPayments && upcomingPayments.length > 0 ? (
//               upcomingPayments.map((tenant) => (
//                 <TableRow key={tenant.tenantId}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-9 w-9">
//                         <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <div className="font-medium">{tenant.name}</div>
//                         <div className="text-sm text-muted-foreground">
//                           {tenant.unit}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="font-medium">
//                       {formatDueDate(tenant.daysUntilDue)}
//                     </div>
//                     <div className="text-xs text-muted-foreground">
//                       {format(new Date(tenant.dueDate), "EEEE, MMM dd")}
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     ${tenant.amount.toLocaleString()}
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan="3"
//                   className="h-24 text-center text-muted-foreground"
//                 >
//                   No upcoming payments found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default UpcomingPayments;
