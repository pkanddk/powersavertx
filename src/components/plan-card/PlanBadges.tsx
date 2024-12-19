import { Badge } from "@/components/ui/badge";
import { Clock, Leaf, Users } from "lucide-react";

interface PlanBadgesProps {
  planType: string;
  contractLength?: number;
  minimumUsage?: boolean;
  newCustomer?: boolean;
  renewablePercentage?: number;
  timeofuse?: boolean;
}

export function PlanBadges({
  planType,
  contractLength,
  minimumUsage,
  newCustomer,
  renewablePercentage,
  timeofuse,
}: PlanBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">
        {planType}
      </Badge>
      
      {contractLength && (
        <Badge variant="outline">
          {contractLength} {contractLength === 1 ? 'month' : 'months'}
        </Badge>
      )}

      {timeofuse && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Clock size={14} />
          Time of Use
        </Badge>
      )}
      
      {minimumUsage && (
        <Badge variant="destructive">
          Minimum Usage
        </Badge>
      )}
      
      {newCustomer && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Users size={14} />
          New Customers Only
        </Badge>
      )}
      
      {renewablePercentage && renewablePercentage > 0 && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Leaf size={14} />
          {renewablePercentage}% Renewable
        </Badge>
      )}
    </div>
  );
}