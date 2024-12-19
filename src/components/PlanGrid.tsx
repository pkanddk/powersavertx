import { Plan } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone, Check } from "lucide-react";

interface PlanGridProps {
  plans: Plan[];
  onCompare: (plan: Plan) => void;
  comparedPlans: Plan[];
  estimatedUse: string;
}

export function PlanGrid({ plans, onCompare, comparedPlans, estimatedUse }: PlanGridProps) {
  console.log('PlanGrid - Received plans:', plans);
  console.log('PlanGrid - Estimated Use:', estimatedUse);

  const getPriceForUsage = (plan: Plan) => {
    let price;
    switch (estimatedUse) {
      case "500":
        price = plan.price_kwh500;
        break;
      case "1000":
        price = plan.price_kwh1000;
        break;
      case "2000":
        price = plan.price_kwh2000;
        break;
      default:
        price = plan.price_kwh;
    }
    console.log(`Price for plan ${plan.plan_name}:`, {
      estimatedUse,
      price,
      raw: {
        price_kwh: plan.price_kwh,
        price_kwh500: plan.price_kwh500,
        price_kwh1000: plan.price_kwh1000,
        price_kwh2000: plan.price_kwh2000
      }
    });
    return price;
  };

  // Sanitize plan type name to remove unwanted numbers
  const formatPlanType = (planType: string) => {
    return planType.replace(/[0-9]/g, '').trim() || 'Fixed Rate';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan) => (
        <Card key={`${plan.company_id}-${plan.plan_name}`} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Provider Section */}
              <div className="flex flex-col items-start gap-3">
                <img
                  src={plan.company_logo || "/placeholder.svg"}
                  alt={plan.company_name}
                  className="h-12 object-contain"
                />
                <h3 className="font-medium text-gray-900">{plan.company_name}</h3>
              </div>

              {/* Plan Details Section */}
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-gray-900">{plan.plan_name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">{plan.plan_details}</p>
                {plan.contract_length && (
                  <p className="text-sm text-primary font-medium">
                    {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'} contract
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900">{getPriceForUsage(plan).toFixed(1)}</span>
                  <span className="text-lg text-gray-900">¢</span>
                </div>
                <p className="text-sm text-muted-foreground">per kWh</p>
                {plan.base_charge && (
                  <p className="text-sm text-muted-foreground">
                    ${plan.base_charge}/month base charge
                  </p>
                )}
              </div>

              {/* Features Section */}
              <div className="space-y-2">
                {plan.plan_type_name && (
                  <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    {formatPlanType(plan.plan_type_name)}
                  </div>
                )}
                <div className="space-y-1">
                  {plan.renewable_percentage > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{plan.renewable_percentage}% Renewable</span>
                    </div>
                  )}
                  {plan.prepaid && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Prepaid Plan</span>
                    </div>
                  )}
                  {plan.timeofuse && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Time of Use</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="space-y-3 pt-2">
                {plan.go_to_plan && (
                  <Button variant="default" size="lg" className="w-full" asChild>
                    <a
                      href={plan.go_to_plan}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2"
                    >
                      View Plan <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button
                  variant={comparedPlans.some(p => p.company_id === plan.company_id) ? "destructive" : "outline"}
                  size="lg"
                  onClick={() => onCompare(plan)}
                  className="w-full"
                >
                  {comparedPlans.some(p => p.company_id === plan.company_id)
                    ? "Remove"
                    : "Compare"}
                </Button>
                {plan.enroll_phone && (
                  <a
                    href={`tel:${plan.enroll_phone}`}
                    className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="h-4 w-4" /> {plan.enroll_phone}
                  </a>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}