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
    renewablePercentage
  });

  const badges = [
    // Only add plan type badge if planType exists and is not empty
    planType?.trim() && {
      key: 'plan-type',
      variant: 'secondary' as const,
      content: planType
    },
    
    // Only add contract length badge if contractLength is greater than 0
    contractLength > 0 && {
      key: 'contract-length',
      variant: 'outline' as const,
      className: 'bg-white',
      content: `${contractLength} ${contractLength === 1 ? 'month' : 'months'}`
    },
    
    // Only add minimum usage badge if minimumUsage is true
    minimumUsage && {
      key: 'min-usage',
      variant: 'secondary' as const,
      content: 'Min. Usage Required'
    },
    
    // Only add new customer badge if newCustomer is true
    newCustomer && {
      key: 'new-customer',
      variant: 'secondary' as const,
      content: 'New Customers Only'
    },
    
    // Only add prepaid badge if prepaid is true
    prepaid && {
      key: 'prepaid',
      variant: 'secondary' as const,
      content: 'Prepaid Plan'
    },
    
    // Only add time of use badge if timeOfUse is true
    timeOfUse && {
      key: 'time-of-use',
      variant: 'secondary' as const,
      content: 'Time of Use'
    },
    
    // Only add renewable badge if renewablePercentage exists and is greater than 0
    renewablePercentage !== undefined && renewablePercentage > 0 && {
      key: 'renewable',
      variant: 'secondary' as const,
      content: `${renewablePercentage}% Renewable`
    }
  ].filter(Boolean); // Remove any false/undefined values

  return (
    <div className="flex flex-wrap gap-2" data-debug="plan-badges-container">
      {badges.map(badge => badge && (
        <Badge
          key={badge.key}
          variant={badge.variant}
          className={badge.className}
        >
          {badge.content}
        </Badge>
      ))}
    </div>
  );
}