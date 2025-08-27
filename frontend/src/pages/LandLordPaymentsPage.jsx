import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { getLandlordPayments } from "../features/payments/paymentSlice";
import { getProperties } from "../features/properties/propertySlice";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// --- FINAL, CORRECTED COLUMN DEFINITIONS ---
// This now matches the working component on your Tenant Detail page.
const columns = [
  {
    accessorKey: "paymentDate",
    header: "Date",
    cell: ({ row }) =>
      format(new Date(row.original.paymentDate), "MMM dd, yyyy"),
  },
  {
    accessorKey: "lease.tenant.name",
    header: "Tenant",
    cell: ({ row }) => row.original.lease?.tenant?.name || "N/A",
  },
  {
    accessorKey: "lease.property.address.street",
    header: "Property",
    cell: ({ row }) => row.original.lease?.property?.address?.street || "N/A",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) =>
      `$${row.original.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
      })}`,
  },
  {
    // Correctly reads the 'method' field from your database model.
    accessorKey: "method",
    header: "Method",
  },
  {
    // Correctly reads the 'notes' field from your database model.
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => row.original.notes || "—", // Display a dash if no notes
  },
];

function LandlordPaymentsPage() {
  const dispatch = useDispatch();
  const { properties: allProperties } = useSelector(
    (state) => state.properties
  );
  const { landlordPayments, isLandlordPaymentsLoading, landlordPaymentsMeta } =
    useSelector((state) => state.payments);

  // Removed the faulty 'status' filter.
  const [filters, setFilters] = useState({ propertyId: "" });
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    dispatch(getProperties());
  }, [dispatch]);

  useEffect(() => {
    // We create the queryParams object from our working filters
    const queryParams = { page: pageIndex + 1, limit: 10, ...filters };
    dispatch(getLandlordPayments(queryParams));
  }, [dispatch, filters, pageIndex]);

  const handleFilterChange = (key, value) => {
    setPageIndex(0);
    setFilters((prev) => ({ ...prev, [key]: value === "all" ? "" : value }));
  };

  const clearFilters = () => {
    setPageIndex(0);
    setFilters({ propertyId: "" });
  };

  const memoizedColumns = useMemo(() => columns, []);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header>
        <h1 className="text-3xl font-bold">All Payments</h1>
        <p className="text-muted-foreground">
          View and filter all payment transactions across your properties.
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Filter Payments</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row flex-wrap items-center gap-4">
          {/* The faulty "Status" filter has been completely removed. */}
          <Select
            value={filters.propertyId || "all"}
            onValueChange={(value) => handleFilterChange("propertyId", value)}
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Filter by Property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {allProperties.map((prop) => (
                <SelectItem key={prop._id} value={prop._id}>
                  {prop.address.street}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={clearFilters} variant="ghost">
            Clear Filters
          </Button>
        </CardContent>
      </Card>

      {isLandlordPaymentsLoading && landlordPayments.length === 0 ? (
        <Skeleton className="h-[400px] w-full" />
      ) : (
        <DataTable
          columns={memoizedColumns}
          data={landlordPayments}
          pageCount={landlordPaymentsMeta?.pages || 1}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
        />
      )}
    </div>
  );
}

export default LandlordPaymentsPage;
