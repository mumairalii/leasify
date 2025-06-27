// src/components/forms/LogCommunicationForm.jsx

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LogCommunicationForm = ({ onSubmit, onCancel, isLoading, tenants = [], properties = [] }) => {
    const [formData, setFormData] = useState({
        message: '',
        tenant: '',
        property: '',
        // --- NEW: Add state for the communication type ---
        type: 'Communication - Phone Call', 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.message.trim()) return;
        
        const logData = { 
            message: formData.message, 
            type: 'Communication', // The main type is still 'Communication'
            // We can store the specific method in the message itself or a future 'details' field.
            // For now, let's prepend it to the message.
            fullMessage: `${formData.type}: ${formData.message}`
        };

        if (formData.tenant) logData.tenant = formData.tenant;
        if (formData.property) logData.property = formData.property;

        // We will adapt the backend to accept 'fullMessage' as 'message'
        onSubmit({ ...logData, message: logData.fullMessage });
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
            {/* --- NEW: Field for Communication Type --- */}
            <div className="grid gap-2">
                <Label htmlFor="type">Type of Communication</Label>
                <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Phone Call">Phone Call</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Text Message">Text Message</SelectItem>
                        <SelectItem value="In Person">In Person</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            <div className="grid gap-2">
                <Label htmlFor="message">Log Message / Notes</Label>
                <Textarea 
                    id="message" 
                    name="message"
                    value={formData.message} 
                    onChange={handleChange}
                    placeholder="e.g., Called John Doe about late rent..."
                    required
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="tenant">Link to Tenant (Optional)</Label>
                    <Select name="tenant" onValueChange={(value) => handleSelectChange('tenant', value)}>
                        <SelectTrigger><SelectValue placeholder="Select a tenant" /></SelectTrigger>
                        <SelectContent>
                            {tenants.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="property">Link to Property (Optional)</Label>
                    <Select name="property" onValueChange={(value) => handleSelectChange('property', value)}>
                        <SelectTrigger><SelectValue placeholder="Select a property" /></SelectTrigger>
                        <SelectContent>
                            {properties.map(p => <SelectItem key={p._id} value={p._id}>{p.address.street}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Log'}
                </Button>
            </div>
        </form>
    );
};

export default LogCommunicationForm;
// // src/components/forms/LogCommunicationForm.jsx

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const LogCommunicationForm = ({ onSubmit, onCancel, isLoading, tenants = [], properties = [] }) => {
//     const [formData, setFormData] = useState({
//         message: '',
//         tenant: '',
//         property: '',
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.message.trim()) return;
//         // We only submit the fields that have a value
//         const logData = { message: formData.message, type: 'Communication' };
//         if (formData.tenant) logData.tenant = formData.tenant;
//         if (formData.property) logData.property = formData.property;
//         onSubmit(logData);
//     };

//     return (
//         <form onSubmit={handleSubmit} className="grid gap-6 py-4">
//             <div className="grid gap-2">
//                 <Label htmlFor="message">Log Message</Label>
//                 <Textarea 
//                     id="message" 
//                     name="message"
//                     value={formData.message} 
//                     onChange={handleChange}
//                     placeholder="e.g., Called John Doe about late rent..."
//                     required
//                 />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//                  <div className="grid gap-2">
//                     <Label htmlFor="tenant">Link to Tenant (Optional)</Label>
//                     <Select name="tenant" onValueChange={(value) => setFormData(f => ({...f, tenant: value}))}>
//                         <SelectTrigger><SelectValue placeholder="Select a tenant" /></SelectTrigger>
//                         <SelectContent>
//                             {tenants.map(t => <SelectItem key={t._id} value={t._id}>{t.name}</SelectItem>)}
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div className="grid gap-2">
//                     <Label htmlFor="property">Link to Property (Optional)</Label>
//                     <Select name="property" onValueChange={(value) => setFormData(f => ({...f, property: value}))}>
//                         <SelectTrigger><SelectValue placeholder="Select a property" /></SelectTrigger>
//                         <SelectContent>
//                             {properties.map(p => <SelectItem key={p._id} value={p._id}>{p.address.street}</SelectItem>)}
//                         </SelectContent>
//                     </Select>
//                 </div>
//             </div>
//             <div className="flex justify-end gap-2 pt-2">
//                 <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
//                 <Button type="submit" disabled={isLoading}>
//                     {isLoading ? 'Saving...' : 'Save Log'}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default LogCommunicationForm;

// // src/components/forms/LogCommunicationForm.jsx

// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// const LogCommunicationForm = ({ onSubmit, onCancel, isLoading }) => {
//     const [message, setMessage] = useState('');

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!message.trim()) return;
//         onSubmit({ message, type: 'Communication' }); // Set the type explicitly
//     };

//     return (
//         <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//             <div className="grid gap-2">
//                 <Label htmlFor="message">Log Entry</Label>
//                 <Textarea 
//                     id="message" 
//                     value={message} 
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="e.g., Called John Doe about late rent. He will pay tomorrow."
//                     required
//                 />
//             </div>
//             <div className="flex justify-end gap-2 pt-2">
//                 <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
//                 <Button type="submit" disabled={isLoading}>
//                     {isLoading ? 'Saving...' : 'Save Log'}
//                 </Button>
//             </div>
//         </form>
//     );
// };

// export default LogCommunicationForm;