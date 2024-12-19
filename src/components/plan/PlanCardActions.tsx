import { Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PriceAlertDialog } from "./PriceAlertDialog";
import { Bell } from "lucide-react";

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
  onShowDetails,
}: PlanCardActionsProps) {
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onShowDetails(plan)}
        >
          View Details
        </Button>
        <Button
          variant={isCompared ? "destructive" : "outline"}
          size="sm"
          className="flex-1"
          onClick={() => onCompare(plan)}
        >
          {isCompared ? "Remove" : "Compare"}
        </Button>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => setShowAlertDialog(true)}
      >
        <Bell className="mr-2 h-4 w-4" />
        Set Price Alert
      </Button>

      <PriceAlertDialog
        plan={plan}
        isOpen={showAlertDialog}
        onClose={() => setShowAlertDialog(false)}
      />
    </div>
  );
}