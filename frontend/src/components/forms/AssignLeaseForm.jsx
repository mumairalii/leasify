// src/components/forms/AssignLeaseForm.jsx

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const AssignLeaseForm = ({ property, onSubmit, onCancel, isLoading }) => {
    // Form state now includes all required fields for a lease
    const [formData, setFormData] = useState({
        tenantEmail: '',
        startDate: '',
        endDate: '',
        rentAmount: ''
    });

    // Pre-fill the rent amount from the property when it's selected
    useEffect(() => {
        if (property) {
            setFormData(prev => ({ ...prev, rentAmount: property.rentAmount }));
        }
    }, [property]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // The onSubmit function (passed from the dashboard) will receive the complete form data
        onSubmit(formData);
    };

    if (!property) return null;

    return (
        <>
            <DialogHeader>
                <DialogTitle>Assign Lease Manually</DialogTitle>
                <DialogDescription>
                    Create a new lease for property: <span className="font-semibold text-foreground">{property.address.street}</span>
                </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="tenantEmail">Tenant's Email</Label>
                    <Input
                        id="tenantEmail"
                        name="tenantEmail"
                        type="email"
                        placeholder="tenant@example.com"
                        value={formData.tenantEmail}
                        onChange={handleChange}
                        required
                    />
                </div>
                {/* --- NEW: Date input fields --- */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input 
                            id="startDate" 
                            name="startDate" 
                            type="date" 
                            value={formData.startDate} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="endDate">End Date</Label>
                        <Input 
                            id="endDate" 
                            name="endDate" 
                            type="date" 
                            value={formData.endDate} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="rentAmount">Monthly Rent ($)</Label>
                    <Input 
                        id="rentAmount" 
                        name="rentAmount" 
                        type="number" 
                        value={formData.rentAmount} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Assigning...' : 'Assign Lease'}
                    </Button>
                </div>
            </form>
        </>
    );
};

export default AssignLeaseForm;
// // src/components/forms/AssignLeaseForm.jsx

// import React, { useState, useEffect } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

// const AssignLeaseForm = ({ property, onSubmit, onCancel, isLoading }) => {
//     const [formData, setFormData] = useState({
//         tenantEmail: '',
//         startDate: '',
//         endDate: '',
//         rentAmount: ''
//     });

//     useEffect(() => {
//         // Pre-fill the rent amount from the property, but allow it to be changed
//         if (property) {
//             setFormData(prev => ({ ...prev, rentAmount: property.rentAmount }));
//         }
//     }, [property]);

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(formData);
//     };

//     if (!property) return null;

//     return (
//         <Card className="border-0 shadow-none">
//             <CardHeader>
//                 <CardTitle>Assign Lease</CardTitle>
//                 <CardDescription>
//                     Assign a new lease to property: <span className="font-semibold text-foreground">{property.address.street}</span>
//                 </CardDescription>
//             </CardHeader>
//             <form onSubmit={handleSubmit}>
//                 <CardContent className="grid gap-4">
//                     <div className="grid gap-2">
//                         <Label htmlFor="tenantEmail">Tenant's Email</Label>
//                         <Input
//                             id="tenantEmail"
//                             name="tenantEmail"
//                             type="email"
//                             placeholder="tenant@example.com"
//                             value={formData.tenantEmail}
//                             onChange={handleChange}
//                             required
//                         />
//                     </div>
//                     <div className="grid grid-cols-2 gap-4">
//                         <div className="grid gap-2">
//                             <Label htmlFor="startDate">Start Date</Label>
//                             <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
//                         </div>
//                         <div className="grid gap-2">
//                             <Label htmlFor="endDate">End Date</Label>
//                             <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required />
//                         </div>
//                     </div>
//                     <div className="grid gap-2">
//                         <Label htmlFor="rentAmount">Monthly Rent ($)</Label>
//                         <Input id="rentAmount" name="rentAmount" type="number" value={formData.rentAmount} onChange={handleChange} required />
//                     </div>
//                 </CardContent>
//                 <CardFooter className="flex justify-end gap-2">
//                     <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
//                     <Button type="submit" disabled={isLoading}>
//                         {isLoading ? 'Assigning...' : 'Assign Lease'}
//                     </Button>
//                 </CardFooter>
//             </form>
//         </Card>
//     );
// };

// export default AssignLeaseForm;