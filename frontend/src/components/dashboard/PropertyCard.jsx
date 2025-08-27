// src/components/PropertyCard.jsx
import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropTypes from "prop-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MoreHorizontal,
  BedDouble,
  Bath,
  Home,
  ImageIcon,
  Pencil,
  Trash2,
  FileText,
  FilePlus2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PropertyStats = ({ property }) => {
  const stats = [
    property.propertyType && { icon: Home, label: property.propertyType },
    property.bedrooms && {
      icon: BedDouble,
      label: `${property.bedrooms} bed${property.bedrooms > 1 ? "s" : ""}`,
    },
    property.bathrooms && {
      icon: Bath,
      label: `${property.bathrooms} bath${property.bathrooms > 1 ? "s" : ""}`,
    },
  ].filter(Boolean);

  return stats.length > 0 ? (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
      {stats.map(({ icon: Icon, label }, index) => (
        <div key={index} className="flex items-center">
          <Icon className="mr-1.5 h-4 w-4 flex-shrink-0 opacity-70" />
          <span className="font-medium">{label}</span>
        </div>
      ))}
    </div>
  ) : null;
};

const PropertyCard = ({
  property,
  context = "public",
  onClick,
  onEdit,
  onDelete,
  onAssignLease,
  onViewPayments,
}) => {
  const isLandlordView = context === "landlord";

  const handleActionClick = (e, action) => {
    e.stopPropagation();
    action();
  };

  const statusConfig = {
    Rented: { variant: "secondary", text: "Rented" },
    Vacant: { variant: "default", text: "Available" },
    Maintenance: { variant: "destructive", text: "Under Maintenance" },
  };
  const currentStatus = statusConfig[property.status] || statusConfig.Vacant;

  return (
    <Card
      onClick={!isLandlordView ? onClick : undefined}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-xl transition-all duration-300 p-0 gap-0", // <-- FINAL FIX 1
        !isLandlordView &&
          "cursor-pointer hover:shadow-md hover:-translate-y-1",
        "border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent"
      )}
    >
      {/* Image Section */}
      <div className="group relative aspect-video w-full overflow-hidden">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={`View of ${property.address.street}`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
            <ImageIcon
              className="h-10 w-10 text-gray-300 dark:text-gray-600"
              strokeWidth={1.25}
            />
          </div>
        )}
        <Badge
          className="absolute top-3 right-3 shadow-sm"
          variant={currentStatus.variant}
        >
          {currentStatus.text}
        </Badge>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {" "}
        {/* <-- FINAL FIX 2 */}
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-lg font-semibold leading-tight line-clamp-1">
              {property.address.street}
            </CardTitle>
            <CardDescription className="text-sm line-clamp-1">
              {property.address.city}, {property.address.state}
            </CardDescription>
          </div>
          {isLandlordView && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-white dark:bg-gray-900 dark:border-gray-700"
              >
                <DropdownMenuItem
                  onClick={(e) =>
                    handleActionClick(e, () => onAssignLease(property))
                  }
                  disabled={property.status === "Rented"}
                  className="text-sm focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  <FilePlus2 className="mr-2 h-4 w-4" /> Assign Lease
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) =>
                    handleActionClick(e, () =>
                      onViewPayments(property.activeLeaseId)
                    )
                  }
                  disabled={!property.activeLeaseId}
                  className="text-sm focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  <FileText className="mr-2 h-4 w-4" /> View Payments
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem
                  onClick={(e) => handleActionClick(e, () => onEdit(property))}
                  className="text-sm focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) =>
                    handleActionClick(e, () => onDelete(property._id))
                  }
                  className="text-sm text-destructive focus:text-destructive focus:bg-gray-100 dark:focus:bg-gray-800"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        {/* Property Stats */}
        <div className="my-4">
          <PropertyStats property={property} />
        </div>
        {/* Footer */}
        <div className="mt-auto pt-4">
          <div className="flex flex-col xs:flex-row xs:items-end xs:justify-between gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Monthly Rent
              </p>
              <p className="text-xl font-bold text-primary">
                ${property.rentAmount.toLocaleString()}
                <span className="ml-1 text-base font-medium text-muted-foreground">
                  /mo
                </span>
              </p>
            </div>
            {!isLandlordView && (
              <Button
                variant="outline"
                size="sm"
                className="w-full xs:w-auto justify-center bg-white dark:bg-transparent dark:border-gray-600"
                tabIndex={-1}
              >
                <span className="hidden sm:inline">View</span> Details
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    address: PropTypes.shape({
      street: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
    }).isRequired,
    imageUrl: PropTypes.string,
    status: PropTypes.string,
    propertyType: PropTypes.string,
    bedrooms: PropTypes.number,
    bathrooms: PropTypes.number,
    rentAmount: PropTypes.number.isRequired,
    activeLeaseId: PropTypes.string,
  }).isRequired,
  context: PropTypes.oneOf(["public", "landlord"]),
  onClick: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onAssignLease: PropTypes.func,
  onViewPayments: PropTypes.func,
};

