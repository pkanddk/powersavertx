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
  console.log('PlanGrid - Full plan data:', plans.map(plan => ({
    id: plan.id,
    company_name: plan.company_name,
    plan_name: plan.plan_name,
    plan_details: plan.plan_details,
    plan_type_name: plan.plan_type_name,
    prices: {
      base: plan.price_kwh,
      kwh500: plan.price_kwh500,
      kwh1000: plan.price_kwh1000,
      kwh2000: plan.price_kwh2000,
      base_charge: plan.base_charge
    },
    contract: {
      length: plan.contract_length,
      terms: plan.terms_of_service
    },
    features: {
      renewable: plan.renewable_percentage,
      prepaid: plan.prepaid,
      timeofuse: plan.timeofuse,
      minimum_usage: plan.minimum_usage,
      new_customer: plan.new_customer
    },
    details: {
      kwh500: plan.detail_kwh500,
      kwh1000: plan.detail_kwh1000,
      kwh2000: plan.detail_kwh2000,
      pricing: plan.pricing_details
    },
    contact: {
      phone: plan.enroll_phone,
      website: plan.website,
      enroll_url: plan.go_to_plan
    },
    documents: {
      fact_sheet: plan.fact_sheet,
      yrac_url: plan.yrac_url
    }
  })));

  const getPriceForUsage = (plan: Plan) => {
    let price;
    if (estimatedUse === "any") {
      price = plan.price_kwh1000;
    } else {
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
          price = plan.price_kwh1000;
      }
    }
    return price;
  };

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
                <p className="text-sm text-muted-foreground">{plan.plan_details}</p>
                {plan.contract_length && (
                  <p className="text-sm text-primary font-medium">
                    {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'} contract
                  </p>
                )}
              </div>

              {/* Price Section */}
              <div className="space-y-4">
                {/* Highlighted Price based on selection */}
                <div className="bg-primary/5 p-4 rounded-lg">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{getPriceForUsage(plan).toFixed(1)}</span>
                    <span className="text-lg text-gray-900">¢</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      at {estimatedUse === "any" ? "1,000" : estimatedUse} kWh
                    </span>
                  </div>
                </div>

                {/* All Available Prices */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">500 kWh Usage:</span>
                    <span className="font-medium">{plan.price_kwh500.toFixed(1)}¢</span>
                    {plan.detail_kwh500 && (
                      <p className="text-xs text-muted-foreground mt-1">{plan.detail_kwh500}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">1,000 kWh Usage:</span>
                    <span className="font-medium">{plan.price_kwh1000.toFixed(1)}¢</span>
                    {plan.detail_kwh1000 && (
                      <p className="text-xs text-muted-foreground mt-1">{plan.detail_kwh1000}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">2,000 kWh Usage:</span>
                    <span className="font-medium">{plan.price_kwh2000.toFixed(1)}¢</span>
                    {plan.detail_kwh2000 && (
                      <p className="text-xs text-muted-foreground mt-1">{plan.detail_kwh2000}</p>
                    )}
                  </div>
                  {plan.base_charge && (
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-muted-foreground">Base Charge:</span>
                      <span className="font-medium">${plan.base_charge}/month</span>
                    </div>
                  )}
                  {plan.pricing_details && (
                    <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                      {plan.pricing_details}
                    </p>
                  )}
                </div>
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
                  {plan.minimum_usage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>Minimum Usage Required</span>
                    </div>
                  )}
                  {plan.new_customer && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary" />
                      <span>New Customers Only</span>
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