import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
// Import new icons
import { MoreHorizontal, Building2, BedDouble, Bath } from "lucide-react";

const PropertyCard = ({
  property,
  context = "public",
  onEdit,
  onDelete,
  onAssignLease,
  onViewPayments,
}) => {
  const isLandlordView = context === "landlord";

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg h-full border-2 border-transparent hover:border-primary/50">
      {/* Image section */}
      <div className="h-48 bg-muted/40 relative">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.address.street}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/20">
            <Building2 className="h-10 w-10 mb-2 opacity-60" />
            <span>No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={property.status === "Rented" ? "default" : "secondary"}
            className="bg-white/80 backdrop-blur-sm text-black hover:bg-white"
          >
            {property.status || "Vacant"}
          </Badge>
        </div>
      </div>

      {/* Content wrapper */}
      <div className="flex flex-col flex-grow p-4 space-y-4">
        <CardHeader className="flex-row gap-4 items-start p-0">
          <div className="flex-grow">
            <CardTitle className="text-lg leading-tight">
              {property.address.street}
            </CardTitle>
            <CardDescription>
              {property.address.city}, {property.address.state}
            </CardDescription>
          </div>
          {isLandlordView && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 w-8 h-8"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => onViewPayments(property.activeLeaseId)}
                  disabled={property.status !== "Rented"}
                  className="cursor-pointer"
                >
                  View Payments
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onAssignLease(property)}
                  className="cursor-pointer"
                >
                  Assign Lease
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onEdit(property)}
                  className="cursor-pointer"
                >
                  Edit Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(property._id)}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  Delete Property
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </CardHeader>

        <CardContent className="flex-grow p-0">
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            {property.propertyType && <span>{property.propertyType}</span>}
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <BedDouble className="h-4 w-4" /> {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <Bath className="h-4 w-4" /> {property.bathrooms}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-0 pt-4">
          <div className="text-2xl font-bold text-primary">
            ${property.rentAmount.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground">
              /month
            </span>
          </div>
        </CardFooter>
      </div>
    </Card>
  );
};

export default PropertyCard;

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, Building2 } from "lucide-react";

// // The component now accepts an 'onViewPayments' prop for the landlord context
// const PropertyCard = ({ property, context = 'public', onEdit, onDelete, onViewPayments }) => {
//   const isLandlordView = context === 'landlord';

//   return (
//     <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md h-full">
//       <div className="h-40 bg-muted/40">
//         {property.imageUrl ? (
//           <img
//             src={property.imageUrl}
//             alt={property.address.street}
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
//             <Building2 className="h-10 w-10 mb-2" />
//             <span>No Image</span>
//           </div>
//         )}
//       </div>

//       <div className="flex flex-col flex-grow p-4">
//         <CardHeader className="flex-row gap-4 items-start p-0">
//           <div className="flex-grow">
//             <CardTitle>{property.address.street}</CardTitle>
//             <CardDescription>{property.address.city}, {property.address.state}</CardDescription>
//           </div>
//           {/* The action menu only shows in the 'landlord' context */}
//           {isLandlordView && (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8"><MoreHorizontal className="h-4 w-4" /></Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem
//                   onClick={() => onViewPayments(property.activeLeaseId)}
//                   disabled={property.status !== 'Rented'}
//                   className="cursor-pointer"
//                 >
//                   View Payments
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => onAssignLease(property)} className="cursor-pointer">
//                   Assign Lease Manually
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem onClick={() => onEdit(property)} className="cursor-pointer">
//                   Edit Details
//                 </DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => onDelete(property._id)} className="text-destructive focus:text-destructive cursor-pointer">
//                   Delete Property
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </CardHeader>

//         <CardContent className="flex-grow p-0 pt-4">
//           <div className="text-2xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</div>
//         </CardContent>
//       </div>

//       <CardFooter className="p-4 pt-0">
//         <Badge variant={property.status === 'Rented' ? 'success' : 'secondary'}>
//             {property.status || 'Vacant'}
//         </Badge>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;
// // src/components/dashboard/PropertyCard.jsx

// import React from 'react';
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, Building2 } from "lucide-react";

