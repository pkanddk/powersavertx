import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { PlanGrid } from "@/components/PlanGrid";
import { searchPlans, type Plan } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { filterPlans } from "@/lib/utils/filterPlans";
import { PlanFilters } from "@/components/PlanFilters";
import { ComparisonBar } from "@/components/plan/ComparisonBar";

interface IndexProps {
  comparedPlans: Plan[];
  onCompare: (plan: Plan) => void;
  search: { zipCode: string; estimatedUse: string } | null;
  onSearch: (zipCode: string, estimatedUse: string) => void;
  estimatedUse: string;
}

export default function Index({ comparedPlans, onCompare, search, onSearch, estimatedUse }: IndexProps) {
  const [sortOrder, setSortOrder] = useState("price-asc");
  const [contractLength, setContractLength] = useState("all");
  const [planType, setPlanType] = useState("all");
  const [prepaidFilter, setPrepaidFilter] = useState("all");
  const [timeOfUseFilter, setTimeOfUseFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [renewableFilter, setRenewableFilter] = useState("all");
  const [cancellationFeeRange, setCancellationFeeRange] = useState<[number, number]>([0, 1000]);
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

  const filteredPlans = plans ? filterPlans(plans, {
    planType,
    contractLength,
    prepaidFilter,
    timeOfUseFilter,
    companyFilter,
    sortOrder,
    renewableFilter,
    cancellationFeeRange,
    estimatedUse,
  }) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Find the Best Energy Plan
          </h1>
          <p className="text-xl text-muted-foreground">
            Compare energy plans and prices in your area
          </p>
        </div>

        <div className="mb-12">
          <SearchForm onSearch={onSearch} isLoading={isLoading} />
        </div>

        {plans && (
          <div className="space-y-6">
            <PlanFilters
              onSortChange={setSortOrder}
              onContractLengthChange={setContractLength}
              onPlanTypeChange={setPlanType}
              onPrepaidChange={setPrepaidFilter}
              onTimeOfUseChange={setTimeOfUseFilter}
              onCompanyChange={setCompanyFilter}
              onRenewableChange={setRenewableFilter}
              onCancellationFeeChange={setCancellationFeeRange}
              currentSort={sortOrder}
              currentContractLength={contractLength}
              currentPlanType={planType}
              currentPrepaid={prepaidFilter}
              currentTimeOfUse={timeOfUseFilter}
              currentCompany={companyFilter}
              currentRenewable={renewableFilter}
              currentCancellationFee={cancellationFeeRange}
              plans={plans}
            />

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              </div>
            ) : (
              <PlanGrid
                plans={filteredPlans}
                onCompare={onCompare}
                comparedPlans={comparedPlans}
                estimatedUse={estimatedUse}
              />
            )}
          </div>
        )}

        <ComparisonBar
          plans={comparedPlans}
          onRemove={onCompare}
        />
      </main>
    </div>
  );
}