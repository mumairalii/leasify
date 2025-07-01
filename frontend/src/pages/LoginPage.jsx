import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { toast } from 'react-toastify';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const { email, password } = formData;

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }
        return () => {
            dispatch(reset());
        };
    }, [isError, message, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
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
                    <h1 className="text-5xl font-bold text-blue-600">Leaseify</h1>
                    <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                        The all-in-one platform for seamless property and lease management.
                    </p>
                </div>
            </div>

            {/* Right Form Panel */}
            <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Welcome Back!</h1>
                        <p className="text-balance text-muted-foreground">
                            Enter your credentials to access your account.
                        </p>
                    </div>
                    <form onSubmit={onSubmit}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" name="email" type="email" placeholder="name@example.com" value={email} onChange={onChange} required />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    {/* <Link href="#" className="ml-auto inline-block text-sm underline">Forgot your password?</Link> */}
                                </div>
                                <Input id="password" name="password" type="password" value={password} onChange={onChange} required />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="underline">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { login, reset } from '../features/auth/authSlice'; // Note: we import 'login' here

// function LoginPage() {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });

//     const { email, password } = formData;

//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const { user, isLoading, isError, isSuccess, message } = useSelector(
//         (state) => state.auth
//     );

//     useEffect(() => {
//         if (isError) {
//             alert(message);
//         }

//         // If login is successful or user is already logged in, navigate away
//         // if (isSuccess || user) {
//         //     // We will add role-based navigation later
//         //     navigate('/dashboard'); 
//         // }
//         // NEW CODE
//         if (isSuccess || user) {
//             if (user.role === 'landlord') {
//                 navigate('/landlord/dashboard');
//             } else if (user.role === 'tenant') {
//                 navigate('/tenant/dashboard');
//         }
// }

//         dispatch(reset());
//     }, [user, isError, isSuccess, message, navigate, dispatch]);

//     const onChange = (e) => {
//         setFormData((prevState) => ({
//             ...prevState,
//             [e.target.name]: e.target.value,
//         }));
//     };

//     const onSubmit = (e) => {
//         e.preventDefault();

//         const userData = {
//             email,
//             password,
//         };
//         // Dispatch the login action instead of the register action
//         dispatch(login(userData));
//     };

//     if (isLoading) {
//         return <h1>Loading...</h1>;
//     }

//     return (
//         <div className="max-w-md mx-auto mt-10 p-8 border rounded-lg shadow-lg">
//             <section className="text-center mb-8">
//                 <h1 className="text-3xl font-bold">Login</h1>
//                 <p className="text-gray-600">Please log in to your account</p>
//             </section>

//             <section>
//                 <form onSubmit={onSubmit}>
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
//                     <div className="mb-6">
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
//                     <div>
//                         <button
//                             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full disabled:bg-gray-400"
//                             type='submit'
//                             disabled={isLoading}
//                         >
//                             Sign In
//                         </button>
//                     </div>
//                 </form>
//             </section>
//         </div>
//     );
// }

// export default LoginPage;