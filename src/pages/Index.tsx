import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchForm } from "@/components/SearchForm";
import { PlanGrid } from "@/components/PlanGrid";
import { Plan } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { filterPlans } from "@/lib/utils/filterPlans";
import { PlanFilters } from "@/components/PlanFilters";
import { ComparisonBar } from "@/components/plan/ComparisonBar";
import { WelcomeDialog } from "@/components/WelcomeDialog";
import { BugReportDialog } from "@/components/BugReportDialog";
import { DevMessageDialog } from "@/components/DevMessageDialog";
import { searchPlans } from "@/lib/api";

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
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <WelcomeDialog zipCode={search?.zipCode} />
      <main className="container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Power Saver TX
            </h1>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-md border border-red-200">
              BETA
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-xl md:text-2xl font-semibold text-primary">
              Simple. Savings.
            </p>
            <div className="flex items-center gap-3 md:gap-4">
              <DevMessageDialog />
              <BugReportDialog />
            </div>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 mt-4">
            Compare energy plans and save money with Power Saver TX
          </p>
        </div>

        <div className="space-y-4">
          <SearchForm onSearch={onSearch} isLoading={isLoading} />
          
          {plans && (
            <>
              <div className="md:hidden">
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
              </div>

              <div className="hidden md:block">
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
              </div>

              {isLoading ? (
                <div className="text-center py-8 md:py-12">
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
            </>
          )}
        </div>

        <ComparisonBar
          plans={comparedPlans}
          onRemove={onCompare}
        />
      </main>
    </div>
  );
}
