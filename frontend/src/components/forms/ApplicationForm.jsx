// src/components/forms/ApplicationForm.jsx
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ApplicationForm = ({ onSubmit, onCancel, isLoading }) => {
    const [formData, setFormData] = useState({
        message: '',
        requestedStartDate: '',
        requestedEndDate: '',
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="requestedStartDate">Desired Start Date</Label>
                    <Input id="requestedStartDate" name="requestedStartDate" type="date" value={formData.requestedStartDate} onChange={handleChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="requestedEndDate">Desired End Date</Label>
                    <Input id="requestedEndDate" name="requestedEndDate" type="date" value={formData.requestedEndDate} onChange={handleChange} required />
                </div>
            </div>
            <div>
                <Label htmlFor="message">Your Message to the Landlord (Optional)</Label>
                <Textarea id="message" name="message" placeholder="Introduce yourself or ask any questions..." value={formData.message} onChange={handleChange} />
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit Application'}
                </Button>
            </div>
        </form>
    );
};

export default ApplicationForm;