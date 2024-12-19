import { Plan } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PriceAlertForm } from "./PriceAlertForm";
import { usePriceAlert } from "./usePriceAlert";

interface PriceAlertDialogProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

export function PriceAlertDialog({ plan, isOpen, onClose }: PriceAlertDialogProps) {
  const { isLoading, handleSubmit } = usePriceAlert(plan, onClose);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
          <DialogDescription>
            Get notified when this plan's price drops below your threshold.
          </DialogDescription>
        </DialogHeader>

        <PriceAlertForm
          plan={plan}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}