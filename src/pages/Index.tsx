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
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Index() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const [currentSort, setCurrentSort] = useState("price-asc");
  const [currentContractLength, setCurrentContractLength] = useState("all");
  const [currentPlanType, setCurrentPlanType] = useState("all");
  const [currentPrepaid, setCurrentPrepaid] = useState("all");
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
        return { plans: [], lastUpdated: null };
      }

      const { data: plans, error } = await supabase
        .from('plans')
        .select('*')
        .eq('zip_code', search.zipCode);

      if (error) {
        console.error('[Index] Error fetching plans:', error);
        throw error;
      }

      // If no plans found in database, try fetching from API
      if (!plans || plans.length === 0) {
        console.log('[Index] No plans found in database, fetching from API');
        const { data: responseData, error: functionError } = await supabase.functions.invoke('power-to-choose', {
          body: { zipCode: search.zipCode, estimatedUse },
        });

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

      console.log("[Index] Fetched plans:", plans?.length || 0, "results");
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Find the Best Energy Plan</h1>
          <p className="text-xl text-muted-foreground">
            Compare energy plans and prices in your area
          </p>
          {plansData?.lastUpdated && (
            <p className="text-sm text-muted-foreground mt-2">
              Last updated: {format(new Date(plansData.lastUpdated), 'PPpp')}
            </p>
          )}
        </div>

        <div className="mb-12">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {search?.zipCode && (
          <div className="mb-8">
            <PlanFilters
              onSortChange={setCurrentSort}
              onContractLengthChange={setCurrentContractLength}
              onPlanTypeChange={setCurrentPlanType}
              onPrepaidChange={setCurrentPrepaid}
              onTimeOfUseChange={setCurrentTimeOfUse}
              onCompanyChange={setCurrentCompany}
              onMinUsageChange={setCurrentMinUsage}
              onRenewableChange={setCurrentRenewable}
              currentSort={currentSort}
              currentContractLength={currentContractLength}
              currentPlanType={currentPlanType}
              currentPrepaid={currentPrepaid}
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

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : "Failed to fetch energy plans. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {search?.zipCode 
                ? "No plans found for this ZIP code. Please try another ZIP code."
                : "Enter your ZIP code to find available plans in your area."}
            </p>
          </div>
        )}

        {filteredPlans.length > 0 && (
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
