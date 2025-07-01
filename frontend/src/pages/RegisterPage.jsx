import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function RegisterPage() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password2: '', role: 'tenant' });
    const { name, email, password, password2, role } = formData;
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
    }, [isError, message, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleRoleChange = (value) => {
        setFormData((prevState) => ({ ...prevState, role: value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (password !== password2) {
            toast.error('Passwords do not match');
            return;
        }
        dispatch(register({ name, email, password, role }));
    };

    if (user) {
        if (user.role === 'landlord') return <Navigate to='/landlord/dashboard' replace />;
        if (user.role === 'tenant') return <Navigate to='/tenant/dashboard' replace />;
    }

    return (
        <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
            {/* Left Branding Panel */}
            <div className="hidden bg-gray-100 lg:flex lg:flex-col lg:items-center lg:justify-center dark:bg-gray-800 p-10 text-center">
                <div className="mx-auto w-[350px]">
                    <h1 className="text-5xl font-bold text-blue-600">Leasify</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                        Join our platform to streamline your rental experience.
                    </p>
                </div>
            </div>
            {/* Right Form Panel */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Create an Account</h1>
                        <p className="text-balance text-muted-foreground">Enter your information to get started.</p>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2"><Label htmlFor="name">Full Name</Label><Input id="name" name="name" placeholder="John Doe" value={name} onChange={onChange} required /></div>
                            <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" placeholder="name@example.com" value={email} onChange={onChange} required /></div>
                            <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" name="password" type="password" value={password} onChange={onChange} required /></div>
                            <div className="grid gap-2"><Label htmlFor="password2">Confirm Password</Label><Input id="password2" name="password2" type="password" value={password2} onChange={onChange} required /></div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">I am a...</Label>
                                <Select value={role} onValueChange={handleRoleChange} name="role">
                                    <SelectTrigger><SelectValue placeholder="Select a role" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="tenant">Tenant</SelectItem>
                                        <SelectItem value="landlord">Landlord</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? "Creating Account..." : "Create Account"}</Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="underline">Sign in</Link></div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
// import React, { useState, useEffect } from 'react';
// // Step 2.1: Import the necessary tools from React-Redux, React-Router, and our Auth Slice
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { register, reset } from '../features/auth/authSlice';

// function RegisterPage() {
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         password2: '',
//         role: 'tenant'
//     });

//     const { name, email, password, password2, role } = formData;

//     // Step 2.2: Initialize the tools we need
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     // Step 2.3: Select the relevant state from our global Redux store
//     const { user, isLoading, isError, isSuccess, message } = useSelector(
//         (state) => state.auth
//     );

//     // Step 2.4: Use the `useEffect` hook to watch for changes and handle side effects
//     useEffect(() => {
//         // If there's an error during registration, show an alert
//         if (isError) {
//             alert(message); // In a real app, you'd use a more elegant "toast" notification
//         }

//         // If registration is successful, or if the user is already logged in, redirect
//         // if (isSuccess || user) {
//         //     navigate('/dashboard'); // We will create this dashboard page later
//         // }
//         // NEW CODE
//         if (isSuccess || user) {
//             if (user.role === 'landlord') {
//                 navigate('/landlord/dashboard');
//             } else if (user.role === 'tenant') {
//                 navigate('/tenant/dashboard');
//             }
// }

//         // Reset the state (isLoading, isSuccess, isError) when the component unmounts
//         dispatch(reset());

//     }, [user, isError, isSuccess, message, navigate, dispatch]);


//     const onChange = (e) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     // Step 2.5: Update the onSubmit function to dispatch the Redux action
//     const onSubmit = (e) => {
//         e.preventDefault();

//         if (password !== password2) {
//             alert('Passwords do not match');
//         } else {
//             const userData = {
//                 name,
//                 email,
//                 password,
//                 role,
//             };
//             dispatch(register(userData));
//         }
//     };
    
//     // Step 2.6: Add a loading indicator for better user experience
//     if (isLoading) {
//         return <h1>Loading...</h1>
//     }

//     return (
//         <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg">
//             <section className="text-center mb-8">
//                 <h1 className="text-3xl font-bold">Register an Account</h1>
//                 <p className="text-gray-600">Create an account to get started</p>
//             </section>

//             <section>
//                 {/* Add a disabled property to the button during loading */}
//                 <form onSubmit={onSubmit}>
//                     {/* ... (your input fields remain the same) ... */}
//                     <div className="mb-4">
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             type='text'
//                             id='name'
//                             name='name'
//                             value={name}
//                             placeholder='Enter your name'
//                             onChange={onChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             type='email'
//                             id='email'
//                             name='email'
//                             value={email}
//                             placeholder='Enter your email'
//                             onChange={onChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-4">
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             type='password'
//                             id='password'
//                             name='password'
//                             value={password}
//                             placeholder='Enter password'
//                             onChange={onChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <input
//                             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             type='password'
//                             id='password2'
//                             name='password2'
//                             value={password2}
//                             placeholder='Confirm password'
//                             onChange={onChange}
//                             required
//                         />
//                     </div>
//                     <div className="mb-6">
//                         <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="role">
//                             Register as a:
//                         </label>
//                         <select
//                             className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                             name="role"
//                             id="role"
//                             value={role}
//                             onChange={onChange}
//                         >
//                             <option value="tenant">Tenant</option>
//                             <option value="landlord">Landlord</option>
//                         </select>
//                     </div>
//                     <div>
//                         <button
//                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
//                             type='submit'
//                             disabled={isLoading}
//                         >
//                             Create Account
//                         </button>
//                     </div>
//                 </form>
//             </section>
//         </div>
//     );
// }

// export default RegisterPage;