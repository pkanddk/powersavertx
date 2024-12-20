import { Button } from "@/components/ui/button";
import { Plan } from "@/lib/api";
import { GitCompare, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonBarProps {
  plans: Plan[];
  onRemove: (plan: Plan) => void;
}

export function ComparisonBar({ plans, onRemove }: ComparisonBarProps) {
  const isMobile = useIsMobile();
  
  if (plans.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg animate-slide-up z-50">
      <div className="container mx-auto px-4 py-6 md:py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-3">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-3">
              <GitCompare className="h-7 w-7 md:h-5 md:w-5 text-primary" />
              <span className="text-xl md:text-base font-medium">
                {plans.length} {plans.length === 1 ? 'Plan' : 'Plans'} Selected
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 md:gap-2">
              {plans.map((plan) => (
                <div
                  key={plan.company_id}
                  className="flex items-center gap-3 md:gap-2 bg-muted px-4 py-3 md:px-2 md:py-1 rounded-lg md:rounded-md"
                >
                  <span className="text-lg md:text-sm truncate max-w-[200px] md:max-w-[150px]">
                    {plan.plan_name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-5 md:w-5 shrink-0"
                    onClick={() => onRemove(plan)}
                  >
                    <X className="h-5 w-5 md:h-3 md:w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Link to="/compare" className="w-full md:w-auto">
            <Button 
              variant="default" 
              className="w-full md:w-auto text-lg md:text-sm py-8 md:py-2 rounded-lg md:rounded-md"
            >
              Compare Plans
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}