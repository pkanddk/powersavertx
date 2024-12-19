import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { PlanGrid } from "@/components/PlanGrid";
import { PlanComparisonTable } from "@/components/PlanComparisonTable";
import { PlanFilters } from "@/components/PlanFilters";
import { type Plan, searchPlans } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { filterPlans } from "@/lib/utils/filterPlans";
import { PageHeader } from "@/components/PageHeader";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { LoadingState, EmptyState } from "@/components/LoadingAndEmptyStates";

export default function Index() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [currentContractLength, setCurrentContractLength] = useState("all");
  const [currentPlanType, setCurrentPlanType] = useState("all");
  const [currentTimeOfUse, setCurrentTimeOfUse] = useState("all");
  const [currentCompany, setCurrentCompany] = useState("all");
  const [currentMinUsage, setCurrentMinUsage] = useState("all");
  const [currentRenewable, setCurrentRenewable] = useState("all");
  const { toast } = useToast();
  const estimatedUse = searchParams.get("estimatedUse") || "any";

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ["plans", search?.zipCode, search?.estimatedUse],
    queryFn: async () => {
      console.log("[Index] Starting plan fetch with search state:", search);
      
      if (!search?.zipCode) {
        console.log("[Index] No ZIP code provided, returning empty result");
        return [];
      }

      return searchPlans(search.zipCode, search.estimatedUse);
    },
    meta: {
      onError: (error: Error) => {
        console.error("[Index] Query error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to fetch energy plans. Please try again.",
          variant: "destructive",
        });
      },
    },
  });

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Search initiated with:", { zipCode, estimatedUse });
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

  const filteredPlans = plans ? filterPlans(plans, {
    planType: currentPlanType,
    contractLength: currentContractLength,
    timeOfUseFilter: currentTimeOfUse,
    companyFilter: currentCompany,
    sortOrder: currentSort,
    estimatedUse: search?.estimatedUse,
    minUsageFilter: currentMinUsage,
    renewableFilter: currentRenewable,
  }) : [];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <PageHeader />

        <div className="mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {search?.zipCode && (
          <div className="mb-8">
            <PlanFilters
              onSortChange={setCurrentSort}
              onContractLengthChange={setCurrentContractLength}
              onPlanTypeChange={setCurrentPlanType}
              onTimeOfUseChange={setCurrentTimeOfUse}
              onCompanyChange={setCurrentCompany}
              onMinUsageChange={setCurrentMinUsage}
              onRenewableChange={setCurrentRenewable}
              currentSort={currentSort}
              currentContractLength={currentContractLength}
              currentPlanType={currentPlanType}
              currentTimeOfUse={currentTimeOfUse}
              currentCompany={currentCompany}
              currentMinUsage={currentMinUsage}
              currentRenewable={currentRenewable}
              plans={plans}
            />
          </div>
        )}

        {comparedPlans.length > 0 && (
          <div className="mb-12 overflow-x-auto">
            <h2 className="text-2xl font-semibold mb-4">Plan Comparison</h2>
            <PlanComparisonTable plans={comparedPlans} />
          </div>
        )}

        {isLoading && <LoadingState />}
        {error && <ErrorDisplay error={error} />}
        {!isLoading && !error && (!filteredPlans || filteredPlans.length === 0) && (
          <EmptyState hasSearch={!!search?.zipCode} />
        )}

        {filteredPlans && filteredPlans.length > 0 && (
          <PlanGrid 
            plans={filteredPlans}
            onCompare={handleCompare}
            comparedPlans={comparedPlans}
            estimatedUse={estimatedUse}
          />
        )}
      </main>
    </div>
  );
}