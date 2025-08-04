/**
 * TenantCard.jsx
 * A reusable UI component to display a summary of a single tenant.
 * It now intelligently displays status based on the most recent lease.
 */
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, User, CalendarDays, CircleDollarSign } from "lucide-react";
import { format } from "date-fns";

const TenantCard = ({ tenant }) => {
  // This function intelligently determines the tenant's status based on their lease
  const getTenantStatus = (lease) => {
    if (!lease) {
      return { text: "No Lease History", variant: "secondary" };
    }
    if (lease.status === "active") {
      return { text: "Active Lease", variant: "default" };
    }
    if (new Date(lease.endDate) < new Date()) {
      return { text: "Lease Expired", variant: "outline" };
    }
    if (new Date(lease.startDate) > new Date()) {
      return { text: "Upcoming Lease", variant: "secondary" };
    }
    return { text: "Inactive", variant: "secondary" };
  };

  const { mostRecentLease } = tenant;
  const status = getTenantStatus(mostRecentLease);
  const tenantName = tenant.name || "N/A";
  const propertyAddress =
    mostRecentLease?.property?.address?.street || "No property assigned";

  return (
    <Card className="flex flex-col transition-all hover:shadow-md hover:border-primary/20">
      <CardHeader className="flex-row items-center gap-4 pb-4">
        <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-primary">
          <AvatarFallback className="text-lg bg-muted group-hover:bg-primary/10">
            {tenantName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <h3 className="text-lg font-semibold">{tenantName}</h3>
          <p className="text-sm text-muted-foreground">{tenant.email}</p>
        </div>
        <Badge variant={status.variant} className="capitalize flex-shrink-0">
          {status.text}
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow space-y-3 pt-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Home className="h-4 w-4 mr-3 flex-shrink-0" />
          <span className="truncate" title={propertyAddress}>
            {propertyAddress}
          </span>
        </div>
        {mostRecentLease && (
          <>
            <div className="flex items-center text-sm text-muted-foreground">
              <CircleDollarSign className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>${mostRecentLease.rentAmount.toLocaleString()}/month</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4 mr-3 flex-shrink-0" />
              <span>
                Lease Ends:{" "}
                {format(new Date(mostRecentLease.endDate), "MMM dd, yyyy")}
              </span>
            </div>
          </>
        )}
      </CardContent>
      <div className="p-4 pt-2 text-right">
        <Button asChild variant="outline" size="sm">
          <Link to={`/landlord/tenants/${tenant._id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
};

TenantCard.propTypes = {
  tenant: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string,
    email: PropTypes.string,
    mostRecentLease: PropTypes.object,
  }).isRequired,
};

export default TenantCard;