// // The component now accepts a 'context' prop ('public' or 'landlord')
// const PropertyCard = ({ property, context = 'public', onEdit, onDelete , onViewPayments}) => {
//   const isLandlordView = context === 'landlord';

//   return (
//     <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md h-full">
//       <div className="h-48 bg-muted/40">
//         {property.imageUrl ? (
//           <img src={property.imageUrl} alt={property.address.street} className="h-full w-full object-cover" />
//         ) : (
//           <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
//             <Building2 className="h-10 w-10 mb-2" />
//             <span>No Image</span>
//           </div>
//         )}
//       </div>

//       <div className="flex flex-col flex-grow p-4">
//         <CardHeader className="flex-row gap-4 items-start p-0">
//           <div className="flex-grow">
//             <CardTitle>{property.address.street}</CardTitle>
//             <CardDescription>{property.address.city}, {property.address.state}</CardDescription>
//           </div>
//           {/* Landlord action menu only shows in the 'landlord' context */}
//           {isLandlordView && (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8"><MoreHorizontal className="h-4 w-4" /></Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem onClick={() => onEdit(property)}>Edit Details</DropdownMenuItem>
//                 <DropdownMenuItem onClick={() => onDelete(property._id)} className="text-destructive focus:text-destructive">Delete Property</DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </CardHeader>

//         <CardContent className="flex-grow p-0 pt-4">
//           <div className="text-2xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</div>
//         </CardContent>
//       </div>

//       <CardFooter className="p-4 pt-0">
//         {/* The status badge is now always visible */}
//         <Badge variant={property.status === 'Rented' ? 'destructive' : 'success'}>
//             {property.status}
//         </Badge>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, Building2, MapPin, DollarSign } from "lucide-react";

// // The 'onAssignLease' prop has been removed as this action is now handled through the application approval process.
// const PropertyCard = ({ property, onEdit, onDelete }) => {
//   return (
//     <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 h-full">
//       {/* Image section */}
//       <div className="h-48 w-full relative overflow-hidden bg-muted/40">
//         {property.imageUrl ? (
//           <img
//             src={property.imageUrl}
//             alt={`Image of ${property.address.street}`}
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//         ) : (
//           <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
//             <Building2 className="h-12 w-12 mb-3 opacity-70" />
//             <span className="text-sm font-medium">No Image Available</span>
//           </div>
//         )}
//       </div>

//       {/* Content wrapper */}
//       <div className="flex flex-col flex-grow p-6 space-y-4">
//         {/* Header with address and menu */}
//         <div className="flex justify-between items-start gap-4">
//           <div className="space-y-1.5">
//             <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
//               {property.address.street}
//             </CardTitle>
//             <div className="flex items-center text-muted-foreground text-sm">
//               <MapPin className="h-4 w-4 mr-1.5" />
//               <span>
//                 {property.address.city}, {property.address.state}
//               </span>
//             </div>
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
//               >
//                 <MoreHorizontal className="h-4 w-4" />
//                 <span className="sr-only">Open property menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               {/* "Assign Lease Manually" has been removed for a cleaner workflow */}
//               <DropdownMenuItem onClick={() => onEdit(property)} className="cursor-pointer">
//                 Edit Details
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => onDelete(property._id)}
//                 className="cursor-pointer text-destructive focus:text-destructive"
//               >
//                 Delete Property
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Property details */}
//         <CardContent className="p-0 space-y-4 mt-auto pt-4">
//           <div className="flex items-center">
//             <DollarSign className="h-5 w-5 mr-2 text-primary" />
//             <span className="text-2xl font-bold text-primary">
//               ${property.rentAmount.toLocaleString()}
//               <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
//             </span>
//           </div>
//         </CardContent>
//       </div>

//       {/* Footer with status */}
//       <CardFooter className="px-6 pb-6 pt-0">
//         <Badge
//           variant={property.status === 'Rented' ? 'success' : property.status === 'Vacant' ? 'secondary' : 'outline'}
//           className="text-sm px-3 py-1"
//         >
//           {property.status}
//         </Badge>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;
// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, Building2, MapPin, DollarSign } from "lucide-react";

