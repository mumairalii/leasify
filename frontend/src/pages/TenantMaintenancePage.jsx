import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createRequest, getTenantRequests, reset } from '../features/maintenance/maintenanceSlice';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function TenantMaintenancePage() {
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { requests, isLoading, isError, message } = useSelector(
        (state) => state.maintenance
    );

    // This is the corrected useEffect. It depends on `user` to ensure it has a token.
    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        // Only fetch requests if a user is logged in.
        if(user) {
            dispatch(getTenantRequests());
        }
        return () => {
            dispatch(reset());
        };
    }, [user, dispatch, isError, message]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!description) {
            toast.error('Please enter a description.');
            return;
        }
        dispatch(createRequest({ description }))
            .unwrap()
            .then(() => {
                toast.success('Request submitted successfully!');
                setDescription('');
            })
            .catch((errorMsg) => {
                toast.error(errorMsg || 'Failed to submit request.');
            });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-foreground">Maintenance Center</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Submit a New Request</CardTitle>
                    <CardDescription>If you have an issue, please describe it in detail below.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <Textarea
                                placeholder="e.g., The kitchen sink is leaking under the cabinet."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                required
                            />
                            <Button type="submit" className="w-full sm:w-auto justify-self-end" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <h2 className="text-2xl font-semibold my-6 text-foreground">Your Request History</h2>
            <Card>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && requests.length === 0 ? (
                             <TableRow><TableCell colSpan="3" className="text-center py-10">Loading history...</TableCell></TableRow>
                        ) : requests && requests.length > 0 ? requests.map((req) => (
                            <TableRow key={req._id}>
                                <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell>{req.description}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        req.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 
                                        req.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 
                                        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                                    }`}>
                                        {req.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan="3" className="text-center text-muted-foreground py-10">You have no maintenance requests.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}

export default TenantMaintenancePage;

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { createRequest, getTenantRequests, reset } from '../features/maintenance/maintenanceSlice';
// import { toast } from 'react-toastify';
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// function TenantMaintenancePage() {
//     const [description, setDescription] = useState('');
//     const dispatch = useDispatch();

//     const { requests, isLoading, isError, message } = useSelector(
//         (state) => state.maintenance
//     );

//     // This useEffect fetches the tenant's request history when the page first loads
//     useEffect(() => {
//         dispatch(getTenantRequests());
//     }, [dispatch]);

//     // This is the updated, more robust onSubmit function
//     const onSubmit = (e) => {
//         e.preventDefault();
//         if (!description) {
//             toast.error('Please enter a description for your request.');
//             return;
//         }

//         // We dispatch the createRequest action
//         dispatch(createRequest({ description }))
//             .unwrap() // .unwrap() allows us to handle the promise directly here
//             .then(() => {
//                 // This code runs ONLY if the request was successful
//                 toast.success('Request submitted successfully!');
//                 setDescription(''); // Clear the form
//             })
//             .catch((errorMsg) => {
//                 // This code runs ONLY if the request failed
//                 toast.error(errorMsg || 'Failed to submit request.');
//             });
//     };

//     // Show a loading indicator for the table on initial load
//     if (isLoading && requests.length === 0) {
//         return <h1 className="text-center text-2xl mt-10">Loading...</h1>;
//     }

//     return (
//         <div className="max-w-4xl mx-auto">
//             <h1 className="text-3xl font-bold mb-6">Maintenance Center</h1>
            
//             {/* Form to Create New Request */}
//             <Card className="mb-8">
//                 <CardHeader>
//                     <CardTitle>Submit a New Request</CardTitle>
//                     <CardDescription>If you have an issue, please describe it in detail below.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={onSubmit}>
//                         <div className="grid gap-4">
//                             <Textarea
//                                 placeholder="e.g., The kitchen sink is leaking under the cabinet."
//                                 value={description}
//                                 onChange={(e) => setDescription(e.target.value)}
//                                 rows={4}
//                                 required
//                             />
//                             <Button type="submit" className="w-full sm:w-auto justify-self-end" disabled={isLoading}>
//                                 {isLoading ? 'Submitting...' : 'Submit Request'}
//                             </Button>
//                         </div>
//                     </form>
//                 </CardContent>
//             </Card>

//             {/* Table to Display Request History */}
//             <h2 className="text-2xl font-semibold mb-4">Your Request History</h2>
//             <Card>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Date</TableHead>
//                             <TableHead>Description</TableHead>
//                             <TableHead>Status</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {requests && requests.length > 0 ? requests.map((req) => (
//                             <TableRow key={req._id}>
//                                 <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
//                                 <TableCell className="whitespace-pre-wrap break-words">{req.description}</TableCell>
//                                 <TableCell>
//                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                                         req.status === 'Completed' ? 'bg-green-100 text-green-800' : 
//                                         req.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
//                                         'bg-red-100 text-red-800'
//                                     }`}>
//                                         {req.status}
//                                     </span>
//                                 </TableCell>
//                             </TableRow>
//                         )) : (
//                             <TableRow>
//                                 <TableCell colSpan="3" className="text-center text-gray-500 py-10">You have no maintenance requests.</TableCell>
//                             </TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </Card>
//         </div>
//     );
// }

