/**
 * TenantDetailPage.jsx
 * A command center for viewing all information related to a single tenant.
 */
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getTenantById } from "../features/tenants/tenantSlice";
import { format } from "date-fns";
import PaymentHistoryTab from "../components/tenants/details/PaymentHistoryTab";
import MaintenanceRequestsTab from "../components/tenants/details/MaintenanceRequestsTab";
import CommunicationLogTab from "../components/tenants/details/CommunicationLogTab";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone } from "lucide-react";

const TenantDetailPage = () => {
  const { tenantId } = useParams();
  const dispatch = useDispatch();

  const { details: tenant, isLoading } = useSelector(
    (state) => state.tenants.selectedTenant
  );

  useEffect(() => {
    if (tenantId) {
      dispatch(getTenantById(tenantId));
    }
  }, [tenantId, dispatch]);

  if (isLoading || !tenant) {
    return <div className="p-8">Loading tenant details...</div>;
  }

  return (
    <div className="space-y-8 p-4 md:p-8">
      {/* --- Header Section --- */}
      <header className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border">
          <AvatarFallback className="text-4xl">
            {tenant.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-4xl font-bold">{tenant.name}</h1>
          <div className="flex items-center gap-6 text-muted-foreground mt-2">
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> {tenant.email}
            </span>
            {/* Add phone number if available in your User model */}
            {/* <span className="flex items-center gap-2"><Phone className="h-4 w-4" /> (555) 123-4567</span> */}
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- Left Column: Lease & Key Info --- */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current Lease</CardTitle>
            </CardHeader>
            <CardContent>
              {tenant.leases && tenant.leases.length > 0 ? (
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Property:</strong>{" "}
                    {tenant.leases[0].property.address.street}
                  </p>
                  <p>
                    <strong>Rent:</strong> $
                    {tenant.leases[0].rentAmount.toLocaleString()}/month
                  </p>
                  <p>
                    <strong>Term:</strong>{" "}
                    {format(new Date(tenant.leases[0].startDate), "MMM yyyy")} -{" "}
                    {format(new Date(tenant.leases[0].endDate), "MMM yyyy")}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className="capitalize">
                      {tenant.leases[0].status}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground">No active lease found.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Right Column: Activity Tabs --- */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="payments">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="payments">Payment History</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>
            <TabsContent value="payments" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Payments</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <PaymentHistoryTab payments={tenant.payments || []} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="maintenance" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Maintenance Requests</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <MaintenanceRequestsTab
                    requests={tenant.maintenanceRequests || []}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="communication" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Log</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CommunicationLogTab logs={tenant.logs || []} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default TenantDetailPage;
