// src/pages/LandlordApplicationsPage.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getApplications, updateApplicationStatus } from '../features/applications/applicationSlice';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

const LandlordApplicationsPage = () => {
    const dispatch = useDispatch();
    const { applications, isLoading } = useSelector((state) => state.applications);

    useEffect(() => {
        dispatch(getApplications());
    }, [dispatch]);

    const handleUpdateStatus = (id, status) => {
        dispatch(updateApplicationStatus({ id, status }))
            .unwrap()
            .then(() => {
                toast.success(`Application has been ${status.toLowerCase()}.`);
            })
            .catch((error) => {
                toast.error(error.message || 'Failed to update application.');
            });
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Tenant Applications</CardTitle>
                    <CardDescription>
                        Review and manage all pending applications for your properties.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Applicant</TableHead>
                                <TableHead>Property</TableHead>
                                <TableHead>Date Submitted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan="4" className="h-24 text-center">Loading applications...</TableCell>
                                </TableRow>
                            ) : applications.length > 0 ? (
                                applications.map((app) => (
                                    <TableRow key={app._id}>
                                        <TableCell className="font-medium">{app.tenant.name}</TableCell>
                                        <TableCell>{app.property.address.street}</TableCell>
                                        <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(app._id, 'Rejected')}>
                                                Reject
                                            </Button>
                                            <Button size="sm" onClick={() => handleUpdateStatus(app._id, 'Approved')}>
                                                Approve
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="h-24 text-center text-muted-foreground">
                                        No pending applications.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default LandlordApplicationsPage;