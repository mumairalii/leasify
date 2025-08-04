import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getOverdueTenants } from "@/features/tenants/tenantSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, HandCoins, ClipboardX, ArrowRight } from "lucide-react"; // Import new icons

// --- Helper Components for Cleanliness ---

// A skeleton loader that matches the table's layout
const LoadingSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <TableRow key={i} className="border-x-0">
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
          <Skeleton className="h-5 w-[110px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-5 w-[70px] ml-auto" />
        </TableCell>
        <TableCell />
      </TableRow>
    ))}
  </>
);

// An engaging empty state for when all payments are current
const EmptyState = () => (
  <TableRow>
    <TableCell colSpan={4} className="h-40">
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <ClipboardX className="h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-medium text-muted-foreground">
          No Overdue Payments
        </p>
        <p className="text-sm text-muted-foreground">
          All tenants are up-to-date. Great work!
        </p>
      </div>
    </TableCell>
  </TableRow>
);

// --- Main Component ---

const OverdueTenants = ({ onLogPayment }) => {
  const dispatch = useDispatch();
  const { overdueTenants, isLoading } = useSelector((state) => state.tenants);

  useEffect(() => {
    dispatch(getOverdueTenants());
  }, [dispatch]);

  return (
    // Replaced custom border/bg with theme-aware `card` styles for consistency
    <div className="border bg-card text-card-foreground rounded-lg shadow-sm">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <div>
              <h3 className="text-lg font-semibold">Overdue Tenants</h3>
              <p className="text-sm text-muted-foreground">
                Tenants with outstanding payments requiring action.
              </p>
            </div>
          </div>
          {overdueTenants?.length > 0 && (
            <Badge variant="destructive" className="flex-shrink-0">
              {overdueTenants.length} Overdue
            </Badge>
          )}
        </div>

        {/* Removed the inner border, the main container provides it now */}
        <div className="rounded-md border">
          <Table>
            {/* Removed the custom bg from header for a cleaner, default look */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Tenant / Unit</TableHead>
                <TableHead className="w-[20%]">Status</TableHead>
                <TableHead className="w-[20%] text-right">Amount Due</TableHead>
                <TableHead className="w-[20%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <LoadingSkeleton />
              ) : overdueTenants?.length > 0 ? (
                overdueTenants.map((tenant) => (
                  <TableRow
                    key={tenant.leaseId}
                    className="group hover:bg-muted/50"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback>
                            {tenant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            to={`/landlord/tenants/${tenant.tenantId}`}
                            className="font-medium hover:underline"
                          >
                            {tenant.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">
                            {tenant.unit}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="destructive">
                        {tenant.days} days overdue
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      ${tenant.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* Using a better icon and more direct color class */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8  transition-opacity text-destructive"
                        onClick={() => onLogPayment(tenant)}
                      >
                        <HandCoins className="h-4 w-4 mr-2" />
                        Log Payment
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <EmptyState />
              )}
            </TableBody>
          </Table>
        </div>

        {overdueTenants?.length > 5 && (
          <div className="text-right mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary"
              asChild
            >
              <Link to="/landlord/tenants?filter=overdue">
                View All Overdue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OverdueTenants;

// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { getOverdueTenants } from "@/features/tenants/tenantSlice";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { DollarSign } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// const OverdueTenants = ({ onLogPayment }) => {
//   const dispatch = useDispatch();
//   const { overdueTenants, isLoading } = useSelector((state) => state.tenants);

//   useEffect(() => {
//     dispatch(getOverdueTenants());
//   }, [dispatch]);

//   return (
//     <div className="border border-red-500/20 dark:border-red-500/30 rounded-lg bg-white dark:bg-gray-900">
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-black dark:text-gray-200">
//             Overdue Tenants
//           </h3>
//           <Badge variant="destructive" className="px-2 py-1 text-xs">
//             {overdueTenants?.length || 0} overdue
//           </Badge>
//         </div>

//         <div className="border rounded-md">
//           <Table>
//             <TableHeader className="bg-gray-50 dark:bg-gray-800">
//               <TableRow>
//                 <TableHead className="w-[40%]">Tenant / Unit</TableHead>
//                 <TableHead className="w-[20%]">Status</TableHead>
//                 <TableHead className="w-[20%] text-right">Amount</TableHead>
//                 <TableHead className="w-[20%] text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-24 text-center">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : overdueTenants?.length > 0 ? (
//                 overdueTenants.map((tenant) => (
//                   <TableRow
//                     key={tenant.leaseId}
//                     className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
//                   >
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback className="text-xs">
//                             {tenant.name.charAt(0)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <Link
//                             to={`/landlord/tenants/${tenant.tenantId}`}
//                             className="font-medium hover:underline text-sm text-black dark:text-gray-200"
//                           >
//                             {tenant.name}
//                           </Link>
//                           <div className="text-xs text-muted-foreground">
//                             {tenant.unit}
//                           </div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="destructive" className="text-xs">
//                         {tenant.days} days overdue
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right font-medium text-black dark:text-gray-200">
//                       ${tenant.amount.toLocaleString()}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 dark:text-red-400"
//                         onClick={() => onLogPayment(tenant)}
//                       >
//                         <DollarSign className="h-4 w-4 mr-2" />
//                         Log Payment
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={4}
//                     className="h-24 text-center text-muted-foreground"
//                   >
//                     No overdue tenants found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {overdueTenants?.length > 5 && (
//           <div className="text-right mt-4">
//             <Button
//               variant="link"
//               size="sm"
//               className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
//               asChild
//             >
//               <Link to="/landlord/tenants?filter=overdue">
//                 View all overdue tenants
//               </Link>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OverdueTenants;
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { getOverdueTenants } from "@/features/tenants/tenantSlice";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { DollarSign } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// const OverdueTenants = ({ onLogPayment }) => {
//   const dispatch = useDispatch();
//   const { overdueTenants, isLoading } = useSelector((state) => state.tenants);

//   useEffect(() => {
//     dispatch(getOverdueTenants());
//   }, [dispatch]);

//   return (
//     <div className="relative overflow-hidden border border-red-500/20 dark:border-red-500/30 rounded-lg bg-white dark:bg-gray-900">
//       {/* Left accent bar */}
//       <div className="absolute left-0 top-0 h-full w-[2px] bg-red-500"></div>

//       <div className="p-6">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-lg font-semibold text-black dark:text-gray-200">
//             Overdue Tenants
//           </h3>
//           <Badge variant="destructive" className="px-2 py-1 text-xs">
//             {overdueTenants?.length || 0} overdue
//           </Badge>
//         </div>

//         <div className="border rounded-md">
//           <Table>
//             <TableHeader className="bg-gray-50 dark:bg-gray-800">
//               <TableRow>
//                 <TableHead className="w-[40%]">Tenant / Unit</TableHead>
//                 <TableHead className="w-[20%]">Status</TableHead>
//                 <TableHead className="w-[20%] text-right">Amount</TableHead>
//                 <TableHead className="w-[20%] text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {isLoading ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="h-24 text-center">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : overdueTenants && overdueTenants.length > 0 ? (
//                 overdueTenants.map((tenant) => (
//                   <TableRow
//                     key={tenant.leaseId}
//                     className="group hover:bg-gray-50 dark:hover:bg-gray-800/50"
//                   >
//                     <TableCell>
//                       <div className="flex items-center gap-3">
//                         <Avatar className="h-8 w-8">
//                           <AvatarFallback className="text-xs">
//                             {tenant.name.charAt(0)}
//                           </AvatarFallback>
//                         </Avatar>
//                         <div>
//                           <Link
//                             to={`/landlord/tenants/${tenant.tenantId}`}
//                             className="font-medium hover:underline text-sm text-black dark:text-gray-200"
//                           >
//                             {tenant.name}
//                           </Link>
//                           <div className="text-xs text-muted-foreground">
//                             {tenant.unit}
//                           </div>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="destructive" className="text-xs">
//                         {tenant.days} days overdue
//                       </Badge>
//                     </TableCell>
//                     <TableCell className="text-right font-medium text-black dark:text-gray-200">
//                       ${tenant.amount.toLocaleString()}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <Button
//                         variant="ghost"
//                         size="sm"
//                         className="h-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-600 dark:text-red-400"
//                         onClick={() => onLogPayment(tenant)}
//                       >
//                         <DollarSign className="h-4 w-4 mr-2" />
//                         Log Payment
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={4}
//                     className="h-24 text-center text-muted-foreground"
//                   >
//                     No overdue tenants found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>

//         {overdueTenants?.length > 5 && (
//           <div className="text-right mt-4">
//             <Button
//               variant="link"
//               size="sm"
//               className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
//               asChild
//             >
//               <Link to="/landlord/tenants?filter=overdue">
//                 View all overdue tenants
//               </Link>
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OverdueTenants;

// // src/components/dashboard/OverdueTenants.jsx
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { Link } from "react-router-dom";
// import { getOverdueTenants } from "@/features/tenants/tenantSlice";
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
// import { Button } from "@/components/ui/button";
// import { DollarSign } from "lucide-react";

// const OverdueTenants = ({ onLogPayment }) => {
//   const dispatch = useDispatch();
//   const { overdueTenants, isLoading } = useSelector((state) => state.tenants);

//   useEffect(() => {
//     dispatch(getOverdueTenants());
//   }, [dispatch]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Overdue Tenants</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Tenant / Unit</TableHead>
//               <TableHead>Days Overdue</TableHead>
//               <TableHead className="text-right">Amount Owed</TableHead>
//               <TableHead className="text-center">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan="4" className="h-24 text-center">
//                   Loading...
//                 </TableCell>
//               </TableRow>
//             ) : overdueTenants && overdueTenants.length > 0 ? (
//               overdueTenants.map((tenant) => (
//                 <TableRow key={tenant.leaseId}>
//                   <TableCell>
//                     <div className="flex items-center gap-3">
//                       <Avatar className="h-9 w-9">
//                         <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <Link
//                           to={`/landlord/tenants/${tenant.tenantId}`}
//                           className="font-medium hover:underline"
//                         >
//                           {tenant.name}
//                         </Link>
//                         <div className="text-sm text-muted-foreground">
//                           {tenant.unit}
//                         </div>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <div className="font-medium text-destructive">
//                       {tenant.days} days
//                     </div>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     ${tenant.amount.toLocaleString()}
//                   </TableCell>
//                   <TableCell className="text-center">
//                     <div className="flex items-center justify-center gap-1">
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         aria-label="Log payment"
//                         onClick={() => onLogPayment(tenant)}
//                       >
//                         <DollarSign className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan="4"
//                   className="h-24 text-center text-muted-foreground"
//                 >
//                   No overdue tenants found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//     </Card>
//   );
// };

// export default OverdueTenants;