// const PropertyCard = ({ property, onEdit, onDelete, onAssignLease }) => {
//   return (
//     <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg hover:border-primary/20 h-full">
//       {/* Image section */}
//       <div className="h-48 bg-muted/40 relative">
//         {property.imageUrl ? (
//           <img
//             src={property.imageUrl}
//             alt={`Image of ${property.address.street}`}
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted/30">
//             <Building2 className="h-12 w-12 mb-3 opacity-70" />
//             <span className="text-sm font-medium">No Image Available</span>
//           </div>
//         )}
//       </div>

//       {/* Content wrapper */}
//       <div className="flex flex-col flex-grow p-6 space-y-4">
//         {/* Header with address and menu */}
//         <div className="flex justify-between items-start gap-4">
//           <div className="space-y-1.5">
//             <CardTitle className="text-lg font-semibold leading-tight line-clamp-2">
//               {property.address.street}
//             </CardTitle>
//             <div className="flex items-center text-muted-foreground text-sm">
//               <MapPin className="h-4 w-4 mr-1.5" />
//               <span>
//                 {property.address.city}, {property.address.state} {property.address.zip}
//               </span>
//             </div>
//           </div>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
//               >
//                 <MoreHorizontal className="h-4 w-4" />
//                 <span className="sr-only">Open property menu</span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-48">
//               <DropdownMenuItem onClick={() => onAssignLease(property)} className="cursor-pointer">
//                 Assign Lease Manually
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => onEdit(property)} className="cursor-pointer">
//                 Edit Details
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => onDelete(property._id)}
//                 className="cursor-pointer text-destructive focus:text-destructive"
//               >
//                 Delete Property
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>

//         {/* Property details */}
//         <CardContent className="p-0 space-y-4">
//           <div className="flex items-center">
//             {/* <DollarSign className="h-5 w-5 mr-2 text-primary" /> */}
//             <span className="text-2xl font-bold text-primary">
//               ${property.rentAmount.toLocaleString()}
//               <span className="text-sm font-normal text-muted-foreground ml-1">/month</span>
//             </span>
//           </div>

//           {/* Additional details could go here */}
//           {/* <div className="flex items-center text-sm text-muted-foreground">
//             <Bed className="h-4 w-4 mr-2" />
//             {property.bedrooms} beds • {property.bathrooms} baths • {property.squareFootage} sqft
//           </div> */}
//         </CardContent>
//       </div>

//       {/* Footer with status */}
//       <CardFooter className="px-6 pb-6 pt-0">
//         <Badge
//           variant={property.status === 'Rented' ? 'success' : property.status === 'Vacant' ? 'secondary' : 'outline'}
//           className="text-sm px-3 py-1.5"
//         >
//           {property.status}
//         </Badge>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;

// // src/components/dashboard/PropertyCard.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal, Building2 } from "lucide-react";

// const PropertyCard = ({ property, onEdit, onDelete, onAssignLease }) => {
//   return (
//     // We keep the main card as a flex container
//     <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md">

//       {/* The image section remains at the top */}
//       <div className="h-40 bg-muted/40">
//         {property.imageUrl ? (
//           <img
//             src={property.imageUrl}
//             alt={`Image of ${property.address.street}`}
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
//             <Building2 className="h-10 w-10 mb-2" />
//             <span>No Image</span>
//           </div>
//         )}
//       </div>

//       {/* --- NEW: A wrapper div that will grow to fill the available space --- */}
//       <div className="flex flex-col flex-grow p-4">
//         <CardHeader className="flex-row gap-4 items-start p-0">
//           <div className="flex-grow">
//             <CardTitle>{property.address.street}</CardTitle>
//             <CardDescription>{property.address.city}, {property.address.state}</CardDescription>
//           </div>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8">
//                 <span className="sr-only">Open property menu</span>
//                 <MoreHorizontal className="h-4 w-4" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => onAssignLease(property)}>
//                 Assign Lease Manually
//               </DropdownMenuItem>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem onClick={() => onEdit(property)}>
//                 Edit Details
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => onDelete(property._id)} className="text-destructive focus:text-destructive">
//                 Delete Property
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </CardHeader>

