import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plan } from "@/lib/api";
import { formatPrice } from "@/lib/utils/formatPrice";

interface PlanComparisonTableProps {
  plans: Plan[];
}

export function PlanComparisonTable({ plans }: PlanComparisonTableProps) {
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[200px]">Feature</TableHead>
            {plans.map(plan => (
              <TableHead key={plan.company_id} className="min-w-[200px]">{plan.plan_name}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Provider</TableCell>
            {plans.map(plan => (
              <TableCell key={plan.company_id}>
                <div className="flex flex-col items-start gap-2">
                  <img
                    src={plan.company_logo || "/placeholder.svg"}
                    alt={plan.company_name}
                    className="h-8 object-contain"
                  />
                  <span className="text-sm">{plan.company_name}</span>
                </div>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Price per kWh</TableCell>
            {plans.map(plan => (
              <TableCell key={plan.company_id} className="text-lg font-semibold">
                {formatPrice(plan.price_kwh)}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Base Charge</TableCell>
            {plans.map(plan => (
              <TableCell key={plan.company_id}>
                {plan.base_charge ? `$${plan.base_charge}/month` : 'None'}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Contract Length</TableCell>
            {plans.map(plan => (
              <TableCell key={plan.company_id}>
                {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Plan Type</TableCell>
            {plans.map(plan => (
              <TableCell key={plan.company_id}>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {plan.plan_type_name}
                </span>
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Renewable Energy</TableCell>
            {plans.map(plan => (
              <TableCell key={plan.company_id}>
                {plan.renewable_percentage}%
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}