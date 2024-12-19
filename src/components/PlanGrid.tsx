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
    <div className="w-full overflow-auto rounded-lg border border-border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[200px]">Provider</TableHead>
            <TableHead className="w-[300px]">Plan Details</TableHead>
            <TableHead className="text-right w-[180px]">Price</TableHead>
            <TableHead className="text-right w-[200px]">Features</TableHead>
            <TableHead className="text-right w-[180px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {plans.map((plan) => (
            <TableRow key={`${plan.company_id}-${plan.plan_name}`} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                <div className="flex flex-col items-start gap-3">
                  <img
                    src={plan.company_logo || "/placeholder.svg"}
                    alt={plan.company_name}
                    className="h-12 object-contain"
                  />
                  <span className="text-sm font-medium text-gray-900">{plan.company_name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{plan.plan_name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{plan.plan_details}</p>
                  {plan.contract_length && (
                    <p className="text-sm text-primary font-medium">
                      {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'} contract
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{getPriceForUsage(plan).toFixed(1)}¢</p>
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
                  {plan.plan_type_name && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {plan.plan_type_name}
                    </span>
                  )}
                  {plan.renewable_percentage > 0 && (
                    <p className="text-muted-foreground">{plan.renewable_percentage}% Renewable</p>
                  )}
                  {plan.prepaid && (
                    <p className="text-muted-foreground">Prepaid Plan</p>
                  )}
                  {plan.timeofuse && (
                    <p className="text-muted-foreground">Time of Use</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="space-y-2">
                  {plan.go_to_plan && (
                    <Button variant="default" size="sm" className="w-full" asChild>
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
                      className="flex items-center justify-end gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
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