//         {/* CardContent will now grow inside this new div */}
//         <CardContent className="flex-grow p-0 pt-4">
//           <div className="text-2xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</div>
//         </CardContent>
//       </div>

//       {/* --- The footer is now outside the growing div, so it will always be visible --- */}
//       <CardFooter className="p-4 pt-0">
//         <Badge variant={property.status === 'Rented' ? 'success' : 'secondary'}>
//             {property.status}
//         </Badge>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;

// // src/components/dashboard/PropertyCard.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";

// // The component now accepts an onSendInvite prop
// const PropertyCard = ({ property, onEdit, onDelete, onAssignLease, onSendInvite }) => {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="flex-row gap-4 items-start pb-4">
//         <div className="flex-grow">
//           <CardTitle>{property.address.street}</CardTitle>
//           <CardDescription>{property.address.city}, {property.address.state}</CardDescription>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8">
//               <span className="sr-only">Open property menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {/* --- ADD THIS NEW MENU ITEM --- */}
//             <DropdownMenuItem onClick={() => onSendInvite(property)}>
//               Create Tenant Invite
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={() => onAssignLease(property)}>
//               Assign Lease Manually
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onEdit(property)}>
//               Edit Details
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onDelete(property._id)} className="text-destructive focus:text-destructive">
//               Delete Property
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </CardHeader>
//       <CardContent className="flex-grow">
//         <div className="text-2xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</div>
//       </CardContent>
//       <CardFooter>
//         <Badge variant={property.status === 'Rented' ? 'success' : 'secondary'}>
//             {property.status}
//         </Badge>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;
// // src/components/dashboard/PropertyCard.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";

// // This component receives the property data and the handler functions as props
// const PropertyCard = ({ property, onEdit, onDelete, onAssignLease}) => {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="flex-row gap-4 items-start pb-4">
//         <div className="flex-grow">
//           <CardTitle>{property.address.street}</CardTitle>
//           <CardDescription>{property.address.city}, {property.address.state}</CardDescription>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8">
//               <span className="sr-only">Open property menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {/* --- ADD THIS NEW MENU ITEM --- */}
//           <DropdownMenuItem onClick={() => onAssignLease(property)}>
//             Assign Lease
//           </DropdownMenuItem>
//             {/* The onClick handlers are correctly wired up to the props from the dashboard */}
//             <DropdownMenuItem onClick={() => onEdit(property)}>
//               Edit Details
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onDelete(property._id)} className="text-destructive focus:text-destructive">
//               Delete Property
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </CardHeader>
//       <CardContent className="flex-grow">
//         <div className="text-2xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</div>
//       </CardContent>
//       <CardFooter>
//                 {/* --- THIS BADGE IS NOW DYNAMIC --- */}
//                 <Badge variant={property.status === 'Rented' ? 'success' : 'secondary'}>
//                     {property.status}
//                 </Badge>
//             </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;

// // src/components/dashboard/PropertyCard.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MoreHorizontal } from "lucide-react";

// // This component receives the property data and the handler functions as props
// const PropertyCard = ({ property, onEdit, onDelete }) => {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="flex-row gap-4 items-start pb-4">
//         <div className="flex-grow">
//           <CardTitle>{property.address.street}</CardTitle>
//           <CardDescription>{property.address.city}, {property.address.state}</CardDescription>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="icon" className="flex-shrink-0 w-8 h-8">
//               <span className="sr-only">Open property menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {/* The onClick handlers are now correctly wired up to the props */}
//             <DropdownMenuItem onClick={() => onEdit(property)}>
//               Edit Details
//             </DropdownMenuItem>
//             <DropdownMenuItem onClick={() => onDelete(property._id)} className="text-destructive focus:text-destructive">
//               Delete Property
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </CardHeader>
//       <CardContent className="flex-grow">
//         <div className="text-2xl font-bold text-primary">${property.rentAmount.toLocaleString()}/month</div>
//       </CardContent>
//       <CardFooter>
//         <Badge variant="secondary">Vacant</Badge>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PropertyCard;
