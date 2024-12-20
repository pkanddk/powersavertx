import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plan } from "@/lib/api";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown } from "lucide-react";

interface PlanComparisonTableProps {
  plans: Plan[];
}

export function PlanComparisonTable({ plans }: PlanComparisonTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {plans.map((plan) => (
          <div key={plan.company_id} className="bg-white rounded-lg border border-border">
            <div className="p-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <img
                  src={plan.company_logo || "/placeholder.svg"}
                  alt={plan.company_name}
                  className="h-6 object-contain"
                />
                <div>
                  <h3 className="font-medium text-sm">{plan.plan_name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.company_name}</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 border-b border-border">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-muted-foreground">Price/kWh</span>
                  <p className="font-semibold">{formatPrice(plan.price_kwh)}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Contract</span>
                  <p>{plan.contract_length} mo</p>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value="details" className="border-b-0">
                <AccordionTrigger className="py-2 px-3 text-sm hover:no-underline">
                  <span className="text-primary">More Details</span>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-muted-foreground">Base Charge</span>
                      <p>{plan.base_charge ? `$${plan.base_charge}/month` : 'None'}</p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground">Plan Type</span>
                      <p className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {plan.plan_type_name}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-xs text-muted-foreground">Renewable Energy</span>
                      <p>{plan.renewable_percentage}%</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    );
  }

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