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
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface PricingProps {
  comparedPlans: Plan[];
  onCompare: (plan: Plan) => void;
  search: { zipCode: string; estimatedUse: string } | null;
  onSearch: (zipCode: string, estimatedUse: string) => void;
  estimatedUse: string;
}

export default function Pricing({ comparedPlans, onCompare, search, onSearch, estimatedUse }: PricingProps) {
  const [sortOrder, setSortOrder] = useState("price-asc");
  const [contractLength, setContractLength] = useState("all");
  const [planType, setPlanType] = useState("all");
  const [prepaidFilter, setPrepaidFilter] = useState("all");
  const [timeOfUseFilter, setTimeOfUseFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [renewableFilter, setRenewableFilter] = useState("all");
  const [cancellationFeeRange, setCancellationFeeRange] = useState<[number, number]>([0, 1000]);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-white">
      <div className="relative min-h-[calc(100vh-4rem)]">
        {/* Hero Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('/lovable-uploads/f5d9d82f-2512-4bcd-96fe-aeca04160865.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form */}
          <div className="max-w-md mx-auto w-full">
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>

      {/* Plans Section - Only shown after search */}
      {plans && (
        <div className="container mx-auto px-4 py-8">
          {isMobile && (
            <div className="flex items-center justify-center gap-2 md:gap-3 mt-2 mb-4 md:mb-6">
              <DevMessageDialog />
              <BugReportDialog />
            </div>
          )}

          <div className="space-y-6 md:space-y-8">
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
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
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
                  <div className="flex gap-3 mt-8">
                    <DevMessageDialog />
                    <BugReportDialog />
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12 md:py-16">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
              </div>
            ) : (
              <div className="animate-fade-in">
                <PlanGrid
                  plans={filteredPlans}
                  onCompare={onCompare}
                  comparedPlans={comparedPlans}
                  estimatedUse={estimatedUse}
                />
              </div>
            )}
          </div>

          <ComparisonBar
            plans={comparedPlans}
            onRemove={onCompare}
          />
        </div>
      )}
    </div>
  );
}