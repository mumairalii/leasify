import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLeaseDetails, reset } from "../features/lease/leaseSlice";
import { Loader2 } from "lucide-react";

const LeaseAgreement = () => {
  const dispatch = useDispatch();
  const { lease, isLoading, isError, message } = useSelector(
    (state) => state.lease
  );

  useEffect(() => {
    dispatch(getLeaseDetails());

    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading lease details...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive">
        <p>Error loading lease details: {message}</p>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No active lease found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Lease Agreement</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Property Address</h2>
          <p>{lease.property?.address?.street || "Address not available"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Lease Term</h2>
          <p>
            {new Date(lease.startDate).toLocaleDateString()} -{" "}
            {new Date(lease.endDate).toLocaleDateString()}
          </p>
        </div>
        <div>
          <h2 className="font-semibold">Monthly Rent</h2>
          <p>${lease.rentAmount?.toLocaleString() || "0"}</p>
        </div>
        <div>
          <h2 className="font-semibold">Current Balance</h2>
          <p>${lease.currentBalance?.toLocaleString() || "0"}</p>
        </div>
        {/* Add more lease details as needed */}
      </div>
    </div>
  );
};

export default LeaseAgreement;
