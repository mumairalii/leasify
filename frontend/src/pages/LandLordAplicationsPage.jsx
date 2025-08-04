/**
 * LandLordAplicationsPage.jsx
 * An interactive hub for landlords to manage all tenant applications,
 * including the workflow to approve an applicant and assign a lease in one seamless action.
 */
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getApplications,
  updateApplication,
} from "../features/applications/applicationSlice";
import { assignLease } from "../features/lease/leaseSlice";
import { toast } from "react-toastify";
import { format } from "date-fns";

// --- UI & Form Imports ---
import { Card } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import AssignLeaseForm from "../components/forms/AssignLeaseForm";

const LandLordAplicationsPage = () => {
  const dispatch = useDispatch();

  // --- Component State ---
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [applicationToLease, setApplicationToLease] = useState(null);

  // --- Redux State ---
  const { applications, isLoading } = useSelector(
    (state) => state.applications
  );
  const { isLoading: isLeaseLoading } = useSelector((state) => state.lease);

  // --- Data Fetching ---
  useEffect(() => {
    dispatch(getApplications());
  }, [dispatch]);

  // --- Handler Functions ---
  const handleDeny = (id) => {
    dispatch(updateApplication({ id, status: "Denied" }))
      .unwrap()
      .then(() => toast.success(`Application has been Denied.`))
      .catch((err) => toast.error(err.message || "Failed to update status."));
  };

  const handleOpenLeaseModal = (application) => {
    setApplicationToLease(application);
    setIsLeaseModalOpen(true);
  };

  const handleAssignLeaseSubmit = async (formData) => {
    const leaseData = {
      ...formData,
      propertyId: applicationToLease.property._id,
      tenantId: applicationToLease.applicant._id,
      applicationId: applicationToLease._id, // Pass the application ID for the backend to update
    };

    dispatch(assignLease(leaseData))
      .unwrap()
      .then(() => {
        toast.success("Lease assigned successfully!");
        setIsLeaseModalOpen(false);
        setApplicationToLease(null);
        dispatch(getApplications()); // Refresh the applications list to show the status change
      })
      .catch((err) => toast.error(err.message || "Failed to assign lease."));
  };

  const filteredApplications = useMemo(() => {
    if (statusFilter === "All") return applications;
    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Pending":
        return "secondary";
      case "Approved":
      case "Completed":
        return "default";
      case "Denied":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <>
      <div className="space-y-6 p-4 md:p-8">
        <header>
          <h1 className="text-3xl font-bold">Application Hub</h1>
          <p className="text-muted-foreground">
            Review and manage all tenant applications.
          </p>
        </header>

        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Denied">Denied</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date Applied</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan="5" className="h-24 text-center">
                    Loading applications...
                  </TableCell>
                </TableRow>
              ) : filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>
                      {format(new Date(app.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{app.applicant?.name || "N/A"}</TableCell>
                    <TableCell>
                      {app.property?.address?.street || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {app.status === "Pending" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleOpenLeaseModal(app)}
                            >
                              Approve & Assign Lease
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeny(app._id)}
                              className="text-destructive"
                            >
                              Deny
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan="5"
                    className="h-24 text-center text-muted-foreground"
                  >
                    No applications found for the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={isLeaseModalOpen} onOpenChange={setIsLeaseModalOpen}>
        <DialogContent>
          <AssignLeaseForm
            property={applicationToLease?.property}
            tenant={applicationToLease?.applicant}
            onSubmit={handleAssignLeaseSubmit}
            onCancel={() => setIsLeaseModalOpen(false)}
            isLoading={isLeaseLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LandLordAplicationsPage;

// /**
//  * LandLordAplicationsPage.jsx
//  * An interactive hub for landlords to manage all tenant applications.
//  */
// import React, { useState, useEffect, useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   getApplications,
//   updateApplication,
// } from "../features/applications/applicationSlice";
// import { toast } from "react-toastify";
// import { format } from "date-fns";

// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MoreHorizontal } from "lucide-react";

// const LandLordAplicationsPage = () => {
//   const dispatch = useDispatch();
//   const { applications, isLoading } = useSelector(
//     (state) => state.applications
//   );
//   const [statusFilter, setStatusFilter] = useState("All");

//   useEffect(() => {
//     dispatch(getApplications());
//   }, [dispatch]);

//   const handleStatusUpdate = (id, status) => {
//     dispatch(updateApplication({ id, status }))
//       .unwrap()
//       .then(() => toast.success(`Application has been ${status}.`))
//       .catch((err) => toast.error(err.message || "Failed to update status."));
//   };

//   const filteredApplications = useMemo(() => {
//     if (statusFilter === "All") return applications;
//     return applications.filter((app) => app.status === statusFilter);
//   }, [applications, statusFilter]);

//   const getStatusBadgeVariant = (status) => {
//     switch (status) {
//       case "Pending":
//         return "secondary";
//       case "Approved":
//         return "default";
//       case "Denied":
//         return "destructive";
//       default:
//         return "outline";
//     }
//   };

//   return (
//     <div className="space-y-6 p-4 md:p-8">
//       <header>
//         <h1 className="text-3xl font-bold">Application Hub</h1>
//         <p className="text-muted-foreground">
//           Review and manage all tenant applications.
//         </p>
//       </header>

//       <div className="w-full sm:w-48">
//         <Select value={statusFilter} onValueChange={setStatusFilter}>
//           <SelectTrigger>
//             <SelectValue placeholder="Filter by status..." />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="All">All Statuses</SelectItem>
//             <SelectItem value="Pending">Pending</SelectItem>
//             <SelectItem value="Approved">Approved</SelectItem>
//             <SelectItem value="Denied">Denied</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <Card className="border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date Applied</TableHead>
//               <TableHead>Applicant</TableHead>
//               <TableHead>Property</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan="5" className="h-24 text-center">
//                   Loading applications...
//                 </TableCell>
//               </TableRow>
//             ) : filteredApplications.length > 0 ? (
//               filteredApplications.map((app) => (
//                 <TableRow key={app._id}>
//                   <TableCell>
//                     {format(new Date(app.createdAt), "MMM dd, yyyy")}
//                   </TableCell>
//                   <TableCell>{app.applicant?.name || "N/A"}</TableCell>
//                   <TableCell>
//                     {app.property?.address?.street || "N/A"}
//                   </TableCell>
//                   <TableCell>
//                     <Badge variant={getStatusBadgeVariant(app.status)}>
//                       {app.status}
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem
//                           onClick={() =>
//                             handleStatusUpdate(app._id, "Approved")
//                           }
//                           disabled={app.status === "Approved"}
//                         >
//                           Approve
//                         </DropdownMenuItem>
//                         <DropdownMenuItem
//                           onClick={() => handleStatusUpdate(app._id, "Denied")}
//                           className="text-destructive"
//                         >
//                           Deny
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan="5"
//                   className="h-24 text-center text-muted-foreground"
//                 >
//                   No applications found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </Card>
//     </div>
//   );
// };

// export default LandLordAplicationsPage;

// // src/pages/LandlordApplicationsPage.jsx

// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getApplications, updateApplicationStatus } from '../features/applications/applicationSlice';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { toast } from 'react-toastify';

// const LandlordApplicationsPage = () => {
//     const dispatch = useDispatch();
//     const { applications, isLoading } = useSelector((state) => state.applications);

//     useEffect(() => {
//         dispatch(getApplications());
//     }, [dispatch]);

//     const handleUpdateStatus = (id, status) => {
//         dispatch(updateApplicationStatus({ id, status }))
//             .unwrap()
//             .then(() => {
//                 toast.success(`Application has been ${status.toLowerCase()}.`);
//             })
//             .catch((error) => {
//                 toast.error(error.message || 'Failed to update application.');
//             });
//     };

//     return (
//         <div className="space-y-6">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Tenant Applications</CardTitle>
//                     <CardDescription>
//                         Review and manage all pending applications for your properties.
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead>Applicant</TableHead>
//                                 <TableHead>Property</TableHead>
//                                 <TableHead>Date Submitted</TableHead>
//                                 <TableHead className="text-right">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {isLoading && applications.length === 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan="4" className="h-24 text-center">Loading applications...</TableCell>
//                                 </TableRow>
//                             ) : applications.length > 0 ? (
//                                 applications.map((app) => (
//                                     <TableRow key={app._id}>
//                                         <TableCell className="font-medium">{app.tenant.name}</TableCell>
//                                         <TableCell>{app.property.address.street}</TableCell>
//                                         <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
//                                         <TableCell className="text-right space-x-2">
//                                             <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(app._id, 'Rejected')}>
//                                                 Reject
//                                             </Button>
//                                             <Button size="sm" onClick={() => handleUpdateStatus(app._id, 'Approved')}>
//                                                 Approve
//                                             </Button>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             ) : (
//                                 <TableRow>
//                                     <TableCell colSpan="4" className="h-24 text-center text-muted-foreground">
//                                         No pending applications.
//                                     </TableCell>
//                                 </TableRow>
//                             )}
//                         </TableBody>
//                     </Table>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default LandlordApplicationsPage;
