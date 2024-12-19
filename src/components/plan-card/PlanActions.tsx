import { Button } from "@/components/ui/button";
import { Plan } from "@/lib/api";
import { ExternalLink, Phone } from "lucide-react";

interface PlanActionsProps {
  plan: Plan;
  onCompare?: (plan: Plan) => void;
  isCompared?: boolean;
  enrollPhone?: string | null;
  website?: string | null;
}

export function PlanActions({ 
  plan, 
  onCompare, 
  isCompared,
  enrollPhone,
  website
}: PlanActionsProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {plan.go_to_plan && (
        <Button asChild className="w-full">
          <a href={plan.go_to_plan} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            View Plan <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      )}
      
      {onCompare && (
        <Button
          variant={isCompared ? "destructive" : "outline"}
          onClick={() => onCompare(plan)}
          className="w-full"
        >
          {isCompared ? "Remove from Compare" : "Compare"}
        </Button>
      )}

      {(enrollPhone || website) && (
        <div className="flex flex-col gap-1 mt-2 text-sm text-muted-foreground">
          {enrollPhone && (
            <a href={`tel:${enrollPhone}`} className="flex items-center gap-1 hover:text-primary">
              <Phone className="h-4 w-4" /> {enrollPhone}
            </a>
          )}
          {website && (
            <a href={website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary">
              <ExternalLink className="h-4 w-4" /> Website
            </a>
          )}
        </div>
      )}
    </div>
  );
}