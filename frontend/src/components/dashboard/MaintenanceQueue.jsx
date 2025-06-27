// src/components/dashboard/MaintenanceQueue.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLandlordRequests } from '@/features/maintenance/maintenanceSlice'; // Import the Redux action
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Link } from 'react-router-dom';

const MaintenanceQueue = () => {
    const dispatch = useDispatch();

    // 1. Get the full list of requests and loading status from the Redux store
    const { requests, isLoading } = useSelector((state) => state.maintenance);

    // 2. Fetch the data when the component first loads
    useEffect(() => {
        dispatch(getLandlordRequests());
    }, [dispatch]);

    // 3. Filter the requests to show only open ones and limit to the top 3 for the dashboard summary
    const priorityRequests = requests
        .filter(req => req.status !== 'Completed')
        .slice(0, 3);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Priority Maintenance Queue</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Request</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && priorityRequests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="2" className="h-24 text-center">Loading requests...</TableCell>
                            </TableRow>
                        ) : priorityRequests.length > 0 ? (
                            priorityRequests.map((req) => (
                                <TableRow key={req._id}>
                                    <TableCell>
                                        <div className="font-medium">{req.description}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {req.property?.address?.street || 'N/A'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                       <Badge variant={req.status === 'In Progress' ? 'secondary' : 'destructive'}>
                                            {req.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="2" className="h-24 text-center">
                                    No open maintenance requests.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link to="/landlord/maintenance">
                        View All Maintenance Requests <ArrowUpRight className="h-4 w-4 ml-2" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default MaintenanceQueue;

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