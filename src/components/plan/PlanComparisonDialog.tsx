import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plan } from "@/lib/api";
import { PlanComparisonTable } from "../PlanComparisonTable";

interface PlanComparisonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  plans: Plan[];
}

export function PlanComparisonDialog({ isOpen, onClose, plans }: PlanComparisonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Plan Comparison</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <PlanComparisonTable plans={plans} />
        </div>
      </DialogContent>
    </Dialog>
  );
}