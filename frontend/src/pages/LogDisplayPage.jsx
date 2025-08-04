import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLogs } from "../features/logs/logSlice";
import ActivityFeed from "../components/dashboard/ActivityFeed";

const LogDisplayPage = ({ title, filterType }) => {
  const dispatch = useDispatch();
  const { logs, isLoading } = useSelector((state) => state.logs);

  useEffect(() => {
    dispatch(getLogs());
  }, [dispatch]);

  const filteredLogs = logs.filter((log) => {
    if (filterType === "Communication") return log.type === "Communication";
    if (filterType === "System") return log.type !== "Communication";
    return true;
  });

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-muted-foreground">
          A complete history of all recorded events.
        </p>
      </header>
      {isLoading ? (
        <p>Loading logs...</p>
      ) : (
        <ActivityFeed title="Full Log" items={filteredLogs} />
      )}
    </div>
  );
};

export default LogDisplayPage;
