// src/components/dashboard/OverdueTenants.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOverdueTenants } from '@/features/tenants/tenantSlice';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare, DollarSign } from "lucide-react";

const OverdueTenants = ({ onLogPayment }) => {
    const dispatch = useDispatch();

    // Get the live data and loading status from the Redux store
    const { overdueTenants, isLoading } = useSelector((state) => state.tenants);

    // Fetch the data when the component first loads
    useEffect(() => {
        dispatch(getOverdueTenants());
    }, [dispatch]);
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Overdue Tenants</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tenant / Unit</TableHead>
                            <TableHead>Days Overdue (Est.)</TableHead>
                            <TableHead className="text-right">Amount Owed</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan="4" className="h-24 text-center">Loading overdue tenants...</TableCell>
                            </TableRow>
                        ) : overdueTenants.length > 0 ? (
                            overdueTenants.map((tenant) => (
                                <TableRow key={tenant.leaseId}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9"><AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback></Avatar>
                                            <div>
                                                <div className="font-medium">{tenant.name}</div>
                                                <div className="text-sm text-muted-foreground">{tenant.unit}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><div className="font-medium text-destructive">{tenant.days || 'N/A'}</div></TableCell>
                                    <TableCell className="text-right">${tenant.amount.toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Button variant="ghost" size="icon" aria-label="View tenant"><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" aria-label="Message tenant"><MessageSquare className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" aria-label="Log payment" onClick={() => onLogPayment(tenant)}>
                                                <DollarSign className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan="4" className="h-24 text-center text-muted-foreground">
                                    No overdue tenants found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

export default OverdueTenants;

// // src/components/dashboard/OverdueTenants.jsx

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getOverdueTenants } from '@/features/tenants/tenantSlice';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Eye, MessageSquare, DollarSign } from "lucide-react";

// const OverdueTenants = ({ onLogPayment }) => {
//     const dispatch = useDispatch();
//     const { overdueTenants, isLoading } = useSelector((state) => state.tenants);

//     useEffect(() => {
//         dispatch(getOverdueTenants());
//     }, [dispatch]);
    
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Top Overdue Tenants</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Tenant / Unit</TableHead>
//                             <TableHead>Days Overdue</TableHead>
//                             <TableHead className="text-right">Amount</TableHead>
//                             <TableHead className="text-center">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {isLoading ? (
//                             <TableRow><TableCell colSpan="4" className="text-center">Loading...</TableCell></TableRow>
//                         ) : overdueTenants.length > 0 ? (
//                             overdueTenants.map((tenant) => (
//                                 <TableRow key={tenant.leaseId}>
//                                     <TableCell>
//                                         <div className="flex items-center gap-3">
//                                             <Avatar className="h-9 w-9"><AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback></Avatar>
//                                             <div>
//                                                 <div className="font-medium">{tenant.name}</div>
//                                                 <div className="text-sm text-muted-foreground">{tenant.unit}</div>
//                                             </div>
//                                         </div>
//                                     </TableCell>
//                                     <TableCell><div className="font-medium text-destructive">{tenant.days || 'N/A'}</div></TableCell>
//                                     <TableCell className="text-right">${tenant.amount.toLocaleString()}</TableCell>
//                                     <TableCell className="text-center">
//                                         <div className="flex items-center justify-center gap-1">
//                                             <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
//                                             <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
//                                             <Button variant="ghost" size="icon" onClick={() => onLogPayment(tenant)}>
//                                                 <DollarSign className="h-4 w-4" />
//                                             </Button>
//                                         </div>
//                                     </TableCell>
//                                 </TableRow>
//                             ))
//                         ) : (
//                             <TableRow><TableCell colSpan="4" className="text-center">No overdue tenants found.</TableCell></TableRow>
//                         )}
//                     </TableBody>
//                 </Table>
//             </CardContent>
//         </Card>
//     );
// }

// export default OverdueTenants;

// import React from 'react';

// // Import all necessary shadcn/ui components
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// // Import icons
// import { Eye, MessageSquare, DollarSign } from "lucide-react";

// // Import the mock data from our central library
// import { mockTenants } from '@/lib/mockData';

// /**
//  * A component to display a summary list of tenants with overdue rent.
//  * @param {object} props - The component props.
//  * @param {function(object): void} props.onLogPayment - A function to be called when the log payment button is clicked for a tenant.
//  */
// const OverdueTenants = ({ onLogPayment }) => {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Top Overdue Tenants</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Tenant / Unit</TableHead>
//                             <TableHead>Days</TableHead>
//                             <TableHead className="text-right">Amount</TableHead>
//                             <TableHead className="text-center">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {mockTenants.map((tenant) => (
//                             <TableRow key={tenant.id}>
//                                 <TableCell>
//                                     <div className="flex items-center gap-3">
//                                         <Avatar className="h-9 w-9">
//                                             <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
//                                         </Avatar>
//                                         <div>
//                                             <div className="font-medium">{tenant.name}</div>
//                                             <div className="text-sm text-muted-foreground">{tenant.unit}</div>
//                                         </div>
//                                     </div>
//                                 </TableCell>
//                                 <TableCell>
//                                     <div className="font-medium text-destructive">{tenant.days}</div>
//                                 </TableCell>
//                                 <TableCell className="text-right">${tenant.amount.toLocaleString()}</TableCell>
//                                 <TableCell className="text-center">
//                                     <div className="flex items-center justify-center gap-1">
//                                         <Button variant="ghost" size="icon" aria-label="View tenant details">
//                                             <Eye className="h-4 w-4" />
//                                         </Button>
//                                         <Button variant="ghost" size="icon" aria-label="Message tenant">
//                                             <MessageSquare className="h-4 w-4" />
//                                         </Button>
//                                         <Button 
//                                             variant="ghost" 
//                                             size="icon" 
//                                             aria-label="Log payment"
//                                             onClick={() => onLogPayment(tenant)}
//                                         >
//                                             <DollarSign className="h-4 w-4" />
//                                         </Button>
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </CardContent>
//         </Card>
//     );
// }

// export default OverdueTenants;

// // src/components/dashboard/OverdueTenants.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Eye, MessageSquare, DollarSign } from "lucide-react";

// // --- Mock Data: This will be replaced by props from Redux later ---
// const mockTenants = [
//     { id: 't1', name: 'Alice Johnson', unit: 'Unit 101', days: 15, amount: 1250 },
//     { id: 't2', name: 'Bob Williams', unit: 'Unit 205', days: 12, amount: 950 },
//     { id: 't3', name: 'Charlie Brown', unit: 'Unit 103', days: 10, amount: 1500 },
// ];
// // --- End of Mock Data ---

// const OverdueTenants = () => {
//     return (
//         <Card>
//             <CardHeader>
//                 <CardTitle>Top Overdue Tenants</CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <Table>
//                     <TableHeader>
//                         <TableRow>
//                             <TableHead>Tenant / Unit</TableHead>
//                             <TableHead>Days</TableHead>
//                             <TableHead className="text-right">Amount</TableHead>
//                             <TableHead className="text-center">Actions</TableHead>
//                         </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                         {mockTenants.map((tenant) => (
//                             <TableRow key={tenant.id}>
//                                 <TableCell>
//                                     <div className="flex items-center gap-3">
//                                         <Avatar className="h-9 w-9">
//                                             <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
//                                         </Avatar>
//                                         <div>
//                                             <div className="font-medium">{tenant.name}</div>
//                                             <div className="text-sm text-muted-foreground">{tenant.unit}</div>
//                                         </div>
//                                     </div>
//                                 </TableCell>
//                                 <TableCell>
//                                     <div className="font-medium text-destructive">{tenant.days}</div>
//                                 </TableCell>
//                                 <TableCell className="text-right">${tenant.amount.toLocaleString()}</TableCell>
//                                 <TableCell className="text-center">
//                                     <div className="flex items-center justify-center gap-1">
//                                         <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
//                                         <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
//                                         <Button variant="ghost" size="icon"><DollarSign className="h-4 w-4" /></Button>
//                                     </div>
//                                 </TableCell>
//                             </TableRow>
//                         ))}
//                     </TableBody>
//                 </Table>
//             </CardContent>
//         </Card>
//     );
// }

// export default OverdueTenants;