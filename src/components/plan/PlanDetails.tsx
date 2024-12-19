import { Plan } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface PlanDetailsProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

export function PlanDetails({ plan, isOpen, onClose }: PlanDetailsProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{plan.plan_name}</SheetTitle>
          <SheetDescription>{plan.company_name}</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Plan Details</h3>
            <p className="text-sm text-muted-foreground">{plan.plan_details}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing Details</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{plan.pricing_details}</p>
              {plan.base_charge && (
                <p className="text-sm">Base Charge: ${plan.base_charge}/month</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contract Information</h3>
            <div className="space-y-2">
              {plan.contract_length && (
                <p className="text-sm">Contract Length: {plan.contract_length} months</p>
              )}
              {plan.minimum_usage && (
                <p className="text-sm">Minimum Usage Required</p>
              )}
              {plan.new_customer && (
                <p className="text-sm">New Customers Only</p>
              )}
            </div>
          </div>

          {plan.fact_sheet && (
            <div className="pt-4">
              <a
                href={plan.fact_sheet}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
              >
                View Electricity Facts Label
              </a>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}