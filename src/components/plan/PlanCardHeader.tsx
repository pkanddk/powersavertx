import { Plan } from "@/lib/api";

interface PlanCardHeaderProps {
  plan: Plan;
}

export function PlanCardHeader({ plan }: PlanCardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <img
          src={plan.company_logo || "/placeholder.svg"}
          alt={plan.company_name}
          className="h-10 object-contain opacity-90 group-hover:opacity-100 transition-opacity"
        />
        <h3 className="text-xs text-muted-foreground/80">{plan.company_name}</h3>
      </div>
      {plan.contract_length && (
        <span className="text-xs font-medium text-primary bg-primary/5 px-2.5 py-1 rounded-full ring-1 ring-primary/10">
          {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
        </span>
      )}
    </div>
  );
}