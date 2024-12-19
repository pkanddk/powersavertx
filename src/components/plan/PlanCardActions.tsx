import { Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";

interface PlanCardActionsProps {
  plan: Plan;
  onCompare: (plan: Plan) => void;
  isCompared: boolean;
  onShowDetails: (plan: Plan) => void;
}

export function PlanCardActions({ 
  plan, 
  onCompare, 
  isCompared, 
  onShowDetails 
}: PlanCardActionsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {plan.go_to_plan ? (
          <Button 
            variant="default" 
            className="w-full bg-primary/90 hover:bg-primary transition-colors" 
            asChild
          >
            <a
              href={plan.go_to_plan}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              View Plan <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button
            variant="default"
            onClick={() => onShowDetails(plan)}
            className="w-full bg-primary/90 hover:bg-primary transition-colors flex items-center justify-center gap-2"
          >
            <Info className="h-4 w-4" />
            Plan Details
          </Button>
        )}
        <Button
          variant={isCompared ? "destructive" : "outline"}
          onClick={() => onCompare(plan)}
          className="w-full hover:border-primary/30"
        >
          {isCompared ? "Remove" : "Compare"}
        </Button>
      </div>
    </div>
  );
}