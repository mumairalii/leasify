// // // // src/pages/PropertyDetailPage.jsx

// src/pages/PropertyDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createApplication } from "../features/applications/applicationSlice";
import api from "../services/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ApplicationForm from "@/components/forms/ApplicationForm";

const PropertyDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { isLoading: isApplicationLoading } = useSelector(
    (state) => state.applications
  );

  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(""); // <-- THIS IS THE MISSING LINE

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      setError(""); // Reset error on new fetch
      try {
        const response = await api.get(`/properties/public/${id}`);
        setProperty(response.data);
      } catch (err) {
        // Now this will correctly set the error state
        setError("Property not found or is no longer available.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleApplySubmit = (formData) => {
    const applicationData = {
      ...formData,
      propertyId: id,
    };
    dispatch(createApplication(applicationData))
      .unwrap()
      .then(() => {
        toast.success("Your application has been submitted successfully!");
        setIsApplyModalOpen(false);
      })
      .catch((errorMessage) => {
        toast.error(
          errorMessage ||
            "Failed to submit application. You may have already applied."
        );
      });
  };

  const handleOpenApplyModal = () => {
    if (!user) {
      toast.info("Please log in or register to apply.");
      navigate("/login", { state: { from: location } });
      return;
    }
    setIsApplyModalOpen(true);
  };

  const renderApplyButton = () => {
    if (property?.status === "Rented") {
      return (
        <Button size="lg" className="w-full" disabled>
          Property is Currently Rented
        </Button>
      );
    }
    if (user?.role === "landlord") {
      return (
        <Button size="lg" className="w-full" disabled>
          You are logged in as a Landlord
        </Button>
      );
    }
    return (
      <Button size="lg" className="w-full" onClick={handleOpenApplyModal}>
        Apply Now
      </Button>
    );
  };

  if (isLoading)
    return <div className="text-center p-10">Loading property details...</div>;
  // This line will now work correctly because the 'error' state exists
  if (error)
    return <div className="text-center p-10 text-destructive">{error}</div>;
  if (!property) return null;

  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              {property.imageUrl ? (
                <img
                  src={property.imageUrl}
                  alt={`Image of ${property.address.street}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
                  <Building2 className="h-16 w-16 mb-4 opacity-70" />
                  <span className="text-lg font-medium">
                    No Image Available
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold">
              {property.address.street}
            </h1>
            <p className="text-xl text-muted-foreground">
              {property.address.city}, {property.address.state}{" "}
              {property.address.zipCode}
            </p>
            <p className="text-4xl font-bold text-primary">
              ${property.rentAmount.toLocaleString()}/month
            </p>
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                This is a placeholder description. This beautiful property
                features modern amenities and a prime location. Contact us to
                learn more and schedule a viewing.
              </p>
            </div>
            {renderApplyButton()}
          </div>
        </div>
      </div>

      <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for {property.address.street}</DialogTitle>
            <DialogDescription>
              Please provide your desired lease terms.
            </DialogDescription>
          </DialogHeader>
          <ApplicationForm
            onSubmit={handleApplySubmit}
            onCancel={() => setIsApplyModalOpen(false)}
            isLoading={isApplicationLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyDetailPage;

// /**
//  * PropertyDetailPage.jsx
//  * Displays the full details for a single public property listing, allows eligible users to apply,
//  * and shows recommendations for similar properties.
//  */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   getPublicPropertyById,
//   getRecommendedProperties,
// } from "../features/properties/propertySlice";
// import { createApplication } from "../features/applications/applicationSlice";
// import { toast } from "react-toastify";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Building2, BedDouble, Bath } from "lucide-react";

// // --- Custom Component Imports ---
// import ApplicationForm from "@/components/forms/ApplicationForm";
// import PropertyCard from "@/components/dashboard/PropertyCard"; // For recommendations

// const PropertyDetailPage = () => {
//   const { propertyId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   // --- THIS IS THE FIX: Select from the correct state structure ---
//   const { publicSelectedProperty, recommendations, isError, message } =
//     useSelector((state) => state.properties);
//   const { isLoading: isApplicationLoading } = useSelector(
//     (state) => state.applications
//   );

//   // Destructure from the correct state object
//   const { data: property, isLoading } = publicSelectedProperty;

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     if (propertyId) {
//       dispatch(getPublicPropertyById(propertyId));
//       dispatch(getRecommendedProperties(propertyId));
//     }
//   }, [dispatch, propertyId]);

//   // --- Error Handling Effect ---
//   useEffect(() => {
//     if (isError && !isLoading) {
//       toast.error(message || "An error occurred");
//     }
//   }, [isError, isLoading, message]);

//   // --- Handler Functions (handleApplySubmit, handleOpenApplyModal, renderApplyButton) ---
//   // These functions remain unchanged as their logic is already correct.

//   if (isLoading)
//     return <div className="text-center p-10">Loading property details...</div>;
//   if (isError || !property)
//     return (
//       <div className="text-center p-10 text-destructive">
//         Property not found or is no longer available.
//       </div>
//     );

//   return (
//     <>
//       <div className="container mx-auto p-4 md:p-8">
//         <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
//           {/* Image Column */}
//           <div>
//             <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
//               {property.imageUrl ? (
//                 <img
//                   src={property.imageUrl}
//                   alt={`Image of ${property.address.street}`}
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
//                   <Building2 className="h-16 w-16 mb-4 opacity-70" />
//                   <span className="text-lg font-medium">
//                     No Image Available
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Details Column */}
//           <div className="space-y-6">
//             <h1 className="text-3xl md:text-4xl font-bold">
//               {property.address.street}
//             </h1>
//             <p className="text-xl text-muted-foreground">
//               {property.address.city}, {property.address.state}{" "}
//               {property.address.zipCode}
//             </p>
//             <div className="flex items-center text-sm text-muted-foreground space-x-4">
//               {/* ... property stats ... */}
//             </div>
//             <p className="text-4xl font-bold text-primary">
//               ${property.rentAmount.toLocaleString()}
//               <span className="text-lg font-normal text-muted-foreground">
//                 /month
//               </span>
//             </p>
//             <div className="border-t pt-6">
//               <h3 className="text-lg font-semibold mb-2">Description</h3>
//               <p className="text-muted-foreground">
//                 {property.description || "No description provided."}
//               </p>
//             </div>
//             {renderApplyButton()}
//           </div>
//         </div>

//         {/* Recommendations Section */}
//         {recommendations && recommendations.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-3xl font-bold mb-6 text-center">
//               You Might Also Like
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {recommendations.map((prop) => (
//                 <PropertyCard key={prop._id} property={prop} context="public" />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//       <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Apply for {property.address.street}</DialogTitle>
//             <DialogDescription>
//               Please provide your desired lease terms and a message for the
//               landlord.
//             </DialogDescription>
//           </DialogHeader>
//           <ApplicationForm
//             onSubmit={handleApplySubmit}
//             onCancel={() => setIsApplyModalOpen(false)}
//             isLoading={isApplicationLoading}
//           />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default PropertyDetailPage;

// /**
//  * PropertyDetailPage.jsx
//  * Displays the full details for a single public property listing, allows eligible users to apply,
//  * and shows recommendations for similar properties.
//  */
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   getPublicPropertyById,
//   getRecommendedProperties,
// } from "../features/properties/propertySlice";
// import { createApplication } from "../features/applications/applicationSlice";
// import { toast } from "react-toastify";

// // --- UI & Icon Imports ---
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Building2, BedDouble, Bath } from "lucide-react";

// // --- Custom Component Imports ---
// import ApplicationForm from "@/components/forms/ApplicationForm";
// import PropertyCard from "@/components/dashboard/PropertyCard"; // For recommendations

// const PropertyDetailPage = () => {
//   const { propertyId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dispatch = useDispatch();

//   // --- State for UI control ---
//   const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

//   // --- Redux State Selectors ---
//   const { user } = useSelector((state) => state.auth);
//   const { selectedProperty, recommendations, isError, message } = useSelector(
//     (state) => state.properties
//   );
//   const { isLoading: isApplicationLoading } = useSelector(
//     (state) => state.applications
//   );

//   const { data: property, isLoading } = selectedProperty;

//   // --- Data Fetching Effect ---
//   useEffect(() => {
//     if (propertyId) {
//       dispatch(getPublicPropertyById(propertyId));
//       dispatch(getRecommendedProperties(propertyId));
//     }
//   }, [dispatch, propertyId]);

//   // --- Error Handling Effect ---
//   useEffect(() => {
//     if (isError && !isLoading) {
//       // Only show toast if not loading
//       toast.error(message || "An error occurred");
//     }
//   }, [isError, isLoading, message]);

//   // --- Handler Functions ---
//   const handleApplySubmit = (formData) => {
//     const applicationData = {
//       ...formData,
//       propertyId: propertyId,
//     };
//     dispatch(createApplication(applicationData))
//       .unwrap()
//       .then(() => {
//         toast.success("Your application has been submitted successfully!");
//         setIsApplyModalOpen(false);
//       })
//       .catch((errorMessage) => {
//         toast.error(
//           errorMessage ||
//             "Failed to submit application. You may have already applied."
//         );
//       });
//   };

//   const handleOpenApplyModal = () => {
//     if (!user) {
//       toast.info("Please log in or register to apply.");
//       navigate("/login", { state: { from: location } });
//       return;
//     }
//     setIsApplyModalOpen(true);
//   };

//   const renderApplyButton = () => {
//     if (property?.status === "Rented") {
//       return (
//         <Button size="lg" className="w-full" disabled>
//           Property is Currently Rented
//         </Button>
//       );
//     }
//     if (user?.role === "landlord") {
//       return (
//         <Button size="lg" className="w-full" disabled>
//           You are logged in as a Landlord
//         </Button>
//       );
//     }
//     return (
//       <Button size="lg" className="w-full" onClick={handleOpenApplyModal}>
//         Apply Now
//       </Button>
//     );
//   };

//   if (isLoading)
//     return <div className="text-center p-10">Loading property details...</div>;
//   if (isError || !property)
//     return (
//       <div className="text-center p-10 text-destructive">
//         Property not found or is no longer available.
//       </div>
//     );

//   return (
//     <>
//       <div className="container mx-auto p-4 md:p-8">
//         <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
//           {/* Image Column */}
//           <div>
//             <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
//               {property.imageUrl ? (
//                 <img
//                   src={property.imageUrl}
//                   alt={`Image of ${property.address.street}`}
//                   className="h-full w-full object-cover"
//                 />
//               ) : (
//                 <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
//                   <Building2 className="h-16 w-16 mb-4 opacity-70" />
//                   <span className="text-lg font-medium">
//                     No Image Available
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//           {/* Details Column */}
//           <div className="space-y-6">
//             <h1 className="text-3xl md:text-4xl font-bold">
//               {property.address.street}
//             </h1>
//             <p className="text-xl text-muted-foreground">
//               {property.address.city}, {property.address.state}{" "}
//               {property.address.zipCode}
//             </p>

//             <div className="flex items-center text-sm text-muted-foreground space-x-4">
//               {property.propertyType && <span>{property.propertyType}</span>}
//               {property.bedrooms > 0 && (
//                 <span className="flex items-center gap-1.5">
//                   <BedDouble className="h-4 w-4" /> {property.bedrooms} Beds
//                 </span>
//               )}
//               {property.bathrooms > 0 && (
//                 <span className="flex items-center gap-1.5">
//                   <Bath className="h-4 w-4" /> {property.bathrooms} Baths
//                 </span>
//               )}
//             </div>

//             <p className="text-4xl font-bold text-primary">
//               ${property.rentAmount.toLocaleString()}
//               <span className="text-lg font-normal text-muted-foreground">
//                 /month
//               </span>
//             </p>

//             <div className="border-t pt-6">
//               <h3 className="text-lg font-semibold mb-2">Description</h3>
//               <p className="text-muted-foreground">
//                 {property.description || "No description provided."}
//               </p>
//             </div>

//             {renderApplyButton()}
//           </div>
//         </div>

//         {/* Recommendations Section */}
//         {recommendations && recommendations.length > 0 && (
//           <div className="mt-16">
//             <h2 className="text-3xl font-bold mb-6 text-center">
//               You Might Also Like
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {recommendations.map((prop) => (
//                 <PropertyCard key={prop._id} property={prop} context="public" />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Apply for {property.address.street}</DialogTitle>
//             <DialogDescription>
//               Please provide your desired lease terms and a message for the
//               landlord.
//             </DialogDescription>
//           </DialogHeader>
//           <ApplicationForm
//             onSubmit={handleApplySubmit}
//             onCancel={() => setIsApplyModalOpen(false)}
//             isLoading={isApplicationLoading}
//           />
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default PropertyDetailPage;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { createApplication } from '../features/applications/applicationSlice';
// import api from '../services/api';
// import { Button } from "@/components/ui/button";
// import { toast } from 'react-toastify';
// import { Building2 } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import ApplicationForm from '@/components/forms/ApplicationForm';

// const PropertyDetailPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();

//     const { user } = useSelector((state) => state.auth);
//     const { isLoading: isApplicationLoading } = useSelector((state) => state.applications);

//     const [property, setProperty] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(''); // <-- THIS IS THE MISSING LINE

//     const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

//     useEffect(() => {
//         const fetchProperty = async () => {
//             setIsLoading(true);
//             setError(''); // Reset error on new fetch
//             try {
//                 const response = await api.get(`/properties/public/${id}`);
//                 setProperty(response.data);
//             } catch (err) {
//                 // Now this will correctly set the error state
//                 setError('Property not found or is no longer available.');
//                 console.error(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperty();
//     }, [id]);

//     const handleApplySubmit = (formData) => {
//         const applicationData = {
//             ...formData,
//             propertyId: id,
//         };
//         dispatch(createApplication(applicationData))
//             .unwrap()
//             .then(() => {
//                 toast.success("Your application has been submitted successfully!");
//                 setIsApplyModalOpen(false);
//             })
//             .catch((errorMessage) => {
//                 toast.error(errorMessage || "Failed to submit application. You may have already applied.");
//             });
//     };

//     const handleOpenApplyModal = () => {
//         if (!user) {
//             toast.info("Please log in or register to apply.");
//             navigate('/login', { state: { from: location } });
//             return;
//         }
//         setIsApplyModalOpen(true);
//     };

//     const renderApplyButton = () => {
//         if (property?.status === 'Rented') {
//             return <Button size="lg" className="w-full" disabled>Property is Currently Rented</Button>;
//         }
//         if (user?.role === 'landlord') {
//             return <Button size="lg" className="w-full" disabled>You are logged in as a Landlord</Button>;
//         }
//         return <Button size="lg" className="w-full" onClick={handleOpenApplyModal}>Apply Now</Button>;
//     };

//     if (isLoading) return <div className="text-center p-10">Loading property details...</div>;
//     // This line will now work correctly because the 'error' state exists
//     if (error) return <div className="text-center p-10 text-destructive">{error}</div>;
//     if (!property) return null;

//     return (
//         <>
//             <div className="container mx-auto p-4 md:p-8">
//                 <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
//                     <div>
//                         <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
//                             {property.imageUrl ? (
//                                 <img src={property.imageUrl} alt={`Image of ${property.address.street}`} className="h-full w-full object-cover" />
//                             ) : (
//                                 <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
//                                     <Building2 className="h-16 w-16 mb-4 opacity-70" />
//                                     <span className="text-lg font-medium">No Image Available</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="space-y-6">
//                         <h1 className="text-3xl md:text-4xl font-bold">{property.address.street}</h1>
//                         <p className="text-xl text-muted-foreground">{property.address.city}, {property.address.state} {property.address.zipCode}</p>
//                         <p className="text-4xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</p>
//                         <div className="border-t pt-6">
//                             <h3 className="text-lg font-semibold mb-2">Description</h3>
//                             <p className="text-muted-foreground">
//                                 This is a placeholder description. This beautiful property features modern amenities and a prime location. Contact us to learn more and schedule a viewing.
//                             </p>
//                         </div>
//                         {renderApplyButton()}
//                     </div>
//                 </div>
//             </div>

//             <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Apply for {property.address.street}</DialogTitle>
//                         <DialogDescription>Please provide your desired lease terms.</DialogDescription>
//                     </DialogHeader>
//                     <ApplicationForm
//                         onSubmit={handleApplySubmit}
//                         onCancel={() => setIsApplyModalOpen(false)}
//                         isLoading={isApplicationLoading}
//                     />
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export default PropertyDetailPage;
// // src/pages/PropertyDetailPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { createApplication } from '../features/applications/applicationSlice';
// import api from '../services/api';
// import { Button } from "@/components/ui/button";
// import { toast } from 'react-toastify';
// import { Building2 } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";

// const PropertyDetailPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();

//     const { user } = useSelector((state) => state.auth);
//     const { isLoading: isApplicationLoading } = useSelector((state) => state.applications);

//     const [property, setProperty] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     // State for the application modal
//     const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
//     const [applicationMessage, setApplicationMessage] = useState('');

//     useEffect(() => {
//         const fetchProperty = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await api.get(`/properties/public/${id}`);
//                 setProperty(response.data);
//             } catch (err) {
//                 setError('Property not found or is no longer available.');
//                 console.error(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperty();
//     }, [id]);

//     const handleApplySubmit = (e) => {
//         e.preventDefault();
//         dispatch(createApplication({ propertyId: id, message: applicationMessage }))
//             .unwrap()
//             .then(() => {
//                 toast.success("Your application has been submitted successfully!");
//                 setIsApplyModalOpen(false);
//             })
//             .catch((errorMessage) => {
//                 toast.error(errorMessage || "Failed to submit application. You may have already applied.");
//             });
//     };

//     const handleOpenApplyModal = () => {
//         if (!user) {
//             toast.info("Please log in or register to apply.");
//             navigate('/login', { state: { from: location } });
//             return;
//         }
//         setIsApplyModalOpen(true);
//     };

//     const renderApplyButton = () => {
//         // First, check if the property is already rented
//         if (property?.status === 'Rented') {
//             return <Button size="lg" className="w-full" disabled>Property is Rented</Button>;
//         }

//         // Next, check the user's role
//         if (user?.role === 'landlord') {
//             return <Button size="lg" className="w-full" disabled>You are logged in as a Landlord</Button>;
//         }

//         // If the user is a tenant or not logged in, show the apply button
//         // The modal logic will handle redirecting to login if they are not logged in.
//         return <Button size="lg" className="w-full" onClick={handleOpenApplyModal}>Apply Now</Button>;
//     };

//     if (isLoading) return <div className="text-center p-10">Loading property details...</div>;
//     if (error) return <div className="text-center p-10 text-destructive">{error}</div>;
//     if (!property) return null;

//     return (
//         <>
//             <div className="container mx-auto p-4 md:p-8">
//                 <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
//                     <div>
//                         <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
//                             {property.imageUrl ? (
//                                 <img src={property.imageUrl} alt={`Image of ${property.address.street}`} className="h-full w-full object-cover" />
//                             ) : (
//                                 <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
//                                     <Building2 className="h-16 w-16 mb-4 opacity-70" />
//                                     <span className="text-lg font-medium">No Image Available</span>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                     <div className="space-y-6">
//                         <h1 className="text-3xl md:text-4xl font-bold">{property.address.street}</h1>
//                         <p className="text-xl text-muted-foreground">{property.address.city}, {property.address.state} {property.address.zipCode}</p>
//                         <p className="text-4xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</p>
//                         <div className="border-t pt-6">
//                             <h3 className="text-lg font-semibold mb-2">Description</h3>
//                             <p className="text-muted-foreground">
//                                 This is a placeholder description. This beautiful property features modern amenities and a prime location. Contact us to learn more and schedule a viewing.
//                             </p>
//                         </div>
//                         {renderApplyButton()}
//                     </div>
//                 </div>
//             </div>

//             {/* Application Modal */}
//             <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Apply for {property.address.street}</DialogTitle>
//                         <DialogDescription>Submit your application to the landlord. You can include a brief message.</DialogDescription>
//                     </DialogHeader>
//                     <form onSubmit={handleApplySubmit} className="space-y-4">
//                         <div>
//                             <Label htmlFor="message">Your Message to the Landlord (Optional)</Label>
//                             <Textarea
//                                 id="message"
//                                 placeholder="Introduce yourself or ask any questions..."
//                                 value={applicationMessage}
//                                 onChange={(e) => setApplicationMessage(e.target.value)}
//                             />
//                         </div>
//                         <Button type="submit" className="w-full" disabled={isApplicationLoading}>
//                             {isApplicationLoading ? 'Submitting...' : 'Submit Application'}
//                         </Button>
//                     </form>
//                 </DialogContent>
//             </Dialog>
//         </>
//     );
// };

// export default PropertyDetailPage;
// // src/pages/PropertyDetailPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { createApplication } from '../features/applications/applicationSlice';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import api from '../services/api';
// import { Button } from '@/components/ui/button';
// import { toast } from 'react-toastify';
// import { Building2 } from 'lucide-react';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';

// const PropertyDetailPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();

//     // Get the current user's role from the Redux store
//     const { user } = useSelector((state) => state.auth);

//     const [property, setProperty] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchProperty = async () => {
//             setIsLoading(true);
//             try {
//                 const response = await api.get(`/properties/public/${id}`);
//                 setProperty(response.data);
//             } catch (err) {
//                 setError('Property not found or is no longer available.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperty();
//     }, [id]);

//     const handleApplyNow = () => {
//         // This function is only callable by a tenant because of the button logic below
//         dispatch(createApplication({ propertyId: id, message: "I am interested in this property." }))
//             .unwrap()
//             .then(() => {
//                 toast.success("Your application has been submitted successfully!");
//             })
//             .catch((errorMessage) => {
//                 toast.error(errorMessage || "Failed to submit application. You may have already applied.");
//             });
//     };

//     // --- THIS IS THE HELPER FUNCTION THAT CONTAINS THE LOGIC YOU'RE LOOKING FOR ---
//     const renderApplyButton = () => {
//         // Case 1: The user is a landlord
//         if (user?.role === 'landlord') {
//             return (
//                 <Button size="lg" className="w-full" disabled>
//                     You are logged in as a Landlord
//                 </Button>
//             );
//         }

//         // Case 2: The user is a tenant
//         if (user?.role === 'tenant') {
//             return (
//                 <Button size="lg" className="w-full" onClick={handleApplyNow}>
//                     Apply Now
//                 </Button>
//             );
//         }

//         // Case 3: The user is not logged in
//         return (
//             <Button size="lg" className="w-full" asChild>
//                 <Link to="/login" state={{ from: location }}>Login to Apply</Link>
//             </Button>
//         );
//     };

//     if (isLoading) return <div className="text-center p-10">Loading property details...</div>;
//     if (error) return <div className="text-center p-10 text-destructive">{error}</div>;
//     if (!property) return null;

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
//                 <div>
//                     <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
//                         {property.imageUrl ? (
//                             <img src={property.imageUrl} alt={`Image of ${property.address.street}`} className="h-full w-full object-cover" />
//                         ) : (
//                             <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
//                                 <Building2 className="h-16 w-16 mb-4 opacity-70" />
//                                 <span className="text-lg font-medium">No Image Available</span>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//                 <div className="space-y-6">
//                     <h1 className="text-3xl md:text-4xl font-bold">{property.address.street}</h1>
//                     <p className="text-xl text-muted-foreground">{property.address.city}, {property.address.state} {property.address.zipCode}</p>
//                     <p className="text-4xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</p>
//                     <div className="border-t pt-6">
//                         <h3 className="text-lg font-semibold mb-2">Description</h3>
//                         <p className="text-muted-foreground">
//                             This is a placeholder description. This beautiful property features modern amenities and a prime location. Contact us to learn more and schedule a viewing.
//                         </p>
//                     </div>
//                     {/* The button is now rendered by our smart helper function */}
//                     {renderApplyButton()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyDetailPage;

// // src/pages/PropertyDetailPage.jsx

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { createApplication } from '../features/applications/applicationSlice';
// import api from '../services/api';
// import { Button } from '@/components/ui/button';
// import { toast } from 'react-toastify';

// const PropertyDetailPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();

//     // Get the current user from the Redux store
//     const { user } = useSelector((state) => state.auth);

//     const [property, setProperty] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchProperty = async () => {
//             try {
//                 const response = await api.get(`/properties/public/${id}`);
//                 setProperty(response.data);
//             } catch (err) {
//                 setError('Property not found or is no longer available.');
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperty();
//     }, [id]);

//     const handleApplyNow = () => {
//         // This function is now only called if the user is a tenant
//         dispatch(createApplication({ propertyId: id, message: "I am interested in this property." }))
//             .unwrap()
//             .then(() => {
//                 toast.success("Your application has been submitted successfully!");
//             })
//             .catch((errorMessage) => {
//                 toast.error(errorMessage || "Failed to submit application. You may have already applied.");
//             });
//     };

//     // --- NEW: A helper function to render the correct button based on user role ---
//     const renderApplyButton = () => {
//         if (user?.role === 'landlord') {
//             return (
//                 <Button size="lg" className="w-full" disabled>
//                     You are logged in as a Landlord
//                 </Button>
//             );
//         }

//         if (user?.role === 'tenant') {
//             return (
//                 <Button size="lg" className="w-full" onClick={handleApplyNow}>
//                     Apply Now
//                 </Button>
//             );
//         }

//         // If no user, show a link to the login page
//         return (
//             <Button size="lg" className="w-full" asChild>
//                 <Link to="/login" state={{ from: location }}>Login to Apply</Link>
//             </Button>
//         );
//     };

//     if (isLoading) return <div className="text-center p-10">Loading property details...</div>;
//     if (error) return <div className="text-center p-10 text-destructive">{error}</div>;
//     if (!property) return null;

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <div className="grid md:grid-cols-2 gap-8">
//                 <div>
//                     <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
//                         <p className="text-muted-foreground">Property Image Gallery</p>
//                     </div>
//                 </div>
//                 <div className="space-y-6">
//                     <h1 className="text-3xl md:text-4xl font-bold">{property.address.street}</h1>
//                     <p className="text-xl text-muted-foreground">{property.address.city}, {property.address.state}</p>
//                     <p className="text-4xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</p>
//                     <div className="border-t pt-6">
//                         <h3 className="text-lg font-semibold mb-2">Description</h3>
//                         <p className="text-muted-foreground">
//                             This is a placeholder description. This beautiful property features modern amenities and a prime location. Contact us to learn more and schedule a viewing.
//                         </p>
//                     </div>
//                     {/* The button is now rendered by our smart helper function */}
//                     {renderApplyButton()}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyDetailPage;

// // src/pages/PropertyDetailPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import api from '../services/api';
// import { Button } from '@/components/ui/button';

// const PropertyDetailPage = () => {
//     const { id } = useParams(); // Get the property ID from the URL
//     const [property, setProperty] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchProperty = async () => {
//             try {
//                 const response = await api.get(`/properties/public/${id}`);
//                 setProperty(response.data);
//             } catch (err) {
//                 setError('Property not found or is no longer available.');
//                 console.error(err);
//             } finally {
//                 setIsLoading(false);
//             }
//         };
//         fetchProperty();
//     }, [id]);

//     if (isLoading) return <div className="text-center p-10">Loading property details...</div>;
//     if (error) return <div className="text-center p-10 text-destructive">{error}</div>;
//     if (!property) return null;

//     return (
//         <div className="container mx-auto p-4 md:p-8">
//             <div className="grid md:grid-cols-2 gap-8">
//                 <div>
//                     {/* Placeholder for images */}
//                     <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
//                         <p className="text-muted-foreground">Property Image Gallery</p>
//                     </div>
//                 </div>
//                 <div className="space-y-6">
//                     <h1 className="text-3xl md:text-4xl font-bold">{property.address.street}</h1>
//                     <p className="text-xl text-muted-foreground">{property.address.city}, {property.address.state} {property.address.zipCode}</p>
//                     <p className="text-4xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</p>
//                     <div className="border-t pt-6">
//                         <h3 className="text-lg font-semibold mb-2">Description</h3>
//                         <p className="text-muted-foreground">
//                             This is a placeholder description. This beautiful property features modern amenities and a prime location. Contact us to learn more and schedule a viewing.
//                         </p>
//                     </div>
//                     <Button size="lg" className="w-full">
//                         Apply Now
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PropertyDetailPage;
