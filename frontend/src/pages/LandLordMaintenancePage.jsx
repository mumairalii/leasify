import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getLandlordRequests, updateRequest, deleteRequest, reset } from '../features/maintenance/maintenanceSlice';
import { toast } from 'react-toastify';

// Import the necessary shadcn/ui components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

function LandLordMaintenancePage() {
    const dispatch = useDispatch();
    const { requests, isLoading, isError, isSuccess, message } = useSelector((state) => state.maintenance);

    useEffect(() => {
        // Fetch initial data
        dispatch(getLandlordRequests());
        
        // Cleanup function to reset state when the component unmounts
        return () => {
            dispatch(reset());
        };
    }, [dispatch]); // Only run this effect once on mount

    useEffect(() => {
        // This effect handles showing error toasts when they occur
        if (isError) {
            toast.error(message || 'An error occurred.');
        }
    }, [isError, message]);

    const handleStatusChange = (id, newStatus) => {
        dispatch(updateRequest({ id, status: newStatus }))
            .unwrap()
            .then(() => toast.success(`Request updated to "${newStatus}"`))
            .catch((error) => toast.error(error.message || 'Failed to update status.'));
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to permanently delete this request?')) {
            dispatch(deleteRequest(id))
                .unwrap()
                .then(() => toast.success("Request deleted successfully."))
                .catch((error) => toast.error(error.message || 'Failed to delete request.'));
        }
    };

    // A cleaner loading state
    if (isLoading && requests.length === 0) {
        return <div className="text-center p-10">Loading requests...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Maintenance Requests</CardTitle>
                    <CardDescription>
                        View and manage all maintenance requests from your tenants.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Issue Description</TableHead>
                                <TableHead>Tenant</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {requests && requests.length > 0 ? (
                                requests.map(req => (
                                    <TableRow key={req._id}>
                                        <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="font-medium">{req.property?.address?.street || 'N/A'}</TableCell>
                                        <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                                        <TableCell>{req.tenant?.name || 'N/A'}</TableCell>
                                        <TableCell>
                                            {/* Badge component for better visual status */}
                                            <Badge variant={
                                                req.status === 'Completed' ? 'default' : 
                                                req.status === 'In Progress' ? 'secondary' : 'destructive'
                                            }>
                                                {req.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {/* DropdownMenu for a cleaner action interface */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(req._id, 'Pending')}>
                                                        Mark as Pending
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(req._id, 'In Progress')}>
                                                        Mark as In Progress
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(req._id, 'Completed')}>
                                                        Mark as Completed
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem 
                                                        className="text-destructive focus:text-destructive"
                                                        onClick={() => handleDelete(req._id)}
                                                    >
                                                        Delete Request
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="6" className="h-24 text-center text-muted-foreground">
                                        No maintenance requests found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

export default LandLordMaintenancePage;

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// // --- 1. THE IMPORT FIX: Importing the correctly named 'getLandlordRequests' ---
// import { getLandlordRequests, updateRequest, deleteRequest, reset } from '../features/maintenance/maintenanceSlice';
// import { toast } from 'react-toastify';

// function LandlordMaintenancePage() {
//     const dispatch = useDispatch();
//     const { requests, isLoading, isError, message } = useSelector((state) => state.maintenance);

//     useEffect(() => {
//         if (isError) {
//             toast.error(message);
//         }
        
//         // --- 2. THE DISPATCH FIX: Calling the correctly named 'getLandlordRequests' ---
//         dispatch(getLandlordRequests());
        
//         return () => {
//             dispatch(reset());
//         };
//     }, [dispatch, isError, message]);

//     const handleStatusChange = (id, newStatus) => {
//         toast.info("Updating status...");
//         dispatch(updateRequest({ id, status: newStatus }));
//     };

//     const handleDelete = (id) => {
//         if (window.confirm('Are you sure you want to delete this request?')) {
//             dispatch(deleteRequest(id));
//             toast.success("Request deleted.");
//         }
//     };

//     if (isLoading && (!requests || requests.length === 0)) {
//         return <h1 className="text-center text-2xl mt-10">Loading Requests...</h1>;
//     }

//     return (
//         <div className="p-4 md:p-8 max-w-7xl mx-auto">
//             <h1 className="text-3xl font-bold mb-6">Manage Maintenance Requests</h1>
//             <div className="bg-white shadow-md rounded-lg overflow-x-auto">
//                 <table className="min-w-full leading-normal">
//                     <thead>
//                         <tr>
//                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
//                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
//                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue</th>
//                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tenant</th>
//                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
//                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {requests && requests.length > 0 ? requests.map(req => (
//                             <tr key={req._id}>
//                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
//                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.property?.address?.street || 'N/A'}</td>
//                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><p className="text-gray-900 whitespace-no-wrap">{req.description}</p></td>
//                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.tenant?.name || 'N/A'}</td>
//                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
//                                     <select 
//                                         value={req.status} 
//                                         onChange={(e) => handleStatusChange(req._id, e.target.value)}
//                                         className="border-gray-300 rounded-md shadow-sm p-2 bg-white"
//                                     >
//                                         <option>Pending</option>
//                                         <option>In Progress</option>
//                                         <option>Completed</option>
//                                     </select>
//                                 </td>
//                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
//                                     <button onClick={() => handleDelete(req._id)} className="text-red-600 hover:text-red-900 font-semibold">
//                                         Delete
//                                     </button>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr><td colSpan="6" className="text-center py-10 text-gray-500">No maintenance requests found.</td></tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

// export default LandlordMaintenancePage;


// // import React, { useEffect } from 'react';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { getRequests, updateRequest, reset } from '../features/maintenance/maintenanceSlice';
// // import { toast } from 'react-toastify';

// // function LandlordMaintenancePage() {
// //     const dispatch = useDispatch();
// //     const { requests, isLoading, isError, message } = useSelector((state) => state.maintenance);

// //     useEffect(() => {
// //         if (isError) {
// //             toast.error(message);
// //         }
// //         dispatch(getRequests());
// //         return () => { dispatch(reset()); };
// //     }, [dispatch, isError, message]);

// //     const handleStatusChange = (id, newStatus) => {
// //         dispatch(updateRequest({ id, status: newStatus }));
// //     };

// //     if (isLoading && requests.length === 0) {
// //         return <h1>Loading Requests...</h1>;
// //     }

// //     return (
// //         <div className="p-4 md:p-8 max-w-7xl mx-auto">
// //             <h1 className="text-3xl font-bold mb-6">Manage Maintenance Requests</h1>
// //             <div className="bg-white shadow-md rounded-lg overflow-hidden">
// //                 <table className="min-w-full leading-normal">
// //                     <thead>
// //                         <tr>
// //                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date Submitted</th>
// //                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Property</th>
// //                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Issue Description</th>
// //                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
// //                             <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
// //                         </tr>
// //                     </thead>
// //                     <tbody>
// //                         {requests.length > 0 ? requests.map(req => (
// //                             <tr key={req._id}>
// //                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{new Date(req.createdAt).toLocaleDateString()}</td>
// //                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.property?.address?.street || 'N/A'}</td>
// //                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{req.description}</td>
// //                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
// //                                     <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${req.status === 'Completed' ? 'text-green-900' : 'text-yellow-900'}`}>
// //                                         <span aria-hidden className={`absolute inset-0 ${req.status === 'Completed' ? 'bg-green-200' : 'bg-yellow-200'} opacity-50 rounded-full`}></span>
// //                                         <span className="relative">{req.status}</span>
// //                                     </span>
// //                                 </td>
// //                                 <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
// //                                     {req.status !== 'Completed' && (
// //                                         <button onClick={() => handleStatusChange(req._id, 'Completed')} className="text-indigo-600 hover:text-indigo-900">
// //                                             Mark as Completed
// //                                         </button>
// //                                     )}
// //                                 </td>
// //                             </tr>
// //                         )) : (
// //                             <tr><td colSpan="5" className="text-center py-10">No maintenance requests found.</td></tr>
// //                         )}
// //                     </tbody>
// //                 </table>
// //             </div>
// //         </div>
// //     );
// // }

// // export default LandlordMaintenancePage;