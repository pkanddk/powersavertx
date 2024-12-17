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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Feature</TableHead>
          {plans.map(plan => (
            <TableHead key={plan.company_id}>{plan.plan_name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Price per kWh</TableCell>
          {plans.map(plan => (
            <TableCell key={plan.company_id}>{formatPrice(plan.price_kwh)}</TableCell>
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
            <TableCell key={plan.company_id}>{plan.plan_type_name}</TableCell>
          ))}
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Rating</TableCell>
          {plans.map(plan => (
            <TableCell key={plan.company_id}>{plan.jdp_rating}/5</TableCell>
          ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}