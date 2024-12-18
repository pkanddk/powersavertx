import { Button } from "@/components/ui/button";
import { Plan } from "@/lib/api";

interface PlanActionsProps {
  plan: Plan;
  onCompare?: (plan: Plan) => void;
  isCompared?: boolean;
}

export function PlanActions({ plan, onCompare, isCompared }: PlanActionsProps) {
  console.log("PlanActions - plan data:", plan);
  console.log("PlanActions - go_to_plan URL:", plan.go_to_plan);

  return (
    <div className="w-full space-y-3">
      {onCompare && (
        <Button 
          variant={isCompared ? "secondary" : "outline"} 
          className="w-full"
          onClick={() => onCompare(plan)}
        >
          {isCompared ? "Remove from Compare" : "Add to Compare"}
        </Button>
      )}
      {plan.go_to_plan && (
        <Button asChild className="w-full">
          <a href={plan.go_to_plan} target="_blank" rel="noopener noreferrer">
            View Plan
          </a>
        </Button>
      )}
      {plan.fact_sheet && (
        <Button asChild variant="outline" className="w-full">
          <a href={plan.fact_sheet} target="_blank" rel="noopener noreferrer">
            View Fact Sheet
          </a>
        </Button>
      )}
    </div>
  );
}