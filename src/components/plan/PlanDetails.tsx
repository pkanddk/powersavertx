import { Plan } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { X } from "lucide-react";

interface PlanDetailsProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

export function PlanDetails({ plan, isOpen, onClose }: PlanDetailsProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-xl w-[90vw] overflow-y-auto">
        <div className="relative h-full">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>

          {/* Header with company logo and name */}
          <div className="mb-8 pt-2">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={plan.company_logo || "/placeholder.svg"}
                alt={plan.company_name}
                className="h-12 w-12 object-contain"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{plan.plan_name}</h2>
                <p className="text-sm text-muted-foreground">{plan.company_name}</p>
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="space-y-8">
            {/* Plan Details Section */}
            {plan.plan_details && (
              <section className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Plan Details</h3>
                <div className="bg-primary/5 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {plan.plan_details}
                  </p>
                </div>
              </section>
            )}

            {/* Pricing Details Section */}
            <section className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Pricing Details</h3>
              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                {plan.pricing_details && (
                  <p className="text-sm text-muted-foreground">{plan.pricing_details}</p>
                )}
                {plan.base_charge && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Base Charge</span>
                    <span className="font-medium">${plan.base_charge}/month</span>
                  </div>
                )}
              </div>
            </section>

            {/* Contract Information Section */}
            <section className="space-y-3">
              <h3 className="text-lg font-medium text-gray-900">Contract Information</h3>
              <div className="bg-primary/5 rounded-lg p-4 space-y-2">
                {plan.contract_length && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Contract Length</span>
                    <span className="font-medium">
                      {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
                    </span>
                  </div>
                )}
                {plan.minimum_usage && (
                  <div className="text-sm text-muted-foreground">
                    • Minimum usage requirement applies
                  </div>
                )}
                {plan.new_customer && (
                  <div className="text-sm text-muted-foreground">
                    • Available for new customers only
                  </div>
                )}
              </div>
            </section>

            {/* Links Section */}
            {(plan.fact_sheet || plan.terms_of_service || plan.yrac_url) && (
              <section className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900">Important Documents</h3>
                <div className="space-y-2">
                  {plan.fact_sheet && (
                    <a
                      href={plan.fact_sheet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline text-sm"
                    >
                      Electricity Facts Label
                    </a>
                  )}
                  {plan.terms_of_service && (
                    <a
                      href={plan.terms_of_service}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline text-sm"
                    >
                      Terms of Service
                    </a>
                  )}
                  {plan.yrac_url && (
                    <a
                      href={plan.yrac_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-primary hover:underline text-sm"
                    >
                      Your Rights as a Customer
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}