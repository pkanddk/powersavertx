import { CustomBadge } from "@/components/ui/custom-badge";

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
      <CustomBadge variant="secondary">{planType}</CustomBadge>
      <CustomBadge variant="outline">
        {contractLength} {contractLength === 1 ? 'month' : 'months'}
      </CustomBadge>
      {minimumUsage && (
        <CustomBadge variant="secondary">Min. Usage Required</CustomBadge>
      )}
      {newCustomer && (
        <CustomBadge variant="secondary">New Customers Only</CustomBadge>
      )}
      {typeof renewablePercentage === 'number' && (
        <CustomBadge variant="outline" className="bg-green-50">
          {renewablePercentage}% Renewable
        </CustomBadge>
      )}
    </div>
  );
}