import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { PlanGrid } from "@/components/PlanGrid";
import { PlanComparisonTable } from "@/components/PlanComparisonTable";
import { PlanFilters } from "@/components/PlanFilters";
import { type Plan } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { filterPlans } from "@/lib/utils/filterPlans";
import { supabase } from "@/integrations/supabase/client";
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

  const { data: plansData, isLoading, error } = useQuery({
    queryKey: ["plans", search?.zipCode],
    queryFn: async () => {
      console.log("[Index] Starting plan fetch. Search state:", search);
      
      if (!search?.zipCode) {
        console.log("[Index] No ZIP code provided, returning empty result");
        return { plans: [], lastUpdated: null };
      }

      console.log("[Index] Fetching plans from Supabase for ZIP:", search.zipCode);
      const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .eq('zip_code', search.zipCode);

      if (error) {
        console.error('[Index] Error fetching plans from Supabase:', error);
        throw error;
      }

      if (!plans || plans.length === 0) {
        console.log('[Index] No plans found in Supabase, fetching from Edge Function');
        const { data: responseData, error: functionError } = await supabase.functions.invoke('power-to-choose', {
          body: { zipCode: search.zipCode, estimatedUse },
        });

        console.log('[Index] Edge Function response:', responseData);

        if (functionError) {
          console.error('[Index] Error calling Edge Function:', functionError);
          throw functionError;
        }

        if (!responseData) {
          console.error('[Index] No data received from Edge Function');
          throw new Error('No plans found for this ZIP code');
        }

        if ('error' in responseData) {
          console.error('[Index] Error from Edge Function:', responseData.error);
          throw new Error(responseData.error);
        }

        return {
          plans: Array.isArray(responseData) ? responseData : [],
          lastUpdated: new Date().toISOString()
        };
      }

      console.log("[Index] Found plans in Supabase:", plans?.length || 0, "results");
      return {
        plans: plans || [],
        lastUpdated: plans?.[0]?.updated_at
      };
    },
    meta: {
      onError: (error: Error) => {
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

  const filteredPlans = plansData?.plans ? filterPlans(plansData.plans, {
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
        <PageHeader lastUpdated={plansData?.lastUpdated} />

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
              plans={plansData?.plans}
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
        {!isLoading && !error && (!plansData?.plans || plansData.plans.length === 0) && (
          <EmptyState hasSearch={!!search?.zipCode} />
        )}

        {plansData?.plans && plansData.plans.length > 0 && (
          <PlanGrid 
            plans={plansData.plans}
            onCompare={handleCompare}
            comparedPlans={comparedPlans}
            estimatedUse={estimatedUse}
          />
        )}
      </main>
    </div>
  );
}