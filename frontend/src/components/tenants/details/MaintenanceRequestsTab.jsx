// src/components/tenants/details/MaintenanceRequestsTab.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';

const MaintenanceRequestsTab = ({ requests }) => {
    if (!requests || requests.length === 0) {
        return <p className="p-4 text-center text-muted-foreground">No maintenance requests found.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Description</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {requests.map(req => (
                    <TableRow key={req._id}>
                        <TableCell>{format(new Date(req.createdAt), 'MMM dd, yyyy')}</TableCell>
                        <TableCell><Badge variant={req.status === 'Completed' ? 'default' : 'secondary'}>{req.status}</Badge></TableCell>
                        <TableCell>{req.property?.address?.street || 'N/A'}</TableCell>
                        <TableCell className="max-w-xs truncate">{req.description}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

MaintenanceRequestsTab.propTypes = {
    requests: PropTypes.array.isRequired,
};

export default MaintenanceRequestsTab;