import { Plan } from "@/lib/api";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PlanDetailsBadges } from "./PlanDetailsBadges";

interface PlanDetailsHeaderProps {
  plan: Plan;
  onClose: () => void;
}

export function PlanDetailsHeader({ plan, onClose }: PlanDetailsHeaderProps) {
  return (
    <DrawerHeader className="space-y-4 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={plan.company_logo || "/placeholder.svg"}
            alt={plan.company_name}
            className="h-12 w-12 object-contain"
          />
          <div className="space-y-1">
            <DrawerTitle className="text-xl font-semibold text-foreground">
              {plan.plan_name}
            </DrawerTitle>
            <p className="text-sm text-muted-foreground">{plan.company_name}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="rounded-full hover:bg-muted"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <PlanDetailsBadges plan={plan} />
    </DrawerHeader>
  );
}