// src/components/forms/SendInviteForm.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SendInviteForm = ({ onSubmit, onCancel, isLoading }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(email);
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid gap-2">
                <Label htmlFor="email">Tenant's Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="tenant@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Invitation'}
                </Button>
            </div>
        </form>
    );
};

export default SendInviteForm;