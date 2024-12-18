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
  // Only show plan type badge if it's a non-empty string and not just a number
  const shouldShowPlanType = planType && isNaN(Number(planType)) && planType.trim() !== '';
  
  return (
    <div className="flex flex-wrap gap-2">
      {shouldShowPlanType && (
        <CustomBadge variant="secondary">{planType}</CustomBadge>
      )}
      {contractLength && (
        <CustomBadge variant="outline">
          {contractLength} {contractLength === 1 ? 'month' : 'months'}
        </CustomBadge>
      )}
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