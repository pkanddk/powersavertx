import { Badge } from "@/components/ui/badge";

interface PlanBadgesProps {
  planType: string;
  contractLength: number;
  minimumUsage?: boolean;
  newCustomer?: boolean;
  prepaid?: boolean;
  timeOfUse?: boolean;
  renewablePercentage?: number;
}

export function PlanBadges({ 
  planType, 
  contractLength, 
  minimumUsage, 
  newCustomer,
  prepaid,
  timeOfUse,
  renewablePercentage
}: PlanBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge key="plan-type" variant="secondary" className="whitespace-nowrap">
        {planType}
      </Badge>
      
      <Badge key="contract-length" variant="outline" className="bg-white whitespace-nowrap">
        {`${contractLength} ${contractLength === 1 ? 'month' : 'months'}`}
      </Badge>
      
      {minimumUsage && (
        <Badge key="min-usage" variant="secondary" className="whitespace-nowrap">
          Min. Usage Required
        </Badge>
      )}
      
      {newCustomer && (
        <Badge key="new-customer" variant="secondary" className="whitespace-nowrap">
          New Customers Only
        </Badge>
      )}
      
      {prepaid && (
        <Badge key="prepaid" variant="secondary" className="whitespace-nowrap">
          Prepaid Plan
        </Badge>
      )}
      
      {timeOfUse && (
        <Badge key="time-of-use" variant="secondary" className="whitespace-nowrap">
          Time of Use
        </Badge>
      )}
      
      {renewablePercentage !== undefined && renewablePercentage > 0 && (
        <Badge key="renewable" variant="secondary" className="whitespace-nowrap">
          {`${renewablePercentage}% Renewable`}
        </Badge>
      )}
    </div>
  );
}