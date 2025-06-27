// src/components/dashboard/ActivityFeed.jsx

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Bell, Wrench, CircleDollarSign, Building, User, FileText } from "lucide-react";

const LogIcon = ({ type }) => {
    switch (type) {
        case 'Communication':
            return <MessageSquare className="h-4 w-4" />;
        case 'Payment':
            return <CircleDollarSign className="h-4 w-4" />;
        case 'Maintenance':
            return <Wrench className="h-4 w-4" />;
        case 'Lease':
            return <FileText className="h-4 w-4" />;
        case 'System':
        default:
            return <Bell className="h-4 w-4" />;
    }
};

const ActivityFeed = ({ title, items = [] }) => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0">
        <ScrollArea className="h-[300px] w-full">
          <div className="space-y-6 p-6">
            {items.length > 0 ? items.map((item) => (
              // --- THIS IS THE NEW CSS GRID LAYOUT ---
              // It defines 3 columns:
              // 1. Icon (auto-width)
              // 2. Text (takes up all available free space)
              // 3. Timestamp (auto-width)
              <div key={item._id} className="grid grid-cols-[auto_1fr_auto] items-start gap-x-4">
                
                {/* Column 1: The Icon */}
                <Avatar className="h-9 w-9 border mt-1">
                    <AvatarFallback className="bg-muted">
                        <LogIcon type={item.type} />
                    </AvatarFallback>
                </Avatar>

                {/* Column 2: Main Content (This will now wrap correctly) */}
                <div className="grid gap-1.5">
                  <p className="text-sm font-medium leading-snug break-words">
                    <span className="font-bold">{item.actor}:</span>{' '}
                    <span>{item.message}</span>
                  </p>
                  
                  {(item.tenant || item.property) && (
                      <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2">
                          {item.tenant && <span className="inline-flex items-center"><User className="h-3 w-3 mr-1"/>{item.tenant.name}</span>}
                          {item.tenant && item.property && <span className="mx-1">&bull;</span>}
                          {item.property && <span className="inline-flex items-center"><Building className="h-3 w-3 mr-1"/>{item.property.address.street}</span>}
                      </div>
                  )}
                </div>

                {/* Column 3: The Timestamp */}
                <div className="text-xs text-muted-foreground whitespace-nowrap justify-self-end mt-1">
                    {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
            )) : (
                <div className="flex items-center justify-center h-[250px]">
                    <p className="text-sm text-muted-foreground">No activity to display.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
       <CardFooter className="border-t pt-4 p-6">
        <Button variant="outline" size="sm" className="w-full">View Full Log</Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityFeed;

// // src/components/dashboard/ActivityFeed.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { MessageSquare, Bell, Wrench, CircleDollarSign, Building, User, FileText } from "lucide-react";

// // This helper function chooses an icon based on the log's type
// const LogIcon = ({ type }) => {
//     switch (type) {
//         case 'Communication':
//             return <MessageSquare className="h-4 w-4" />;
//         case 'Payment':
//             return <CircleDollarSign className="h-4 w-4" />;
//         case 'Maintenance':
//             return <Wrench className="h-4 w-4" />;
//         case 'Lease':
//             return <FileText className="h-4 w-4" />;
//         case 'System':
//         default:
//             return <Bell className="h-4 w-4" />;
//     }
// };

// const ActivityFeed = ({ title, items = [] }) => {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="flex-grow p-0">
//         <ScrollArea className="h-[300px] w-full">
//           <div className="space-y-6 p-6">
//             {items.length > 0 ? items.map((item) => (
//               // --- THIS IS THE NEW, ROBUST FLEXBOX LAYOUT FOR EACH ITEM ---
//               <div key={item._id} className="flex items-start gap-4">
                
//                 {/* Column 1: The Icon */}
//                 <Avatar className="h-9 w-9 border">
//                     <AvatarFallback className="bg-muted">
//                         <LogIcon type={item.type} />
//                     </AvatarFallback>
//                 </Avatar>

//                 {/* Column 2: The Main Content (This will now grow and wrap correctly) */}
//                 {/* The `min-w-0` class is the key to allowing flex items to shrink and wrap text */}
//                 <div className="flex-grow min-w-0">
//                   <p className="text-sm font-medium leading-none">
//                     <span className="font-bold">{item.actor}:</span>{' '}
//                     {/* The message will now wrap instead of being cut off */}
//                     <span className="break-words">{item.message}</span>
//                   </p>
                  
//                   {/* Sub-text for linked tenant/property info */}
//                   {(item.tenant || item.property) && (
//                       <div className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2">
//                           {item.tenant && <span className="inline-flex items-center"><User className="h-3 w-3 mr-1"/>{item.tenant.name}</span>}
//                           {item.tenant && item.property && <span className="mx-1">&bull;</span>}
//                           {item.property && <span className="inline-flex items-center"><Building className="h-3 w-3 mr-1"/>{item.property.address.street}</span>}
//                       </div>
//                   )}
//                 </div>

//                 {/* Column 3: The Timestamp (It will not be squashed) */}
//                 <div className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
//                     {new Date(item.createdAt).toLocaleDateString()}
//                 </div>

//               </div>
//             )) : (
//                 <div className="flex items-center justify-center h-[250px]">
//                     <p className="text-sm text-muted-foreground">No activity to display.</p>
//                 </div>
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//        <CardFooter className="border-t pt-4 p-6">
//         <Button variant="outline" size="sm" className="w-full">View Full Log</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ActivityFeed;

// // src/components/dashboard/ActivityFeed.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { MessageSquare, Bell, Wrench, CircleDollarSign, Building, User, FileText } from "lucide-react";

// // This helper function chooses an icon based on the log's type
// const LogIcon = ({ type }) => {
//     switch (type) {
//         case 'Communication':
//             return <MessageSquare className="h-4 w-4" />;
//         case 'Payment':
//             return <CircleDollarSign className="h-4 w-4" />;
//         case 'Maintenance':
//             return <Wrench className="h-4 w-4" />;
//         case 'Lease':
//             return <FileText className="h-4 w-4" />;
//         case 'System':
//         default:
//             return <Bell className="h-4 w-4" />;
//     }
// };

// const ActivityFeed = ({ title, items = [] }) => {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="flex-grow p-0">
//         <ScrollArea className="h-[300px] w-full">
//           <div className="space-y-6 p-6">
//             {items.length > 0 ? items.map((item) => (
//               // The main flex container for a single log item
//               <div key={item._id} className="flex items-start gap-4">
//                 <Avatar className="h-9 w-9 border">
//                     <AvatarFallback className="bg-muted">
//                         <LogIcon type={item.type} />
//                     </AvatarFallback>
//                 </Avatar>

//                 {/* --- THIS IS THE CORRECTED LAYOUT --- */}
//                 {/* This container will now grow and shrink correctly */}
//                 <div className="grid gap-1 flex-grow min-w-0">
//                   <p className="text-sm font-medium leading-none break-words">
//                     <span className="font-bold">{item.actor}:</span> {item.message}
//                   </p>
                  
//                   {/* Sub-text for linked items */}
//                   {(item.tenant || item.property) && (
//                       <div className="text-xs text-muted-foreground">
//                           {item.tenant && <span className="inline-flex items-center"><User className="h-3 w-3 mr-1"/>{item.tenant.name}</span>}
//                           {item.tenant && item.property && <span className="mx-2">&bull;</span>}
//                           {item.property && <span className="inline-flex items-center"><Building className="h-3 w-3 mr-1"/>{item.property.address.street}</span>}
//                       </div>
//                   )}
//                 </div>

//                 {/* Timestamp */}
//                 <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
//                     {new Date(item.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             )) : (
//                 <div className="flex items-center justify-center h-[250px]">
//                     <p className="text-sm text-muted-foreground">No activity to display.</p>
//                 </div>
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//        <CardFooter className="border-t pt-4 p-6">
//         <Button variant="outline" size="sm" className="w-full">View Full Log</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ActivityFeed;

// // src/components/dashboard/ActivityFeed.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area"; // Import the new component
// import { MessageSquare, Bell, Wrench, CircleDollarSign } from "lucide-react";

// // This helper function chooses an icon based on the log's type
// const LogIcon = ({ type }) => {
//     switch (type) {
//         case 'Communication':
//             return <MessageSquare className="h-4 w-4" />;
//         case 'Payment':
//             return <CircleDollarSign className="h-4 w-4" />;
//         case 'Maintenance':
//             return <Wrench className="h-4 w-4" />;
//         default:
//             return <Bell className="h-4 w-4" />;
//     }
// };

// const ActivityFeed = ({ title, items = [] }) => {
//   return (
//     <Card className="flex flex-col">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       {/* Use CardContent with no padding and add ScrollArea for the list */}
//       <CardContent className="flex-grow p-0">
//         <ScrollArea className="h-[300px] w-full p-6">
//           <div className="space-y-6">
//             {items.length > 0 ? items.map((item) => (
//               <div key={item._id} className="flex items-start gap-4">
//                 <Avatar className="h-9 w-9 border">
//                     <AvatarFallback>
//                         <LogIcon type={item.type} />
//                     </AvatarFallback>
//                 </Avatar>
//                 <div className="grid gap-1 flex-grow">
//                   <p className="text-sm font-medium leading-none">
//                     <span className="font-bold">{item.actor}:</span> {item.message}
//                   </p>
//                   {/* Conditionally render the linked tenant/property info */}
//                   {(item.tenant || item.property) && (
//                       <div className="text-xs text-muted-foreground">
//                           {item.tenant && <span>Tenant: {item.tenant.name}</span>}
//                           {item.tenant && item.property && <span> &bull; </span>}
//                           {item.property && <span>Property: {item.property.address.street}</span>}
//                       </div>
//                   )}
//                 </div>
//                 <div className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
//                     {new Date(item.createdAt).toLocaleDateString()}
//                 </div>
//               </div>
//             )) : (
//                 <div className="flex items-center justify-center h-full">
//                     <p className="text-sm text-muted-foreground">No activity to display.</p>
//                 </div>
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//        <CardFooter className="border-t pt-4">
//         <Button variant="outline" size="sm" className="w-full">View Full Log</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ActivityFeed;// // src/components/dashboard/ActivityFeed.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { MessageSquare, Bell } from "lucide-react"; // Import a generic icon

// const ActivityFeed = ({ title, items = [] }) => {
//   // A helper to determine which icon to show
//   const getIcon = (item) => {
//       if (item.type === 'Communication') {
//           return <MessageSquare className="h-4 w-4" />;
//       }
//       // You can add more icons for 'Payment', 'Maintenance' etc. later
//       return <Bell className="h-4 w-4" />;
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="grid gap-6">
//         {items.length > 0 ? items.map((item) => (
//           <div key={item._id} className="flex items-start gap-4">
//             <Avatar className="h-9 w-9 border">
//                 <AvatarFallback>{getIcon(item)}</AvatarFallback>
//             </Avatar>
//             <div className="grid gap-1 flex-grow">
//               {/* This now correctly displays the 'message' from the database */}
//               <p className="text-sm font-medium leading-none">
//                 {item.message}
//               </p>
//               <p className="text-sm text-muted-foreground">
//                 Logged by: {item.actor}
//               </p>
//             </div>
//             {/* We will format the date for better readability */}
//             <div className="ml-auto text-xs text-muted-foreground">
//                 {new Date(item.createdAt).toLocaleDateString()}
//             </div>
//           </div>
//         )) : (
//             <p className="text-sm text-muted-foreground">No activity to display.</p>
//         )}
//       </CardContent>
//        <CardFooter>
//         <Button variant="outline" size="sm" className="w-full">View Full Log</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ActivityFeed;

// // src/components/dashboard/ActivityFeed.jsx

// import React from 'react';
// import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// const ActivityFeed = ({ title, items = [] }) => {
//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="grid gap-6">
//         {items.map((item, index) => (
//           <div key={index} className="flex items-start gap-4">
//             <Avatar className="h-9 w-9">
//                 {/* Conditionally render an icon or initials */}
//                 {typeof item.actorIcon === 'function' ? 
//                     <AvatarFallback><item.actorIcon className="h-4 w-4" /></AvatarFallback> :
//                     <AvatarFallback>{item.actor.substring(0, 2)}</AvatarFallback>
//                 }
//             </Avatar>
//             <div className="grid gap-1">
//               <p className="text-sm font-medium leading-none">
//                 <span className="font-bold">{item.actor}</span> {item.action}
//               </p>
//               <p className="text-sm text-muted-foreground">{item.details}</p>
//             </div>
//             <div className="ml-auto text-sm text-muted-foreground">{item.time}</div>
//           </div>
//         ))}
//       </CardContent>
//        <CardFooter>
//         <Button variant="outline" size="sm" className="w-full">View Full Log</Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default ActivityFeed;