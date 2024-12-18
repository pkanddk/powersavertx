import { Plan } from "@/lib/api";
import { SortFilter } from "./filters/SortFilter";
import { ContractLengthFilter } from "./filters/ContractLengthFilter";
import { PlanTypeFilter } from "./filters/PlanTypeFilter";
import { TimeOfUseFilter } from "./filters/TimeOfUseFilter";
import { CompanyFilter } from "./filters/CompanyFilter";
import { MinUsageFilter } from "./filters/MinUsageFilter";
import { RenewableFilter } from "./filters/RenewableFilter";

interface PlanFiltersProps {
  onSortChange: (value: string) => void;
  onContractLengthChange: (value: string) => void;
  onPlanTypeChange: (value: string) => void;
  onTimeOfUseChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onMinUsageChange: (value: string) => void;
  onRenewableChange: (value: string) => void;
  currentSort: string;
  currentContractLength: string;
  currentPlanType: string;
  currentTimeOfUse: string;
  currentCompany: string;
  currentMinUsage: string;
  currentRenewable: string;
  plans?: Plan[];
}

export function PlanFilters({
  onSortChange,
  onContractLengthChange,
  onPlanTypeChange,
  onTimeOfUseChange,
  onCompanyChange,
  onMinUsageChange,
  onRenewableChange,
  currentSort,
  currentContractLength,
  currentPlanType,
  currentTimeOfUse,
  currentCompany,
  currentMinUsage,
  currentRenewable,
  plans = [],
}: PlanFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <SortFilter 
        value={currentSort} 
        onChange={onSortChange} 
      />
      <ContractLengthFilter 
        value={currentContractLength} 
        onChange={onContractLengthChange} 
      />
      <PlanTypeFilter 
        value={currentPlanType} 
        onChange={onPlanTypeChange} 
      />
      <TimeOfUseFilter 
        value={currentTimeOfUse} 
        onChange={onTimeOfUseChange} 
      />
      <CompanyFilter 
        value={currentCompany} 
        onChange={onCompanyChange} 
        plans={plans}
      />
      <MinUsageFilter 
        value={currentMinUsage} 
        onChange={onMinUsageChange} 
      />
      <RenewableFilter 
        value={currentRenewable} 
        onChange={onRenewableChange} 
      />
    </div>
  );
}