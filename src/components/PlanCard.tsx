import { Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  onCompare?: (plan: Plan) => void;
  isCompared?: boolean;
}

export function PlanCard({ plan, onCompare, isCompared }: PlanCardProps) {
  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "¢";
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow animate-fade-in">
      <CardHeader className="flex-none h-32 flex items-center justify-center p-4 bg-secondary/50">
        <img 
          src={plan.company_logo} 
          alt={`${plan.company_name} logo`}
          className="max-h-full max-w-full object-contain"
        />
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{plan.plan_name}</h3>
            <p className="text-sm text-muted-foreground">{plan.company_name}</p>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm">{plan.jdp_rating}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(plan.price_kwh)}
              </span>
              <span className="text-sm text-muted-foreground">per kWh</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>500 kWh: {formatPrice(plan.price_kwh500)}</div>
              <div>1,000 kWh: {formatPrice(plan.price_kwh1000)}</div>
              <div>2,000 kWh: {formatPrice(plan.price_kwh2000)}</div>
            </div>
          </div>
          
          {plan.base_charge && (
            <div className="text-sm text-muted-foreground">
              Base Charge: ${plan.base_charge}/month
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{plan.plan_type_name}</Badge>
            <Badge variant="outline">
              {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
            </Badge>
            {plan.minimum_usage && (
              <Badge variant="secondary">Min. Usage Required</Badge>
            )}
            {plan.new_customer && (
              <Badge variant="secondary">New Customers Only</Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {plan.plan_details}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex-none p-6 pt-0 space-y-3">
        <div className="w-full space-y-3">
          {onCompare && (
            <Button 
              variant={isCompared ? "secondary" : "outline"} 
              className="w-full"
              onClick={() => onCompare(plan)}
            >
              {isCompared ? "Remove from Compare" : "Add to Compare"}
            </Button>
          )}
          {plan.go_to_plan && (
            <Button asChild className="w-full">
              <a href={plan.go_to_plan} target="_blank" rel="noopener noreferrer">
                View Plan
              </a>
            </Button>
          )}
          {plan.fact_sheet && (
            <Button variant="outline" asChild className="w-full">
              <a href={plan.fact_sheet} target="_blank" rel="noopener noreferrer">
                Fact Sheet
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}