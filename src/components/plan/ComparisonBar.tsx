import { Button } from "@/components/ui/button";
import { Plan } from "@/lib/api";
import { GitCompare, X } from "lucide-react";
import { Link } from "react-router-dom";

interface ComparisonBarProps {
  plans: Plan[];
  onRemove: (plan: Plan) => void;
}

export function ComparisonBar({ plans, onRemove }: ComparisonBarProps) {
  if (plans.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg animate-slide-up z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'} Selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              {plans.map((plan) => (
                <div
                  key={plan.company_id}
                  className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md"
                >
                  <span className="text-sm truncate max-w-[150px]">
                    {plan.plan_name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5"
                    onClick={() => onRemove(plan)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Link to="/compare">
            <Button variant="default">
              Compare Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}