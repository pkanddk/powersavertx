import { Badge } from "@/components/ui/badge";

interface PlanBadgesProps {
  planType: string;
  contractLength: number;
  minimumUsage?: boolean;
  newCustomer?: boolean;
  renewablePercentage?: number;
}

export function PlanBadges({ 
  planType, 
  contractLength, 
  minimumUsage, 
  newCustomer,
  renewablePercentage 
}: PlanBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">{planType}</Badge>
      <Badge variant="outline" className="list-none">
        {contractLength} {contractLength === 1 ? 'month' : 'months'}
      </Badge>
      {minimumUsage && (
        <Badge variant="secondary">Min. Usage Required</Badge>
      )}
      {newCustomer && (
        <Badge variant="secondary">New Customers Only</Badge>
      )}
      {typeof renewablePercentage === 'number' && (
        <Badge variant="outline" className="bg-green-50">
          {renewablePercentage}% Renewable
        </Badge>
      )}
    </div>
  );
}