export default PropertyCard;

// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// // Import new icons
// import { MoreHorizontal, Building2, BedDouble, Bath } from "lucide-react";

// const PropertyCard = ({
//   property,
//   context = "public",
//   onEdit,
//   onDelete,
//   onAssignLease,
//   onViewPayments,
// }) => {
//   const isLandlordView = context === "landlord";

//   return (
//     <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg h-full border-2 border-transparent hover:border-primary/50">
//       {/* Image section */}
//       <div className="h-48 bg-muted/40 relative">
//         {property.imageUrl ? (
//           <img
//             src={property.imageUrl}
//             alt={property.address.street}
//             className="h-full w-full object-cover"
//           />
//         ) : (
//           <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/30 to-muted/20">
//             <Building2 className="h-10 w-10 mb-2 opacity-60" />
//             <span>No Image</span>
//           </div>
//         )}
//         <div className="absolute top-2 right-2">
//           <Badge
//             variant={property.status === "Rented" ? "default" : "secondary"}
//             className="bg-white/80 backdrop-blur-sm text-black hover:bg-white"
//           >
//             {property.status || "Vacant"}
//           </Badge>
//         </div>
//       </div>

//       {/* Content wrapper */}
//       <div className="flex flex-col flex-grow p-4 space-y-4">
//         <CardHeader className="flex-row gap-4 items-start p-0">
//           <div className="flex-grow">
//             <CardTitle className="text-lg leading-tight">
//               {property.address.street}
//             </CardTitle>
//             <CardDescription>
//               {property.address.city}, {property.address.state}
//             </CardDescription>
//           </div>
//           {isLandlordView && (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="flex-shrink-0 w-8 h-8"
//                 >
//                   <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end">
//                 <DropdownMenuItem
//                   onClick={() => onViewPayments(property.activeLeaseId)}
//                   disabled={property.status !== "Rented"}
//                   className="cursor-pointer"
//                 >
//                   View Payments
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() => onAssignLease(property)}
//                   className="cursor-pointer"
//                 >
//                   Assign Lease
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   onClick={() => onEdit(property)}
//                   className="cursor-pointer"
//                 >
//                   Edit Details
//                 </DropdownMenuItem>
//                 <DropdownMenuItem
//                   onClick={() => onDelete(property._id)}
//                   className="text-destructive focus:text-destructive cursor-pointer"
//                 >
//                   Delete Property
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           )}
//         </CardHeader>

//         <CardContent className="flex-grow p-0">
//           <div className="flex items-center text-sm text-muted-foreground space-x-4">
//             {property.propertyType && <span>{property.propertyType}</span>}
//             {property.bedrooms > 0 && (
//               <span className="flex items-center gap-1.5">
//                 <BedDouble className="h-4 w-4" /> {property.bedrooms}
//               </span>
//             )}
//             {property.bathrooms > 0 && (
//               <span className="flex items-center gap-1.5">
//                 <Bath className="h-4 w-4" /> {property.bathrooms}
//               </span>
//             )}
//           </div>
//         </CardContent>

//         <CardFooter className="p-0 pt-4">
//           <div className="text-2xl font-bold text-primary">
//             ${property.rentAmount.toLocaleString()}
//             <span className="text-sm font-normal text-muted-foreground">
//               /month
//             </span>
//           </div>
//         </CardFooter>
//       </div>
//     </Card>
//   );
// };

// export default PropertyCard;

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
