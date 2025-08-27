import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../forms/StripePaymentForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import api from "../../services/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const StripePaymentModal = ({ isOpen, onClose, lease }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && lease?._id) {
      setIsLoading(true);
      setError(null);
      setClientSecret("");

      const createIntent = async () => {
        try {
          const response = await api.post(
            "/tenant/payments/create-payment-intent",
            { leaseId: lease._id }
          );
          setClientSecret(response.data.clientSecret);
          // Store the payment ID in sessionStorage for the StripePaymentForm to access
          if (response.data.paymentId) {
            sessionStorage.setItem("currentPaymentId", response.data.paymentId);
          }
        } catch (err) {
          console.error("Failed to create payment intent:", err);
          const errorMessage = err.response?.data?.message || err.message;
          setError(errorMessage);
          toast.error("Payment Error", { description: errorMessage });
        } finally {
          setIsLoading(false);
        }
      };

      createIntent();
    }
  }, [isOpen, lease]);

  const appearance = { theme: "stripe" };
  const options = { clientSecret, appearance };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 pt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-24 ml-auto" />
        </div>
      );
    }
    if (error) {
      return <p className="text-red-500 text-center py-4">Error: {error}</p>;
    }
    if (clientSecret) {
      return (
        <Elements options={options} stripe={stripePromise}>
          <StripePaymentForm onCancel={onClose} />
        </Elements>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* --- THIS IS THE FIX --- */}
      {/* 1. Set a max-height and flex-col layout on the main content container */}
      <DialogContent className="sm:max-w-md max-h-[95vh] flex flex-col p-0">
        {/* 2. The header remains fixed at the top */}
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle>Online Rent Payment</DialogTitle>
          <DialogDescription>
            Pay your rent of ${lease?.rentAmount?.toFixed(2)} for the property
            at {lease?.property?.address?.street}.
          </DialogDescription>
        </DialogHeader>

        {/* 3. This div will grow and scroll if its content overflows */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {renderContent()}
        </div>
      </DialogContent>
      {/* --- END OF FIX --- */}
    </Dialog>
  );
};

StripePaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  lease: PropTypes.object,
};

export default StripePaymentModal;

// import React, { useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import { Elements } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import StripePaymentForm from "../forms/StripePaymentForm";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { toast } from "sonner";
// import { Skeleton } from "@/components/ui/skeleton";

// // Load your Stripe public key from environment variables
// // This should be done outside the component to avoid reloading on every render
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// const StripePaymentModal = ({ isOpen, onClose, lease }) => {
//   const [clientSecret, setClientSecret] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // Only run this effect if the modal is open and we have a lease with an ID
//     if (isOpen && lease?._id) {
//       setIsLoading(true);
//       setError(null);
//       setClientSecret(""); // Reset previous client secret

//       // This async function fetches the client secret from your backend
//       const createIntent = async () => {
//         try {
//           // You need to replace this with your actual API call setup, e.g., using axios or a custom fetch wrapper
//           const response = await fetch(
//             "/api/tenant/payments/create-payment-intent",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 // Make sure to include your authentication token
//                 Authorization: `Bearer ${
//                   JSON.parse(localStorage.getItem("user"))?.token
//                 }`,
//               },
//               body: JSON.stringify({ leaseId: lease._id }), // **Crucially, we pass the leaseId here**
//             }
//           );

//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(
//               errorData.message || "Failed to initialize payment."
//             );
//           }

//           const data = await response.json();
//           setClientSecret(data.clientSecret);
//         } catch (err) {
//           console.error("Failed to create payment intent:", err);
//           setError(err.message);
//           toast.error(err.message);
//         } finally {
//           setIsLoading(false);
//         }
//       };

//       createIntent();
//     }
//   }, [isOpen, lease]); // The effect re-runs if `isOpen` or `lease` changes

//   // Stripe Elements options
//   const appearance = {
//     theme: "stripe", // Can be 'stripe', 'night', 'flat', etc.
//   };

//   const options = {
//     clientSecret,
//     appearance,
//   };

//   // Helper to render the content based on the current state
//   const renderContent = () => {
//     if (isLoading) {
//       return (
//         <div className="space-y-4 pt-4">
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-full" />
//           <Skeleton className="h-10 w-24 ml-auto" />
//         </div>
//       );
//     }
//     if (error) {
//       return <p className="text-red-500 text-center py-4">Error: {error}</p>;
//     }
//     if (clientSecret) {
//       return (
//         <Elements options={options} stripe={stripePromise}>
//           <StripePaymentForm onCancel={onClose} />
//         </Elements>
//       );
//     }
//     return null; // Should not happen if logic is correct
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Online Rent Payment</DialogTitle>
//           <DialogDescription>
//             Pay your rent of ${lease?.rentAmount?.toFixed(2)} for the property
//             at {lease?.property?.address?.street}.
//           </DialogDescription>
//         </DialogHeader>
//         {renderContent()}
//       </DialogContent>
//     </Dialog>
//   );
// };

// StripePaymentModal.propTypes = {
//   isOpen: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired,
//   lease: PropTypes.object, // The active lease object
// };

// export default StripePaymentModal;
