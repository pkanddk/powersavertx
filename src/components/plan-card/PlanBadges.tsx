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
  console.log('PlanBadges render:', {
    planType,
    contractLength,
    minimumUsage,
    newCustomer,
    prepaid,
    timeOfUse,
    renewablePercentage,
    stack: new Error().stack // This will show us where PlanBadges is being called from
  });

  return (
    <div className="flex flex-wrap gap-2" data-debug="plan-badges-container">
      {planType && (
        <Badge key="plan-type" variant="secondary">
          {planType}
        </Badge>
      )}
      
      {contractLength > 0 && (
        <Badge key="contract-length" variant="outline" className="bg-white">
          {`${contractLength} ${contractLength === 1 ? 'month' : 'months'}`}
        </Badge>
      )}
      
      {minimumUsage && (
        <Badge key="min-usage" variant="secondary">
          Min. Usage Required
        </Badge>
      )}
      
      {newCustomer && (
        <Badge key="new-customer" variant="secondary">
          New Customers Only
        </Badge>
      )}
      
      {prepaid && (
        <Badge key="prepaid" variant="secondary">
          Prepaid Plan
        </Badge>
      )}
      
      {timeOfUse && (
        <Badge key="time-of-use" variant="secondary">
          Time of Use
        </Badge>
      )}
      
      {renewablePercentage !== undefined && renewablePercentage > 0 && (
        <Badge key="renewable" variant="secondary">
          {`${renewablePercentage}% Renewable`}
        </Badge>
      )}
    </div>
  );
}