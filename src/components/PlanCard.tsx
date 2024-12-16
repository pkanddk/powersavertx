import { Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface PlanCardProps {
  plan: Plan;
}

export function PlanCard({ plan }: PlanCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow animate-fade-in">
      <CardHeader className="flex-none h-32 flex items-center justify-center p-4 bg-secondary/50">
        <img 
          src={plan.company_logo} 
          alt={`${plan.plan_name} logo`}
          className="max-h-full max-w-full object-contain"
        />
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <h3 className="text-xl font-semibold mb-2">{plan.plan_name}</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>Type: {plan.plan_type_name}</p>
          {plan.minimum_usage && <p>Minimum usage required</p>}
          {plan.new_customer && <p>New customers only</p>}
          <p className="line-clamp-2">{plan.plan_details}</p>
        </div>
      </CardContent>
      <CardFooter className="flex-none p-6 pt-0">
        <div className="w-full space-y-3">
          <Button asChild className="w-full">
            <a href={plan.go_to_plan} target="_blank" rel="noopener noreferrer">
              View Plan
            </a>
          </Button>
          <Button variant="outline" asChild className="w-full">
            <a href={plan.fact_sheet} target="_blank" rel="noopener noreferrer">
              Fact Sheet
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}