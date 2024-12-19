import { Plan } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Phone } from "lucide-react";

interface PlanGridProps {
  plans: Plan[];
  onCompare: (plan: Plan) => void;
  comparedPlans: Plan[];
  estimatedUse: string;
}

export function PlanGrid({ plans, onCompare, comparedPlans, estimatedUse }: PlanGridProps) {
  const getPriceForUsage = (plan: Plan) => {
    switch (estimatedUse) {
      case "500":
        return plan.price_kwh500;
      case "1000":
        return plan.price_kwh1000;
      case "2000":
        return plan.price_kwh2000;
      default:
        return plan.price_kwh;
    }
  };

  return (
    <div className="w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Plan Details</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Features</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={`${plan.company_id}-${plan.plan_name}`}>
              <TableCell className="font-medium">
                <div className="flex flex-col items-start gap-2">
                  <img
                    src={plan.company_logo || "/placeholder.svg"}
                    alt={plan.company_name}
                    className="h-12 object-contain"
                  />
                  <span className="text-sm font-semibold">{plan.company_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-medium">{plan.plan_name}</p>
                  <p className="text-sm text-muted-foreground">{plan.plan_details}</p>
                  {plan.contract_length && (
                    <p className="text-sm">
                      {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'} contract
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{getPriceForUsage(plan).toFixed(1)}¢</p>
                  <p className="text-sm text-muted-foreground">per kWh</p>
                  {plan.base_charge && (
                    <p className="text-sm text-muted-foreground">
                      ${plan.base_charge}/month base charge
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-1 text-sm">
                  {plan.plan_type_name && <p>{plan.plan_type_name}</p>}
                  {plan.renewable_percentage > 0 && (
                    <p>{plan.renewable_percentage}% Renewable</p>
                  )}
                  {plan.prepaid && <p>Prepaid Plan</p>}
                  {plan.timeofuse && <p>Time of Use</p>}
                  {plan.minimum_usage && <p>Min. Usage Required</p>}
                  {plan.new_customer && <p>New Customers Only</p>}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-2">
                  {plan.go_to_plan && (
                    <Button asChild size="sm" className="w-full">
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
                    size="sm"
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
                      className="flex items-center justify-end gap-1 text-sm text-muted-foreground hover:text-primary"
                    >
                      <Phone className="h-4 w-4" /> {plan.enroll_phone}
                    </a>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}