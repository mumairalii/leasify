// src/components/modals/PaymentHistoryModal.jsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPaymentsForLease, reset as resetPayments } from '@/features/payments/paymentSlice';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const PaymentHistoryModal = ({ leaseId }) => {
    const dispatch = useDispatch();
    const { paymentHistory, isLoading } = useSelector((state) => state.payments);

    useEffect(() => {
        if (leaseId) {
            dispatch(getPaymentsForLease(leaseId));
        }
        // Cleanup when the modal is closed
        return () => {
            dispatch(resetPayments());
        };
    }, [leaseId, dispatch]);

    return (
        <>
            <DialogHeader>
                <DialogTitle>Payment History</DialogTitle>
                <DialogDescription>A complete ledger of all payments recorded for this lease.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                             <TableRow><TableCell colSpan="3" className="h-24 text-center">Loading payment history...</TableCell></TableRow>
                        ) : paymentHistory.length > 0 ? (
                            paymentHistory.map((p) => (
                                <TableRow key={p._id}>
                                    <TableCell className="font-medium">{new Date(p.paymentDate).toLocaleDateString()}</TableCell>
                                    <TableCell>${p.amount.toFixed(2)}</TableCell>
                                    <TableCell>{p.method}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                             <TableRow><TableCell colSpan="3" className="h-24 text-center text-muted-foreground">No payments have been logged for this lease.</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default PaymentHistoryModal;