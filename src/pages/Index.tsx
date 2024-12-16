import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/SearchForm";
import { PlanCard } from "@/components/PlanCard";
import { searchPlans, type Plan } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";

export default function Index() {
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans", search?.zipCode, search?.estimatedUse],
    queryFn: () => searchPlans(search!.zipCode, search!.estimatedUse),
    enabled: !!search,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch energy plans. Please try again.",
          variant: "destructive",
        });
      },
    },
  });

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    setSearch({ zipCode, estimatedUse });
    setComparedPlans([]);
  };

  const handleCompare = (plan: Plan) => {
    if (comparedPlans.find(p => p.company_id === plan.company_id)) {
      setComparedPlans(comparedPlans.filter(p => p.company_id !== plan.company_id));
    } else if (comparedPlans.length < 3) {
      setComparedPlans([...comparedPlans, plan]);
    } else {
      toast({
        title: "Compare Limit Reached",
        description: "You can compare up to 3 plans at a time. Remove a plan to add another.",
      });
    }
  };

  const formatPrice = (price: number) => {
    return (price * 100).toFixed(1) + "¢";
  };

  const toggleSort = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  const sortedPlans = plans ? [...plans].sort((a, b) => {
    const multiplier = sortOrder === 'asc' ? 1 : -1;
    return (a.price_kwh - b.price_kwh) * multiplier;
  }) : [];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find the Best Energy Plan</h1>
          <p className="text-xl text-muted-foreground">
            Compare energy plans and prices in your area
          </p>
        </div>

        <div className="mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {comparedPlans.length > 0 && (
          <div className="mb-12 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Plan Comparison</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  {comparedPlans.map(plan => (
                    <TableHead key={plan.company_id}>{plan.plan_name}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Price per kWh</TableCell>
                  {comparedPlans.map(plan => (
                    <TableCell key={plan.company_id}>{formatPrice(plan.price_kwh)}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Base Charge</TableCell>
                  {comparedPlans.map(plan => (
                    <TableCell key={plan.company_id}>
                      {plan.base_charge ? `$${plan.base_charge}/month` : 'None'}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Contract Length</TableCell>
                  {comparedPlans.map(plan => (
                    <TableCell key={plan.company_id}>
                      {plan.contract_length} {plan.contract_length === 1 ? 'month' : 'months'}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Plan Type</TableCell>
                  {comparedPlans.map(plan => (
                    <TableCell key={plan.company_id}>{plan.plan_type_name}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rating</TableCell>
                  {comparedPlans.map(plan => (
                    <TableCell key={plan.company_id}>{plan.jdp_rating}/5</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        )}

        {plans && (
          <>
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                onClick={toggleSort}
                className="flex items-center gap-2"
              >
                Sort by Price
                <ArrowUpDown className="h-4 w-4" />
                {sortOrder === 'asc' ? '(Low to High)' : '(High to Low)'}
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPlans.map((plan: Plan) => (
                <PlanCard 
                  key={`${plan.company_id}-${plan.plan_name}`} 
                  plan={plan}
                  onCompare={handleCompare}
                  isCompared={comparedPlans.some(p => p.company_id === plan.company_id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}