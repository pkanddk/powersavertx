import { Plan } from "@/lib/api";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlanDetailsHeader } from "./PlanDetailsHeader";

interface PlanDetailsProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

export function PlanDetails({ plan, isOpen, onClose }: PlanDetailsProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[95vh] overflow-y-auto">
        <PlanDetailsHeader plan={plan} onClose={onClose} />

        <div className="px-4 pb-8 space-y-6">
          {/* Plan Details Section */}
          {plan.plan_details && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Plan Details</h3>
              <div className="rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {plan.plan_details}
                </p>
              </div>
            </div>
          )}

          {/* Pricing Details Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Pricing Details</h3>
            <div className="rounded-lg bg-muted/50 p-4 space-y-4">
              {plan.pricing_details && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {plan.pricing_details}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {plan.price_kwh500 && (
                  <div>
                    <p className="text-sm font-medium">500 kWh</p>
                    <p className="text-2xl font-bold text-primary">
                      {(plan.price_kwh500).toFixed(1)}¢
                    </p>
                  </div>
                )}
                {plan.price_kwh1000 && (
                  <div>
                    <p className="text-sm font-medium">1000 kWh</p>
                    <p className="text-2xl font-bold text-primary">
                      {(plan.price_kwh1000).toFixed(1)}¢
                    </p>
                  </div>
                )}
                {plan.price_kwh2000 && (
                  <div>
                    <p className="text-sm font-medium">2000 kWh</p>
                    <p className="text-2xl font-bold text-primary">
                      {(plan.price_kwh2000).toFixed(1)}¢
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Contract Information</h3>
            <div className="rounded-lg bg-muted/50 p-4 space-y-3">
              {plan.contract_length && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Contract Length</span>
                  <span className="text-sm font-medium">
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
          </div>

          <Separator />

          {/* Actions Section */}
          <div className="space-y-4">
            {plan.go_to_plan && (
              <Button className="w-full" asChild>
                <a
                  href={plan.go_to_plan}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  Sign Up Now <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}

            {/* Documents Section */}
            {(plan.fact_sheet || plan.terms_of_service || plan.yrac_url) && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Important Documents</p>
                <div className="space-y-2">
                  {plan.fact_sheet && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a
                        href={plan.fact_sheet}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Electricity Facts Label
                      </a>
                    </Button>
                  )}
                  {plan.terms_of_service && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a
                        href={plan.terms_of_service}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms of Service
                      </a>
                    </Button>
                  )}
                  {plan.yrac_url && (
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a
                        href={plan.yrac_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Your Rights as a Customer
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}