// src/components/modals/PaymentModal.jsx

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from '../forms/PaymentForm';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Load Stripe outside of the component to avoid re-loading on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentModal = ({ amount, onPaymentSuccess }) => {
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        const createIntent = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                if (!user?.token) throw new Error('User not authenticated');

                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
                // --- THIS IS THE FIX ---
                // The URL now correctly points to the tenant-specific endpoint
                const response = await api.post('tenant/payments/create-payment-intent', { amount }, config);
                setClientSecret(response.data.clientSecret);

            } catch (error) {
                toast.error('Failed to initialize payment form.');
                console.error('Error creating payment intent:', error);
            }
        };

        if (amount > 0) {
            createIntent();
        }
    }, [amount]);

    const appearance = {
        theme: document.documentElement.classList.contains('dark') ? 'night' : 'stripe',
        labels: 'floating',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div>
            {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                    <PaymentForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
                </Elements>
            ) : (
                <p className="text-center text-muted-foreground">Initializing payment...</p>
            )}
        </div>
    );
};

export default PaymentModal;
// // src/components/modals/PaymentModal.jsx

// import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import PaymentForm from '../forms/PaymentForm';
// import api from '../../services/api';
// import { toast } from 'react-toastify';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// // The component no longer needs leaseId, as the backend handles it.
// const PaymentModal = ({ amount, onPaymentSuccess }) => {
//     const [clientSecret, setClientSecret] = useState('');

//     useEffect(() => {
//         const createIntent = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem('user'));
//                 if (!user?.token) throw new Error('User not authenticated');
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
//                 // We only need to send the amount. The backend gets the lease from the user's token.
//                 const response = await api.post('payments/create-payment-intent', { amount }, config);
//                 setClientSecret(response.data.clientSecret);
//             } catch (error) {
//                 toast.error('Failed to initialize payment form.');
//                 console.error('Error creating payment intent:', error);
//             }
//         };

//         if (amount > 0) {
//             createIntent();
//         }
//     }, [amount]); // The effect now only depends on the amount.

//     const options = {
//         clientSecret,
//         appearance: { theme: 'night', labels: 'floating' },
//     };

//     return (
//         <div>
//             {clientSecret ? (
//                 <Elements options={options} stripe={stripePromise}>
//                     <PaymentForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
//                 </Elements>
//             ) : (
//                 <p>Initializing payment...</p>
//             )}
//         </div>
//     );
// };

// export default PaymentModal;

// // src/components/modals/PaymentModal.jsx

// import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import PaymentForm from '../forms/PaymentForm';
// import api from '../../services/api';
// import { toast } from 'react-toastify';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// // The component now accepts 'amount' and 'leaseId'
// const PaymentModal = ({ amount, leaseId, onPaymentSuccess }) => {
//     const [clientSecret, setClientSecret] = useState('');

//     useEffect(() => {
//         const createIntent = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem('user'));
//                 if (!user?.token) throw new Error('User not authenticated');
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
//                 // --- FIX: Send both amount and leaseId to the backend ---
//                 const response = await api.post('payments/create-payment-intent', { amount, leaseId }, config);
//                 setClientSecret(response.data.clientSecret);

//             } catch (error) {
//                 toast.error('Failed to initialize payment form.');
//                 console.error('Error creating payment intent:', error);
//             }
//         };

//         // Only create an intent if we have the required information
//         if (amount > 0 && leaseId) {
//             createIntent();
//         }
//     }, [amount, leaseId]); // Add leaseId to the dependency array

//     const options = {
//         clientSecret,
//         appearance: { theme: 'night', labels: 'floating' },
//     };

//     return (
//         <div>
//             {clientSecret ? (
//                 <Elements options={options} stripe={stripePromise}>
//                     <PaymentForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
//                 </Elements>
//             ) : (
//                 <p>Initializing payment...</p>
//             )}
//         </div>
//     );
// };

// export default PaymentModal;
// // src/components/modals/PaymentModal.jsx

// import React, { useState, useEffect } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
// import PaymentForm from '../forms/PaymentForm';
// import api from '../../services/api';
// import { toast } from 'react-toastify';

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const PaymentModal = ({ amount, onPaymentSuccess }) => {
//     const [clientSecret, setClientSecret] = useState('');

//     useEffect(() => {
//         const createIntent = async () => {
//             try {
//                 const user = JSON.parse(localStorage.getItem('user'));
//                 if (!user?.token) throw new Error('User not authenticated');
//                 const config = { headers: { Authorization: `Bearer ${user.token}` } };
                
//                 const response = await api.post('payments/create-payment-intent', { amount }, config);
//                 setClientSecret(response.data.clientSecret);
//             } catch (error) {
//                 toast.error('Failed to initialize payment form.');
//                 console.error('Error creating payment intent:', error);
//             }
//         };

//         if (amount > 0) {
//             createIntent();
//         }
//     }, [amount]);

//     const options = {
//         clientSecret,
//         appearance: { theme: 'night', labels: 'floating' },
//     };

//     return (
//         <div>
//             {clientSecret ? (
//                 <Elements options={options} stripe={stripePromise}>
//                     <PaymentForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
//                 </Elements>
//             ) : (
//                 <p>Initializing payment...</p>
//             )}
//         </div>
//     );
// };

// export default PaymentModal;