// export default TenantMaintenancePage;


// // import { useSelector, useDispatch } from 'react-redux';
// // import { createRequest, getTenantRequests, reset } from '../features/maintenance/maintenanceSlice';
// // import { toast } from 'react-toastify';
// // import { Button } from "@/components/ui/button";
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// // function TenantMaintenancePage() {
// //     const [description, setDescription] = useState('');
// //     const dispatch = useDispatch();

// //     const { requests, isLoading, isError, message } = useSelector(
// //         (state) => state.maintenance
// //     );

// //     // This useEffect fetches the tenant's request history when the page loads
// //     useEffect(() => {
// //         dispatch(getTenantRequests());
// //     }, [dispatch]);

// //     // This useEffect handles error notifications
// //     useEffect(() => {
// //         if (isError) {
// //             toast.error(message);
// //             dispatch(reset());
// //         }
// //     }, [isError, message, dispatch]);

// //     const onSubmit = (e) => {
// //         e.preventDefault();
// //         if (!description) {
// //             toast.error('Please enter a description for your request.');
// //             return;
// //         }
// //         dispatch(createRequest({ description }))
// //             .unwrap()
// //             .then(() => {
// //                 toast.success('Request submitted successfully!');
// //                 setDescription('');
// //                 // No need to manually refetch, the fulfilled reducer already adds it to the list!
// //             })
// //             .catch((error) => {
// //                 toast.error(error || 'Failed to submit request.');
// //             });
// //     };

// //     return (
// //         <div className="max-w-4xl mx-auto">
// //             <h1 className="text-3xl font-bold mb-6">Maintenance Center</h1>
            
// //             <Card className="mb-8">
// //                 <CardHeader>
// //                     <CardTitle>Submit a New Request</CardTitle>
// //                     <CardDescription>If you have an issue, please describe it in detail below.</CardDescription>
// //                 </CardHeader>
// //                 <CardContent>
// //                     <form onSubmit={onSubmit}>
// //                         <div className="grid gap-4">
// //                             <Textarea
// //                                 placeholder="e.g., The kitchen sink is leaking under the cabinet."
// //                                 value={description}
// //                                 onChange={(e) => setDescription(e.target.value)}
// //                                 rows={4}
// //                                 required
// //                             />
// //                             <Button type="submit" className="w-full sm:w-auto justify-self-end" disabled={isLoading}>
// //                                 {isLoading ? 'Submitting...' : 'Submit Request'}
// //                             </Button>
// //                         </div>
// //                     </form>
// //                 </CardContent>
// //             </Card>

// //             <h2 className="text-2xl font-semibold mb-4">Your Request History</h2>
// //             <Card>
// //                 <Table>
// //                     <TableHeader>
// //                         <TableRow>
// //                             <TableHead>Date</TableHead>
// //                             <TableHead>Description</TableHead>
// //                             <TableHead>Status</TableHead>
// //                         </TableRow>
// //                     </TableHeader>
// //                     <TableBody>
// //                         {isLoading && requests.length === 0 ? (
// //                              <TableRow><TableCell colSpan="3" className="text-center py-10">Loading history...</TableCell></TableRow>
// //                         ) : requests && requests.length > 0 ? requests.map((req) => (
// //                             <TableRow key={req._id}>
// //                                 <TableCell>{new Date(req.createdAt).toLocaleDateString()}</TableCell>
// //                                 <TableCell className="whitespace-pre-wrap break-words">{req.description}</TableCell>
// //                                 <TableCell>
// //                                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
// //                                         req.status === 'Completed' ? 'bg-green-100 text-green-800' : 
// //                                         req.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
// //                                         'bg-red-100 text-red-800'
// //                                     }`}>
// //                                         {req.status}
// //                                     </span>
// //                                 </TableCell>
// //                             </TableRow>
// //                         )) : (
// //                             <TableRow>
// //                                 <TableCell colSpan="3" className="text-center text-gray-500 py-10">You have no maintenance requests.</TableCell>
// //                             </TableRow>
// //                         )}
// //                     </TableBody>
// //                 </Table>
// //             </Card>
// //         </div>
// //     );
// // }

// // export default TenantMaintenancePage;

