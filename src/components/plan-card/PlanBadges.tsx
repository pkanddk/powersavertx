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
      <div>
        <Badge variant="secondary">
          {planType}
        </Badge>
      </div>
      <div>
        <Badge variant="outline" className="bg-white">
          {contractLength} {contractLength === 1 ? 'month' : 'months'}
        </Badge>
      </div>
      {minimumUsage && (
        <div>
          <Badge variant="secondary">Min. Usage Required</Badge>
        </div>
      )}
      {newCustomer && (
        <div>
          <Badge variant="secondary">New Customers Only</Badge>
        </div>
      )}
      {prepaid && (
        <div>
          <Badge variant="secondary">Prepaid Plan</Badge>
        </div>
      )}
      {timeOfUse && (
        <div>
          <Badge variant="secondary">Time of Use</Badge>
        </div>
      )}
      {renewablePercentage !== undefined && renewablePercentage > 0 && (
        <div>
          <Badge variant="secondary">{renewablePercentage}% Renewable</Badge>
        </div>
      )}
    </div>
  );
}