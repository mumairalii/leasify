import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getMyPayments, reset } from "@/features/payments/paymentSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";

const PaymentHistoryPage = () => {
  const dispatch = useDispatch();
  const { paymentHistory, isLoading, isError, message } = useSelector(
    (state) => state.payments
  );

  useEffect(() => {
    dispatch(getMyPayments());

    // Cleanup when component unmounts
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading payment history...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading payment history: {message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">
          View your complete payment history and transaction details
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
          <CardDescription>
            All payments made through the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!paymentHistory || paymentHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No payment history found.</p>
              <p className="text-sm">
                Your payment history will appear here once you make payments.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell className="font-medium">
                      {format(new Date(payment.paymentDate), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>${payment.amount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">
                      {payment.method}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          payment.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : payment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.notes || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistoryPage;
