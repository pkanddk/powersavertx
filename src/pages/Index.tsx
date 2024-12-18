import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { PlanGrid } from "@/components/PlanGrid";
import { PlanComparisonTable } from "@/components/PlanComparisonTable";
import { type Plan } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { filterPlans } from "@/lib/utils/filterPlans";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export default function Index() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState<{ zipCode: string; estimatedUse: string } | null>(null);
  const [comparedPlans, setComparedPlans] = useState<Plan[]>([]);
  const { toast } = useToast();
  const estimatedUse = searchParams.get("estimatedUse") || "any";

  const { data: plansData, isLoading } = useQuery({
    queryKey: ["plans", search?.zipCode],
    queryFn: async () => {
      console.log("[Index] Starting plan fetch. Search state:", search);
      let query = supabase.from('plans').select('*');
      
      if (search?.zipCode) {
        console.log("[Index] Filtering by zip code:", search.zipCode);
        query = query.eq('zip_code', search.zipCode);
      }

      const { data: plans, error } = await query;

      if (error) {
        console.error('[Index] Error fetching plans:', error);
        throw error;
      }

      console.log("[Index] Fetched plans:", plans?.length || 0, "results");
      return {
        plans: plans || [],
        lastUpdated: plans?.[0]?.updated_at
      };
    },
    initialData: { plans: [], lastUpdated: null },
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
    estimatedUse: search?.estimatedUse,
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

        {!isLoading && filteredPlans.length === 0 && (
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