/**
 * PendingApplications.jsx
 * This component fetches and displays a summary of the latest pending tenant applications.
 * It's designed to be used within the dashboard's "Action Hub".
 */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { formatDistanceToNow } from "date-fns"; // Import for relative time
import { getApplicationSummary } from "@/features/applications/applicationSlice";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, FileText, Inbox } from "lucide-react"; // Updated icons

// --- Helper Components (Self-Contained) ---

/**
 * LoadingSkeleton: Displays a placeholder that mimics the table row structure while data is being fetched.
 */
const LoadingSkeleton = () => (
  <>
    {[...Array(3)].map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-3 w-[200px]" />
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[120px]" />
        </TableCell>
        <TableCell>
          <Skeleton className="h-4 w-[90px]" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-8 w-[60px] ml-auto" />
        </TableCell>
      </TableRow>
    ))}
  </>
);

/**
 * EmptyState: A more visually appealing message for when there are no pending applications.
 */
const EmptyState = () => (
  <TableRow>
    <TableCell colSpan="4" className="h-40 text-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Inbox className="h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-medium">Application Inbox Zero!</p>
        <p className="text-sm text-muted-foreground">
          You have no new applications to review.
        </p>
      </div>
    </TableCell>
  </TableRow>
);

/**
 * ApplicationRow: A single row in the applications table with improved styling and interactivity.
 */
const ApplicationRow = ({ application }) => {
  const applicantName = application.applicant?.name || "N/A";
  const propertyStreet = application.property?.address?.street || "N/A";

  // Create a human-readable, relative date string
  const dateApplied = formatDistanceToNow(new Date(application.createdAt), {
    addSuffix: true,
  });

  return (
    <TableRow className="group">
      {" "}
      {/* `group` allows child elements to react to hover */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{applicantName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{applicantName}</div>
            <div className="text-sm text-muted-foreground">
              {application.applicant?.email}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{propertyStreet}</TableCell>
      <TableCell className="text-muted-foreground">{dateApplied}</TableCell>
      <TableCell className="text-right">
        {/* Button appears on hover for a cleaner look */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Link to={`/landlord/applications/${application._id}`}>
            Review <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
};

ApplicationRow.propTypes = {
  application: PropTypes.object.isRequired,
};

// --- Main Component ---

const PendingApplications = () => {
  const dispatch = useDispatch();
  const { summary: applications, isSummaryLoading } = useSelector(
    (state) => state.applications
  );

  useEffect(() => {
    dispatch(getApplicationSummary());
  }, [dispatch]);

  const hasApplications = applications && applications.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-muted-foreground" />
          <CardTitle>Pending Applications</CardTitle>
        </div>
        <CardDescription>
          The most recent applications needing your review.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="border-t m-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Date Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isSummaryLoading && !hasApplications ? (
                <LoadingSkeleton />
              ) : hasApplications ? (
                applications.map((app) => (
                  <ApplicationRow key={app._id} application={app} />
                ))
              ) : (
                <EmptyState />
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {/* Show footer only if there are applications, to avoid a redundant button on an empty state */}
      {hasApplications && (
        <CardFooter className="border-t pt-4">
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link to="/landlord/applications">
              View All Applications <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PendingApplications;
// /**
//  * PendingApplications.jsx
//  * * This component fetches and displays a summary of the latest pending tenant applications.
//  * It's designed to be used within the dashboard's "Action Hub".
//  */
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getApplicationSummary } from "@/features/applications/applicationSlice";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
//   CardDescription,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { ArrowUpRight } from "lucide-react";
// import { Link } from "react-router-dom";
// import PropTypes from "prop-types";

// const ApplicationRow = ({ application }) => {
//   const applicantName = application.applicant?.name || "N/A";
//   const propertyStreet = application.property?.address?.street || "N/A";

//   return (
//     <TableRow>
//       <TableCell>
//         <div className="flex items-center gap-3">
//           <Avatar className="h-9 w-9">
//             <AvatarFallback>{applicantName.charAt(0)}</AvatarFallback>
//           </Avatar>
//           <div>
//             <div className="font-medium">{applicantName}</div>
//             <div className="text-sm text-muted-foreground">
//               {application.applicant?.email}
//             </div>
//           </div>
//         </div>
//       </TableCell>
//       <TableCell>{propertyStreet}</TableCell>
//       <TableCell>
//         {new Date(application.createdAt).toLocaleDateString()}
//       </TableCell>
//       <TableCell className="text-right">
//         <Button variant="outline" size="sm" asChild>
//           <Link to={`/landlord/applications/${application._id}`}>View</Link>
//         </Button>
//       </TableCell>
//     </TableRow>
//   );
// };

// ApplicationRow.propTypes = {
//   application: PropTypes.object.isRequired,
// };

// const PendingApplications = () => {
//   const dispatch = useDispatch();
//   const { summary: applications, isSummaryLoading } = useSelector(
//     (state) => state.applications
//   );

//   useEffect(() => {
//     dispatch(getApplicationSummary());
//   }, [dispatch]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Pending Applications</CardTitle>
//         <CardDescription>
//           The 5 most recent applications needing your review.
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Applicant</TableHead>
//               <TableHead>Property</TableHead>
//               <TableHead>Date Applied</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isSummaryLoading ? (
//               <TableRow>
//                 <TableCell colSpan="4" className="h-24 text-center">
//                   Loading applications...
//                 </TableCell>
//               </TableRow>
//             ) : applications.length > 0 ? (
//               applications.map((app) => (
//                 <ApplicationRow key={app._id} application={app} />
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan="4"
//                   className="h-24 text-center text-muted-foreground"
//                 >
//                   No pending applications found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </CardContent>
//       <CardFooter>
//         <Button variant="outline" size="sm" className="w-full" asChild>
//           <Link to="/landlord/applications">
//             View All Applications <ArrowUpRight className="h-4 w-4 ml-2" />
//           </Link>
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// };

// export default PendingApplications;
