// src/components/dashboard/MaintenanceQueue.jsx

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLandlordRequests } from "@/features/maintenance/maintenanceSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrench, CheckCircle2, ArrowRight } from "lucide-react"; // Import new icons
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils"; // For conditional classes

// --- Helper Components for Cleanliness ---

// A small, colored dot to indicate priority
const PriorityIndicator = ({ priority }) => {
  return (
    <span
      className={cn("h-2.5 w-2.5 rounded-full", {
        "bg-red-500": priority === "High",
        "bg-yellow-500": priority === "Medium",
        "bg-green-500": priority === "Low",
        "bg-gray-400": !priority,
      })}
    />
  );
};

// Skeleton loader for a better loading experience
const LoadingSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-2.5 w-2.5 rounded-full" />
            <div className="flex-grow space-y-1.5">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-5 w-[90px] ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

// An engaging empty state for when the queue is clear
const EmptyState = () => (
  <TableRow>
    <TableCell colSpan="2" className="h-36 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <CheckCircle2 className="h-10 w-10 text-green-500" />
        <p className="text-lg font-medium">Queue Clear!</p>
        <p className="text-sm text-muted-foreground">
          No open maintenance requests found.
        </p>
      </div>
    </TableCell>
  </TableRow>
);

// --- Main Component ---

const MaintenanceQueue = () => {
  const dispatch = useDispatch();
  const { requests, isLoading } = useSelector((state) => state.maintenance);

  useEffect(() => {
    dispatch(getLandlordRequests());
  }, [dispatch]);

  // Sort by priority (assuming 'High', 'Medium', 'Low') then filter and slice
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };
  const openRequests = requests
    .filter((req) => req.status !== "Completed")
    .sort(
      (a, b) =>
        (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
    )
    .slice(0, 3);

  // Helper to assign badge colors based on status
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "New":
        return "destructive";
      case "In Progress":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wrench className="h-6 w-6 text-muted-foreground" />
          <CardTitle>Maintenance Queue</CardTitle>
        </div>
        <CardDescription>
          Top priority requests that need attention.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && openRequests.length === 0 ? (
              <LoadingSkeleton />
            ) : openRequests.length > 0 ? (
              openRequests.map((req) => (
                <TableRow key={req._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <PriorityIndicator priority={req.priority} />
                      <div>
                        <Link
                          to={`/landlord/maintenance/${req._id}`}
                          className="font-medium hover:underline leading-tight"
                        >
                          {req.description}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          {req.property?.address?.street || "N/A"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={getStatusBadgeVariant(req.status)}>
                      {req.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyState />
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <Link to="/landlord/maintenance">
            View All Requests <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MaintenanceQueue;

// // src/components/dashboard/MaintenanceQueue.jsx

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getLandlordRequests } from '@/features/maintenance/maintenanceSlice'; // Import the Redux action
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ArrowUpRight } from "lucide-react";
// import { Link } from 'react-router-dom';

// const MaintenanceQueue = () => {
//     const dispatch = useDispatch();

//     // 1. Get the full list of requests and loading status from the Redux store
//     const { requests, isLoading } = useSelector((state) => state.maintenance);

//     // 2. Fetch the data when the component first loads
//     useEffect(() => {
//         dispatch(getLandlordRequests());
//     }, [dispatch]);

//     // 3. Filter the requests to show only open ones and limit to the top 3 for the dashboard summary
//     const priorityRequests = requests
//         .filter(req => req.status !== 'Completed')
//         .slice(0, 3);

//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Priority Maintenance Queue</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Request</TableHead>
//                             <TableHead>Status</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {isLoading && priorityRequests.length === 0 ? (
//                             <TableRow>
//                                 <TableCell colSpan="2" className="h-24 text-center">Loading requests...</TableCell>
//                             </TableRow>
//                         ) : priorityRequests.length > 0 ? (
//                             priorityRequests.map((req) => (
//                                 <TableRow key={req._id}>
//                                     <TableCell>
//                                         <div className="font-medium">{req.description}</div>
//                                         <div className="text-sm text-muted-foreground">
//                                             {req.property?.address?.street || 'N/A'}
//                                         </div>
//                                     </TableCell>
//                                     <TableCell>
//                                        <Badge variant={req.status === 'In Progress' ? 'secondary' : 'destructive'}>
//                                             {req.status}
//                                         </Badge>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow>
//                                 <TableCell colSpan="2" className="h-24 text-center">
//                                     No open maintenance requests.
//                                 </TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </CardContent>
//             <CardFooter>
//                 <Button variant="outline" size="sm" className="w-full" asChild>
//                     <Link to="/landlord/maintenance">
//                         View All Maintenance Requests <ArrowUpRight className="h-4 w-4 ml-2" />
//                     </Link>
//                 </Button>
//             </CardFooter>
//         </Card>
//     );
// };

// export default MaintenanceQueue;

// // src/components/dashboard/MaintenanceQueue.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { ArrowUpRight } from "lucide-react";

// // --- Mock Data: This will be replaced by props from Redux later ---
// const mockRequests = [
//   { id: 'm1', request: 'Major leak under kitchen...', unit: '#m1230 - Unit 401', priority: 'High', status: 'Open' },
//   { id: 'm2', request: 'Heating system not workin...', unit: '#m1235 - Unit 103', priority: 'High', status: 'In Progress' },
//   { id: 'm3', request: 'Window broken in common...', unit: '#m1240 - Common Area', priority: 'Medium', status: 'Open' },
// ];
// // --- End of Mock Data ---

// const MaintenanceQueue = () => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Priority Maintenance Queue</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Request / Unit</TableHead>
//               <TableHead>Priority</TableHead>
//               <TableHead>Status</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {mockRequests.map((req) => (
//               <TableRow key={req.id}>
//                 <TableCell>
//                   <div className="font-medium">{req.request}</div>
//                   <div className="text-sm text-muted-foreground">{req.unit}</div>
//                 </TableCell>
//                 <TableCell>
//                   <Badge variant={req.priority === 'High' ? 'destructive' : 'secondary'}>
//                     {req.priority}
//                   </Badge>
//                 </TableCell>
//                 <TableCell>
//                    <Badge variant="outline">{req.status}</Badge>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </CardContent>
//       <CardFooter>
//         <Button variant="outline" size="sm" className="w-full">
//             View All Priority Requests <ArrowUpRight className="h-4 w-4 ml-2" />
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default MaintenanceQueue;
