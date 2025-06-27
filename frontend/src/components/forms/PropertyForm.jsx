import React, { useState, useEffect } from 'react';

// Import all necessary shadcn/ui components for the form
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
    Card, CardHeader, CardTitle, CardDescription, 
    CardContent, CardFooter 
} from "@/components/ui/card";

function PropertyForm({ initialData, onSubmit, isLoading, onCancel, isEditing }) {
    // A single state object to hold all form data
    const [formData, setFormData] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        rentAmount: '',
        imageUrl: '',
        isListed: false,
    });

    // This effect pre-populates the form with existing data if we are in "edit mode"
    useEffect(() => {
        if (isEditing && initialData) {
            setFormData({
                street: initialData.address?.street || '',
                city: initialData.address?.city || '',
                state: initialData.address?.state || '',
                zipCode: initialData.address?.zipCode || '',
                rentAmount: initialData.rentAmount || '',
                imageUrl: initialData.imageUrl || '',
                isListed: initialData.isListed || false,
            });
        }
    }, [initialData, isEditing]);

    // Destructure for easier use in the JSX
    const { street, city, state, zipCode, rentAmount, isListed, imageUrl } = formData;

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Construct the final data object to be sent to the backend
        const propertyData = {
            address: { street, city, state, zipCode },
            rentAmount,
            isListed,
            imageUrl,
        };
        onSubmit(propertyData);
    };

    return (
        <Card className="border-0 shadow-none">
            <CardHeader>
                <CardTitle>{isEditing ? 'Edit Property Details' : 'Add New Property'}</CardTitle>
                <CardDescription>
                    {isEditing ? 'Update the details for your property.' : 'Fill out the form to add a new property to your portfolio.'}
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleFormSubmit}>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="street">Street Address</Label>
                        <Input id="street" name="street" type="text" placeholder="e.g., 123 Main St" value={street} onChange={onChange} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" name="city" type="text" placeholder="e.g., Anytown" value={city} onChange={onChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="state">State / Province</Label>
                            <Input id="state" name="state" type="text" placeholder="e.g., TS" value={state} onChange={onChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="zipCode">Zip Code</Label>
                            <Input id="zipCode" name="zipCode" type="text" placeholder="e.g., 12345" value={zipCode} onChange={onChange} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="rentAmount">Rent ($)</Label>
                            <Input id="rentAmount" name="rentAmount" type="number" placeholder="e.g., 1500" value={rentAmount} onChange={onChange} required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="imageUrl">Property Image URL (Optional)</Label>
                        <Input id="imageUrl" name="imageUrl" type="text" placeholder="https://example.com/image.png" value={imageUrl} onChange={onChange} />
                    </div>
                    <div className="flex items-center space-x-2 pt-4">
                        <Switch
                            id="isListed"
                            checked={isListed}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isListed: checked }))}
                        />
                        <Label htmlFor="isListed" className="cursor-pointer">List this property publicly on the homepage?</Label>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default PropertyForm;
// // src/components/forms/PropertyForm.jsx

// import React, { useState, useEffect } from 'react';

// // 1. Import the new components we will use
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// function PropertyForm({ initialData, onSubmit, isLoading, onCancel, isEditing }) {
//     // 2. Add 'isListed' to the form's state, defaulting to false
//     const [formData, setFormData] = useState({
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         rentAmount: '',
//         isListed: false, 
//     });

//     useEffect(() => {
//         if (isEditing && initialData) {
//             setFormData({
//                 street: initialData.address?.street || '',
//                 city: initialData.address?.city || '',
//                 state: initialData.address?.state || '',
//                 zipCode: initialData.address?.zipCode || '',
//                 rentAmount: initialData.rentAmount || '',
//                 isListed: initialData.isListed || false, // 3. Pre-populate the switch's state
//             });
//         }
//     }, [initialData, isEditing]);

//     // Destructure the new isListed state
//     const { street, city, state, zipCode, rentAmount, isListed } = formData;

//     const onChange = (e) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         const propertyData = {
//             address: { street, city, state, zipCode },
//             rentAmount,
//             isListed, // 4. Ensure 'isListed' is included in the data sent on submit
//         };
//         onSubmit(propertyData);
//     };

//     return (
//         <form onSubmit={handleFormSubmit}>
//             <h3 className="text-xl font-bold mb-6 text-center">{isEditing ? 'Edit Property Details' : 'Add New Property'}</h3>
            
