/**
 * ActivityFeed.jsx
 * Displays a list of logs with two visual variants:
 * - 'dashboard': A dynamic-height widget with an accent border.
 * - 'fullpage': A spacious, full-length list for dedicated log pages.
 */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
// ScrollArea is no longer needed for the dashboard view, but we keep it for potential future use.
// import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { MessageSquare, Bell, ArrowUpRight, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Internal Log Icon Component (No changes) ---
const LogIcon = ({ type }) => {
  const isCommunication = type === "Communication";
  const Icon = isCommunication ? MessageSquare : Bell;
  return (
    <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted">
      <Icon
        className={cn(
          "h-4 w-4",
          isCommunication ? "text-primary" : "text-muted-foreground"
        )}
      />
    </span>
  );
};
LogIcon.propTypes = { type: PropTypes.string };

// --- Internal Log Item Component (No changes) ---
const LogItem = ({ item, variant }) => {
  const isDashboard = variant === "dashboard";
  return (
    <div className="flex items-start gap-3.5">
      <LogIcon type={item.type} />
      <div className="grid flex-grow gap-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-card-foreground">
            {item.actor}
          </p>
          <time className="text-xs text-muted-foreground whitespace-nowrap">
            {isDashboard
              ? formatDistanceToNow(new Date(item.createdAt), {
                  addSuffix: true,
                })
              : format(new Date(item.createdAt), "MMM dd, yyyy 'at' p")}
          </time>
        </div>
        <p className="text-sm text-muted-foreground">{item.message}</p>
      </div>
    </div>
  );
};
LogItem.propTypes = {
  item: PropTypes.object.isRequired,
  variant: PropTypes.string.isRequired,
};

// --- Main ActivityFeed Component ---
const ActivityFeed = ({
  title,
  items = [],
  limit,
  viewAllLink,
  variant = "fullpage",
}) => {
  const isDashboard = variant === "dashboard";
  const displayItems = isDashboard && limit ? items.slice(0, limit) : items;

  const accentColorClass =
    items[0]?.type === "Communication"
      ? "bg-black dark:bg-gray-400"
      : "bg-red-500";

  return (
    <Card
      className={cn(
        "flex flex-col h-full", // h-full is key for matching height in a grid
        isDashboard &&
          "relative overflow-hidden border-gray-200/80 dark:border-gray-800 transition-all hover:shadow-md"
      )}
    >
      {isDashboard && (
        <div
          className={`absolute left-0 top-0 h-full w-[2px] ${accentColorClass}`}
        />
      )}

      <CardHeader className={cn(isDashboard && "pl-5")}>
        <CardTitle
          className={cn(isDashboard ? "text-base font-semibold" : "text-xl")}
        >
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-grow p-0">
        {isDashboard ? (
          // --- DASHBOARD LAYOUT (MODIFIED) ---
          <div className="space-y-5 px-5 pt-2 pb-4">
            {displayItems.length > 0 ? (
              displayItems.map((item) => (
                <LogItem key={item._id} item={item} variant="dashboard" />
              ))
            ) : (
              // ADJUSTED: Use padding instead of fixed height for the empty state
              <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                <Inbox className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  No Recent Activity
                </p>
                <p className="text-xs text-muted-foreground/80">
                  New events will appear here.
                </p>
              </div>
            )}
          </div>
        ) : (
          // --- FULL PAGE LAYOUT (No changes) ---
          <div className="border-t">
            {displayItems.length > 0 ? (
              <div className="divide-y divide-border">
                {displayItems.map((item) => (
                  <div key={item._id} className="p-4">
                    <LogItem item={item} variant="fullpage" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-10 text-center text-muted-foreground">
                No activity to display.
              </p>
            )}
          </div>
        )}
      </CardContent>

      {isDashboard && viewAllLink && (
        <CardFooter className="border-t pt-3 pb-3 mt-auto">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            asChild
          >
            <Link to={viewAllLink}>
              View Full Log <ArrowUpRight className="h-4 w-4 ml-1.5" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

ActivityFeed.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  limit: PropTypes.number,
  viewAllLink: PropTypes.string,
  variant: PropTypes.oneOf(["dashboard", "fullpage"]),
};

export default ActivityFeed;

// /**
//  * ActivityFeed.jsx
//  * Displays a list of recent system or communication logs, with an optional limit and "View All" link.
//  */
// import React from "react";
// import PropTypes from "prop-types";
// import { Link } from "react-router-dom";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Button } from "@/components/ui/button";
// import { format } from "date-fns";
// import { MessageSquare, Bell, ArrowUpRight } from "lucide-react";

// // Helper to render an icon based on the log type
// const LogIcon = ({ type }) => {
//   const Icon = type === "Communication" ? MessageSquare : Bell;
//   return (
//     <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
//       <Icon className="h-5 w-5 text-muted-foreground" />
//     </span>
//   );
// };

// LogIcon.propTypes = {
//   type: PropTypes.string,
// };

// const ActivityFeed = ({ title, items = [], limit, viewAllLink }) => {
//   // If a limit is provided, slice the array; otherwise, show all items.
//   const displayItems = limit ? items.slice(0, limit) : items;

//   return (
//     <Card className="flex flex-col h-full">
//       <CardHeader>
//         <CardTitle>{title}</CardTitle>
//       </CardHeader>
//       <CardContent className="flex-grow p-0">
//         <ScrollArea className="h-[350px] w-full">
//           <div className="space-y-6 p-6">
//             {displayItems.length > 0 ? (
//               displayItems.map((item) => (
//                 <div key={item._id} className="flex items-start gap-4">
//                   <LogIcon type={item.type} />
//                   <div className="grid gap-1.5 flex-grow">
//                     <div className="flex items-center justify-between">
//                       <p className="text-sm font-semibold">{item.actor}</p>
//                       <time className="text-xs text-muted-foreground whitespace-nowrap">
//                         {format(new Date(item.createdAt), "MMM dd, p")}
//                       </time>
//                     </div>
//                     <p className="text-sm text-muted-foreground">
//                       {item.message}
//                     </p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="flex items-center justify-center h-full">
//                 <p className="text-center text-muted-foreground py-10">
//                   No activity to display.
//                 </p>
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </CardContent>
//       {viewAllLink && items.length > 0 && (
//         <CardFooter className="border-t pt-4 mt-auto">
//           <Button variant="outline" size="sm" className="w-full" asChild>
//             <Link to={viewAllLink}>
//               View Full Log <ArrowUpRight className="h-4 w-4 ml-2" />
//             </Link>
//           </Button>
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// ActivityFeed.propTypes = {
//   title: PropTypes.string.isRequired,
//   items: PropTypes.array,
//   limit: PropTypes.number,
//   viewAllLink: PropTypes.string,
// };

// export default ActivityFeed;
