// src/components/forms/LogOfflinePaymentForm.jsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const PAYMENT_METHODS = [
  { value: "Manual - Cash", label: "Cash" },
  { value: "Manual - Check", label: "Check" },
  { value: "Manual - Other", label: "Other" },
];

const LogOfflinePaymentForm = ({ tenant, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    leaseId: tenant?.leaseId || "",
    amount: tenant?.amount || "",
    paymentDate: new Date().toISOString().split("T")[0],
    method: "Manual - Check",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.leaseId) newErrors.leaseId = "Lease ID is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount must be greater than 0";
    if (!formData.paymentDate)
      newErrors.paymentDate = "Payment date is required";
    if (!formData.method) newErrors.method = "Payment method is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      method: value,
    }));
    if (errors.method) {
      setErrors((prev) => ({
        ...prev,
        method: undefined,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.amount}
          onChange={handleChange}
          required
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="paymentDate">Payment Date</Label>
        <Input
          id="paymentDate"
          name="paymentDate"
          type="date"
          value={formData.paymentDate}
          onChange={handleChange}
          required
          max={new Date().toISOString().split("T")[0]}
          className={errors.paymentDate ? "border-red-500" : ""}
        />
        {errors.paymentDate && (
          <p className="text-sm text-red-500">{errors.paymentDate}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="method">Payment Method</Label>
        <Select
          name="method"
          value={formData.method}
          onValueChange={handleSelectChange}
        >
          <SelectTrigger className={errors.method ? "border-red-500" : ""}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.method && (
          <p className="text-sm text-red-500">{errors.method}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="e.g., Check #1234"
          className={errors.notes ? "border-red-500" : ""}
        />
        {errors.notes && <p className="text-sm text-red-500">{errors.notes}</p>}
      </div>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Logging Payment..." : "Log Payment"}
        </Button>
      </div>
    </form>
  );
};

export default LogOfflinePaymentForm;
// // src/components/forms/LogOfflinePaymentForm.jsx

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";

// const LogOfflinePaymentForm = ({ tenant, onSubmit, onCancel, isLoading }) => {
//     const [formData, setFormData] = useState({
//         amount: tenant?.amount || '',
//         paymentDate: new Date().toISOString().split('T')[0], // Defaults to today
//         method: 'Manual - Check',
//         notes: ''
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSelectChange = (value) => {
//         setFormData({ ...formData, method: value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//             <div className="grid gap-2">
//                 <Label htmlFor="amount">Amount ($)</Label>
//                 <Input id="amount" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
//             </div>
//             <div className="grid gap-2">
//                 <Label htmlFor="paymentDate">Payment Date</Label>
//                 <Input id="paymentDate" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} required />
//             </div>
//             <div className="grid gap-2">
//                 <Label htmlFor="method">Payment Method</Label>
//                 <Select name="method" value={formData.method} onValueChange={handleSelectChange}>
//                     <SelectTrigger><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="Manual - Check">Check</SelectItem>
//                         <SelectItem value="Manual - Cash">Cash</SelectItem>
//                         <SelectItem value="Manual - Other">Other</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
//              <div className="grid gap-2">
//                 <Label htmlFor="notes">Notes (Optional)</Label>
//                 <Textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} placeholder="e.g., Check #1234" />
//             </div>
//             <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
//                 <Button type="submit" disabled={isLoading}>
//                     {isLoading ? 'Logging...' : 'Log Payment'}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default LogOfflinePaymentForm;