//             <div className="mb-4">
//                 <Label htmlFor="street">Street Address</Label>
//                 <Input id="street" name="street" type="text" placeholder="e.g., 123 Main St" value={street} onChange={onChange} required />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                     <Label htmlFor="city">City</Label>
//                     <Input id="city" name="city" type="text" placeholder="e.g., Testville" value={city} onChange={onChange} required />
//                 </div>
//                 <div>
//                     <Label htmlFor="state">State</Label>
//                     <Input id="state" name="state" type="text" placeholder="e.g., TS" value={state} onChange={onChange} required />
//                 </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div>
//                     <Label htmlFor="zipCode">Zip Code</Label>
//                     <Input id="zipCode" name="zipCode" type="text" placeholder="e.g., 12345" value={zipCode} onChange={onChange} required />
//                 </div>
//                 <div>
//                     <Label htmlFor="rentAmount">Rent ($)</Label>
//                     <Input id="rentAmount" name="rentAmount" type="number" placeholder="e.g., 1500" value={rentAmount} onChange={onChange} required />
//                 </div>
//             </div>

//             {/* 5. The new UI element for the toggle switch */}
//             <div className="flex items-center space-x-2 pt-4">
//                 <Switch 
//                     id="isListed" 
//                     checked={isListed}
//                     onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isListed: checked }))}
//                 />
//                 <Label htmlFor="isListed" className="cursor-pointer">List this property publicly on the homepage?</Label>
//             </div>

//             <div className="flex items-center justify-end gap-4 mt-8">
//                 <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
//                 <Button type="submit" disabled={isLoading}>
//                     {isLoading ? 'Saving...' : 'Save Changes'}
//                 </Button>
//             </div>
//         </form>
//     );
// }

// export default PropertyForm;

// import React, { useState, useEffect } from 'react';

// function PropertyForm({ initialData, onSubmit, isLoading, onCancel, isEditing }) {
//     // A single state object to hold all form data
//     const [formData, setFormData] = useState({
//         street: '',
//         city: '',
//         state: '',
//         zipCode: '',
//         rentAmount: '',
//     });

//     // This effect runs when the component loads or when we start editing a new property.
//     // It pre-populates the form with existing data if we are in "edit mode".
//     useEffect(() => {
//         if (isEditing && initialData) {
//             setFormData({
//                 street: initialData.address.street || '',
//                 city: initialData.address.city || '',
//                 state: initialData.address.state || '',
//                 zipCode: initialData.address.zipCode || '',
//                 rentAmount: initialData.rentAmount || '',
//             });
//         }
//     }, [initialData, isEditing]);

//     const { street, city, state, zipCode, rentAmount } = formData;

//     const onChange = (e) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     const handleFormSubmit = (e) => {
//         e.preventDefault();
//         const propertyData = {
//             address: { street, city, state, zipCode },
//             rentAmount,
//         };
//         onSubmit(propertyData);
//     };

//     return (
//         <form onSubmit={handleFormSubmit}>
//             <h3 className="text-xl font-bold mb-6 text-center">{isEditing ? 'Edit Property Details' : 'Add New Property'}</h3>
            
//             <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">Street Address</label>
//                 <input id="street" name="street" type="text" placeholder="e.g., 123 Main St" value={street} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div>
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">City</label>
//                     <input id="city" name="city" type="text" placeholder="e.g., Testville" value={city} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3" required />
//                 </div>
//                 <div>
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">State</label>
//                     <input id="state" name="state" type="text" placeholder="e.g., TS" value={state} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3" required />
//                 </div>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 mb-6">
//                 <div>
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">Zip Code</label>
//                     <input id="zipCode" name="zipCode" type="text" placeholder="e.g., 12345" value={zipCode} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3" required />
//                 </div>
//                 <div>
//                     <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rentAmount">Rent ($)</label>
//                     <input id="rentAmount" name="rentAmount" type="number" placeholder="e.g., 1500" value={rentAmount} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3" required />
//                 </div>
//             </div>

//             <div className="flex items-center justify-end gap-4">
//                 <button type="button" onClick={onCancel} className="text-gray-600 hover:text-gray-800 font-bold">Cancel</button>
//                 <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={isLoading}>
//                     {isLoading ? 'Saving...' : 'Save Changes'}
//                 </button>
//             </div>
//         </form>
//     );
// }

// export default PropertyForm;