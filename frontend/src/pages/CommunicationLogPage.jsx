/**
 * CommunicationLogPage.jsx
 * Displays a complete, unfiltered list of all communication logs.
 */

// src/pages/CommunicationLogPage.jsx

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";

// --- Redux Action Imports ---
import {
  getLogs,
  createLog,
  reset as resetLogs,
} from "../features/logs/logSlice";
import { getTenants } from "../features/tenants/tenantSlice"; // Needed for form
import { getProperties } from "../features/properties/propertySlice"; // Needed for form

// --- UI & Component Imports ---
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import LogCommunicationForm from "../components/forms/LogCommunicatonForm";

const CommunicationLogPage = () => {
  const dispatch = useDispatch();
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // --- Redux State Selectors ---
  const { logs, isLoading: isLogLoading } = useSelector((state) => state.logs);
  const { allTenants } = useSelector((state) => state.tenants);
  const { properties } = useSelector((state) => state.properties);

  // --- Data Fetching Effect ---
  useEffect(() => {
    // Fetch all data needed for this page: logs, tenants, and properties
    dispatch(getLogs());
    dispatch(getTenants());
    dispatch(getProperties());

    return () => {
      dispatch(resetLogs());
    };
  }, [dispatch]);

  // --- Handler Function ---
  const handleLogSubmit = async (logData) => {
    dispatch(createLog(logData))
      .unwrap()
      .then(() => {
        toast.success("Communication logged successfully!");
        setIsLogModalOpen(false);
        dispatch(getLogs()); // Refresh the log list after adding a new one
      })
      .catch((err) => toast.error(err.message || "Failed to save log."));
  };

  // Filter for only communication logs
  const communicationLogs = logs.filter((log) => log.type === "Communication");

  return (
    <>
      <div className="p-4 md:p-8">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Communication Log</h1>
            <p className="text-muted-foreground">
              A complete history of all recorded communications.
            </p>
          </div>
          <Button onClick={() => setIsLogModalOpen(true)}>
            + Log Communication
          </Button>
        </header>
        <main>
          {isLogLoading && logs.length === 0 ? (
            <p>Loading logs...</p>
          ) : (
            <ActivityFeed title="Full History" items={communicationLogs} />
          )}
        </main>
      </div>

      {/* --- Modal for Logging Communication --- */}
      <Dialog open={isLogModalOpen} onOpenChange={setIsLogModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log a Communication</DialogTitle>
            <DialogDescription>
              Record a call, email, or in-person meeting.
            </DialogDescription>
          </DialogHeader>
          <LogCommunicationForm
            tenants={allTenants}
            properties={properties}
            onSubmit={handleLogSubmit}
            onCancel={() => setIsLogModalOpen(false)}
            isLoading={isLogLoading}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommunicationLogPage;
// import React, { useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { getLogs, reset as resetLogs } from "../features/logs/logSlice";
// import ActivityFeed from "../components/dashboard/ActivityFeed";

// const CommunicationLogPage = () => {
//   const dispatch = useDispatch();
//   const { logs, isLoading } = useSelector((state) => state.logs);

//   useEffect(() => {
//     dispatch(getLogs());
//     return () => {
//       dispatch(resetLogs());
//     };
//   }, [dispatch]);

//   // We only want to display logs of type 'Communication' on this page
//   const communicationLogs = logs.filter((log) => log.type === "Communication");

//   return (
//     <div className="p-4 md:p-8">
//       <header className="mb-6">
//         <h1 className="text-3xl font-bold">Communication Log</h1>
//         <p className="text-muted-foreground">
//           A complete history of all recorded communications.
//         </p>
//       </header>
//       <main>
//         {isLoading ? (
//           <p>Loading logs...</p>
//         ) : (
//           <ActivityFeed title="Full History" items={communicationLogs} />
//         )}
//       </main>
//     </div>
//   );
// };

// export default CommunicationLogPage;
