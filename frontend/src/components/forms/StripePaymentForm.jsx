import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const StripePaymentForm = ({ onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsLoading(true);
    setMessage(null);

    // Get the payment ID from sessionStorage
    const paymentId = sessionStorage.getItem("currentPaymentId");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/tenant/dashboard?payment_status=success&paymentId=${paymentId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
      toast.error(error.message);
    } else {
      setMessage("An unexpected error occurred.");
      toast.error("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement id="payment-element" />
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !stripe || !elements}>
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
      {/* Show any error or success messages */}
      {message && (
        <div id="payment-message" className="text-red-500 text-sm">
          {message}
        </div>
      )}
    </form>
  );
};

StripePaymentForm.propTypes = {
  onCancel: PropTypes.func.isRequired,
};

export default StripePaymentForm;
