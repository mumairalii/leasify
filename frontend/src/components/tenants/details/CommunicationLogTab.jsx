// src/components/tenants/details/CommunicationLogTab.jsx
import React from "react";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";

const CommunicationLogTab = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return (
      <p className="p-4 text-center text-muted-foreground">
        No communication logs found.
      </p>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {logs.map((log) => (
        <div key={log._id} className="flex items-start gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
          </span>
          <div className="grid gap-1.5 flex-grow">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{log.actor}</p>
              <time className="text-xs text-muted-foreground">
                {format(new Date(log.createdAt), "MMM dd, yyyy")}
              </time>
            </div>
            <p className="text-sm text-muted-foreground">{log.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

CommunicationLogTab.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default CommunicationLogTab;
