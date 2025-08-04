// src/components/tenants/details/PaymentHistoryTab.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const PaymentHistoryTab = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <p className="p-4 text-center text-muted-foreground">
        No payment history found.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((p) => (
          <TableRow key={p._id}>
            <TableCell>
              {format(new Date(p.paymentDate), "MMM dd, yyyy")}
            </TableCell>
            <TableCell>${p.amount.toLocaleString()}</TableCell>
            <TableCell>{p.method}</TableCell>
            <TableCell>{p.notes || "N/A"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

PaymentHistoryTab.propTypes = {
  payments: PropTypes.array.isRequired,
};

export default PaymentHistoryTab;
