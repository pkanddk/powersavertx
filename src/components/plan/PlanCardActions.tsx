import { Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Info } from "lucide-react";

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
    <div className="space-y-3 pt-2 border-t border-border/50">
      <div className="grid grid-cols-2 gap-3 pt-4">
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
      <div className="flex items-center justify-between gap-2">
        {!plan.go_to_plan && (
          <Button 
            variant="secondary"
            onClick={() => onShowDetails(plan)}
            className="flex-1 bg-primary/5 hover:bg-primary/10 text-primary hover:text-primary/90 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Info className="h-4 w-4" />
            View Full Details
          </Button>
        )}
        {plan.enroll_phone && (
          <a
            href={`tel:${plan.enroll_phone}`}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="h-4 w-4" /> {plan.enroll_phone}
          </a>
        )}
      </div>
    </div>
  );
}