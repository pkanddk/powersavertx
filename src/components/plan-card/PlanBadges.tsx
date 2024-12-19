import { Badge } from "@/components/ui/badge";
import { Clock, Leaf, Star, Users } from "lucide-react";

interface PlanBadgesProps {
  planType: string;
  contractLength: number | null;
  minimumUsage: boolean | null;
  newCustomer: boolean | null;
  renewablePercentage: number | null;
  timeofuse: boolean | null;
}

export function PlanBadges({ 
  planType,
  contractLength,
  minimumUsage,
  newCustomer,
  renewablePercentage,
  timeofuse
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
          New Customers
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