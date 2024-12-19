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
    <div className="flex flex-wrap gap-2" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      <Badge variant="secondary" className="list-none m-0 p-0 before:hidden">
        {planType}
      </Badge>
      <Badge variant="outline" className="bg-white list-none m-0 p-0 before:hidden">
        {contractLength} {contractLength === 1 ? 'month' : 'months'}
      </Badge>
      {minimumUsage && (
        <Badge variant="secondary">Min. Usage Required</Badge>
      )}
      {newCustomer && (
        <Badge variant="secondary">New Customers Only</Badge>
      )}
      {prepaid && (
        <Badge variant="secondary">Prepaid Plan</Badge>
      )}
      {timeOfUse && (
        <Badge variant="secondary">Time of Use</Badge>
      )}
      {renewablePercentage !== undefined && renewablePercentage > 0 && (
        <Badge variant="secondary">{renewablePercentage}% Renewable</Badge>
      )}
    </div>
  );
}