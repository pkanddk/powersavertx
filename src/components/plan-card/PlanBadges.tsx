import { cn } from "@/lib/utils";

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
  const renderBadge = (content: string, variant: 'blue' | 'gray' = 'gray') => {
    if (!content) return null;
    
    return (
      <span 
        className={cn(
          "inline-block px-2 py-1 text-xs font-medium rounded-md",
          variant === 'blue' ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
        )}
      >
        {content}
      </span>
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {planType && renderBadge(planType, 'blue')}
      
      {contractLength > 0 && renderBadge(
        `${contractLength} ${contractLength === 1 ? 'month' : 'months'}`
      )}
      
      {minimumUsage && renderBadge('Min. Usage Required')}
      {newCustomer && renderBadge('New Customers Only')}
      {prepaid && renderBadge('Prepaid Plan')}
      {timeOfUse && renderBadge('Time of Use')}
      
      {renewablePercentage !== undefined && renewablePercentage > 0 && 
        renderBadge(`${renewablePercentage}% Renewable`)
      }
    </div>
  );
}