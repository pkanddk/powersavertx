import { Badge } from "@/components/ui/badge";

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
      {contractLength && (
        <Badge variant="secondary">
          {contractLength} {contractLength === 1 ? 'month' : 'months'}
        </Badge>
      )}
      <Badge variant="secondary">{planType}</Badge>
      {minimumUsage && <Badge variant="secondary">Minimum Usage</Badge>}
      {newCustomer && <Badge variant="secondary">New Customers Only</Badge>}
      {renewablePercentage && renewablePercentage > 0 && (
        <Badge variant="secondary">{renewablePercentage}% Renewable</Badge>
      )}
      {timeofuse && <Badge variant="secondary">Time of Use</Badge>}
    </div>
  );
}