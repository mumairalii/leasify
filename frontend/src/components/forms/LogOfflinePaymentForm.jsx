// src/components/forms/LogOfflinePaymentForm.jsx

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const LogOfflinePaymentForm = ({ tenant, onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        amount: tenant?.amount || '',
        paymentDate: new Date().toISOString().split('T')[0], // Defaults to today
        method: 'Manual - Check',
        notes: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    const handleSelectChange = (value) => {
        setFormData({ ...formData, method: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="paymentDate">Payment Date</Label>
                <Input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="method">Payment Method</Label>
                <Select name="method" value={formData.method} onValueChange={handleSelectChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Manual - Check">Check</SelectItem>
                        <SelectItem value="Manual - Cash">Cash</SelectItem>
                        <SelectItem value="Manual - Other">Other</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Check #1234" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Logging...' : 'Log Payment'}
                </Button>
            </div>
        </form>
    );
};

export default LogOfflinePaymentForm;