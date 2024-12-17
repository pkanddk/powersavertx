import { Badge } from "@/components/ui/badge";

interface PlanBadgesProps {
  planType: string;
  contractLength: number;
  minimumUsage?: boolean;
  newCustomer?: boolean;
}

export function PlanBadges({ planType, contractLength, minimumUsage, newCustomer }: PlanBadgesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">{planType}</Badge>
      <Badge variant="outline">
        {contractLength} {contractLength === 1 ? 'month' : 'months'}
      </Badge>
      {minimumUsage && (
        <Badge variant="secondary">Min. Usage Required</Badge>
      )}
      {newCustomer && (
        <Badge variant="secondary">New Customers Only</Badge>
      )}
    </div>
  );
}