/**
 * ReliabilityScoreBadge.jsx
 * A self-contained component that fetches and displays a tenant's reliability score.
 */
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getTenantReliabilityScore } from "../../features/tenants/tenantSlice";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

const ReliabilityScoreBadge = ({ tenantId }) => {
  const dispatch = useDispatch();
  const { scoreData, isLoading } = useSelector((state) => ({
    scoreData: state.tenants.reliabilityScores[tenantId],
    isLoading: state.tenants.isScoreLoading,
  }));

  useEffect(() => {
    // Fetch the score only if it's not already in our cache
    if (!scoreData) {
      dispatch(getTenantReliabilityScore(tenantId));
    }
  }, [dispatch, tenantId, scoreData]);

  const getScoreDetails = (score) => {
    if (score === null || score === undefined)
      return { variant: "secondary", icon: Shield, text: "N/A" };
    if (score >= 90)
      return { variant: "default", icon: ShieldCheck, text: `${score}%` };
    if (score >= 70)
      return { variant: "secondary", icon: Shield, text: `${score}%` };
    return { variant: "destructive", icon: ShieldAlert, text: `${score}%` };
  };

  if (isLoading && !scoreData) {
    return <Badge variant="outline">Loading...</Badge>;
  }

  const { variant, icon: Icon, text } = getScoreDetails(scoreData?.score);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={variant} className="flex items-center gap-1">
            <Icon className="h-3 w-3" />
            {text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {scoreData?.message ||
              `On-Time Payments: ${scoreData?.onTimePayments} / ${scoreData?.totalPaymentsDue}`}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

ReliabilityScoreBadge.propTypes = {
  tenantId: PropTypes.string.isRequired,
};

export default ReliabilityScoreBadge;
