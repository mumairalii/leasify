// src/components/forms/PaymentForm.jsx

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { toast } from 'react-toastify';

const PaymentForm = ({ clientSecret, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        if (!stripe || !elements) {
            toast.error("Stripe has not loaded yet.");
            setIsLoading(false);
            return;
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (error) {
            toast.error(error.message || "An unexpected error occurred.");
        } else if (paymentIntent.status === 'succeeded') {
            toast.success('Payment successful!');
            if (onPaymentSuccess) {
                onPaymentSuccess(paymentIntent);
            }
        }
        
        setIsLoading(false);
    };

    const cardElementOptions = {
        style: {
            base: {
                color: "hsl(var(--foreground))",
                fontFamily: 'inherit',
                fontSize: '16px',
                '::placeholder': {
                    color: "hsl(var(--muted-foreground))",
                },
            },
            invalid: {
                color: "hsl(var(--destructive))",
                iconColor: "hsl(var(--destructive))",
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Card Details
                </label>
                <div className="p-3 rounded-md border border-input bg-transparent">
                    <CardElement options={cardElementOptions} />
                </div>
            </div>
            <Button type="submit" disabled={!stripe || isLoading} className="w-full">
                {isLoading ? 'Processing...' : 'Submit Payment'}
            </Button>
        </form>
    );
};

export default PaymentForm;