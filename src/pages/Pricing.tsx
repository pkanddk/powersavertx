import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { PlanGrid } from "@/components/PlanGrid";
import { Plan } from "@/lib/api";
import { PlanFilters } from "@/components/PlanFilters";
import { ComparisonBar } from "@/components/plan/ComparisonBar";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileFiltersDialog } from "@/components/filters/MobileFiltersDialog";

interface PricingProps {
  onSearch: (zipCode: string, estimatedUse: string) => void;
  onCompare: (plan: Plan) => void;
  comparedPlans: Plan[];
  search: { zipCode: string; estimatedUse: string; } | null;
  estimatedUse: string;
}

export default function Pricing({ onSearch, onCompare, comparedPlans, search, estimatedUse }: PricingProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!search?.zipCode) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/plans?zip=${search.zipCode}`);
        if (!response.ok) throw new Error('Failed to fetch plans');
        const data = await response.json();
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, [search?.zipCode]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-white">
      <div className="relative min-h-[calc(100vh-4rem)]">
        {/* Hero Image Background */}
        <div 
          className="absolute inset-0 z-0"
          aria-label="Decorative hero image showing a pink house with wind turbine, representing clean energy and home power"
          role="img"
        >
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundImage: "url('/lovable-uploads/5e950f3a-e331-4c06-aa8f-d883b1d7795f.png')",
              backgroundSize: '100% auto',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-black/30" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Compare Energy Plans
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Find the best electricity rates and plans from top providers in your area
          </p>

          {/* Search Form */}
          <div className="w-full max-w-2xl mx-auto glass-effect rounded-xl p-6">
            <SearchForm onSearch={onSearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Plans Section */}
        {search && (
          <div className="relative z-10 bg-white py-8">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Filters */}
                {!isMobile && (
                  <aside className="w-full md:w-64 space-y-6">
                    <PlanFilters 
                      onSortChange={setCurrentSort}
                      onContractLengthChange={setCurrentContractLength}
                      onPlanTypeChange={setCurrentPlanType}
                      onPrepaidChange={setCurrentPrepaid}
                      onTimeOfUseChange={setCurrentTimeOfUse}
                      onCompanyChange={setCurrentCompany}
                      onRenewableChange={setCurrentRenewable}
                      onCancellationFeeChange={setCurrentCancellationFee}
                      currentSort={currentSort}
                      currentContractLength={currentContractLength}
                      currentPlanType={currentPlanType}
                      currentPrepaid={currentPrepaid}
                      currentTimeOfUse={currentTimeOfUse}
                      currentCompany={currentCompany}
                      currentRenewable={currentRenewable}
                      currentCancellationFee={currentCancellationFee}
                      plans={plans}
                    />
                  </aside>
                )}

                {/* Mobile Filters Dialog */}
                <MobileFiltersDialog
                  isOpen={showMobileFilters}
                  onClose={() => setShowMobileFilters(false)}
                  onSortChange={setCurrentSort}
                  onContractLengthChange={setCurrentContractLength}
                  onPlanTypeChange={setCurrentPlanType}
                  onPrepaidChange={setCurrentPrepaid}
                  onTimeOfUseChange={setCurrentTimeOfUse}
                  onCompanyChange={setCurrentCompany}
                  onRenewableChange={setCurrentRenewable}
                  onCancellationFeeChange={setCurrentCancellationFee}
                  currentSort={currentSort}
                  currentContractLength={currentContractLength}
                  currentPlanType={currentPlanType}
                  currentPrepaid={currentPrepaid}
                  currentTimeOfUse={currentTimeOfUse}
                  currentCompany={currentCompany}
                  currentRenewable={currentRenewable}
                  currentCancellationFee={currentCancellationFee}
                  plans={plans}
                />

                {/* Plans Grid */}
                <main className="flex-1">
                  <PlanGrid
                    plans={plans}
                    onCompare={onCompare}
                    comparedPlans={comparedPlans}
                    estimatedUse={estimatedUse}
                    isLoading={isLoading}
                  />
                </main>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comparison Bar */}
      {comparedPlans.length > 0 && (
        <ComparisonBar
          plans={comparedPlans}
          onRemove={onCompare}
          estimatedUse={estimatedUse}
        />
      )}
    </div>
  );
}