import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/SearchForm";
import { PlanGrid } from "@/components/PlanGrid";
import { PlanFilters } from "@/components/PlanFilters";
import { PlanComparisonTable } from "@/components/PlanComparisonTable";
import { searchPlans, type Plan } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export default function Index() {
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [sortOrder, setSortOrder] = useState<string>('price-asc');
  const [contractLength, setContractLength] = useState('all');
  const [planType, setPlanType] = useState('all');
  const [prepaidFilter, setPrepaidFilter] = useState('all');
  const [timeOfUseFilter, setTimeOfUseFilter] = useState('all');
  
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

  const filterAndSortPlans = (plans: Plan[] | undefined) => {
    if (!plans) return [];
    
    let filteredPlans = [...plans];

    // Apply plan type filter
    if (planType !== 'all') {
      filteredPlans = filteredPlans.filter(plan => {
        const planTypeName = plan.plan_type_name?.trim();
        if (planType === 'fixed') {
          return planTypeName === "Fixed Rate";
        } else if (planType === 'variable') {
          return planTypeName === "Variable Rate";
        }
        return true;
      });
    }

    // Apply contract length filter
    if (contractLength !== 'all') {
      filteredPlans = filteredPlans.filter(plan => {
        const length = plan.contract_length || 0;
        switch (contractLength) {
          case '0-6': return length >= 0 && length <= 6;
          case '7-12': return length >= 7 && length <= 12;
          case '13+': return length >= 13;
          default: return true;
        }
      });
    }

    // Apply prepaid filter
    if (prepaidFilter !== 'all') {
      filteredPlans = filteredPlans.filter(plan => {
        const isPrepaid = plan.plan_type_name.toLowerCase().includes('prepaid');
        return prepaidFilter === 'prepaid-only' ? isPrepaid : !isPrepaid;
      });
    }

    // Apply time of use filter
    if (timeOfUseFilter !== 'all') {
      filteredPlans = filteredPlans.filter(plan => {
        const isTimeOfUse = plan.plan_type_name.toLowerCase().includes('time of use');
        return timeOfUseFilter === 'tou-only' ? isTimeOfUse : !isTimeOfUse;
      });
    }

    // Apply sorting
    return filteredPlans.sort((a, b) => {
      switch (sortOrder) {
        case 'price-asc':
          return a.price_kwh - b.price_kwh;
        case 'price-desc':
          return b.price_kwh - a.price_kwh;
        case 'length-asc':
          return (a.contract_length || 0) - (b.contract_length || 0);
        case 'length-desc':
          return (b.contract_length || 0) - (a.contract_length || 0);
        default:
          return 0;
      }
    });
  };

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
            <PlanComparisonTable plans={comparedPlans} />
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        )}

        {plans && (
          <>
            <PlanFilters
              currentSort={sortOrder}
              currentContractLength={contractLength}
              currentPlanType={planType}
              currentPrepaid={prepaidFilter}
              currentTimeOfUse={timeOfUseFilter}
              onSortChange={setSortOrder}
              onContractLengthChange={setContractLength}
              onPlanTypeChange={setPlanType}
              onPrepaidChange={setPrepaidFilter}
              onTimeOfUseChange={setTimeOfUseFilter}
            />
            <PlanGrid 
              plans={filterAndSortPlans(plans)}
              onCompare={handleCompare}
              comparedPlans={comparedPlans}
            />
          </>
        )}
      </main>
    </div>
  );
}