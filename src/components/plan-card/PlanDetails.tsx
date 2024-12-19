import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface PlanDetailsProps {
  details?: string;
  timeofuse?: boolean;
  pricingDetails?: string;
  tduProvider?: string;
}

export function PlanDetails({ details, timeofuse, pricingDetails, tduProvider }: PlanDetailsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!details && !timeofuse && !pricingDetails && !tduProvider) {
    return null;
  }

  return (
    <div className="space-y-2">
      <Button 
        variant="ghost" 
        className="w-full flex justify-between items-center p-0 h-auto hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="font-medium">Plan Details</span>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </Button>
      
      {isExpanded && (
        <div className="text-sm space-y-2 text-muted-foreground">
          {details && <p>{details}</p>}
          {timeofuse && (
            <p>This is a time-of-use plan. Rates vary based on the time of day electricity is used.</p>
          )}
          {pricingDetails && <p>{pricingDetails}</p>}
          {tduProvider && <p>TDU Provider: {tduProvider}</p>}
        </div>
      )}
    </div>
  );
}