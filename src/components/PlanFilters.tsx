import { Plan } from "@/lib/api";
import { FilterSelect } from "./filters/FilterSelect";
import { MobileFiltersDialog } from "./filters/MobileFiltersDialog";
import { 
  sortOptions, 
  contractLengthOptions, 
  planTypeOptions,
  prepaidOptions,
  timeOfUseOptions,
  renewableOptions,
  cancellationFeeOptions 
} from "./filters/filterOptions";
import { handleCancellationFeeChange, getCurrentCancellationFeeValue } from "./filters/utils/cancellationFeeUtils";
import { getCompanyOptions } from "./filters/CompanyOptions";

interface PlanFiltersProps {
  onSortChange: (value: string) => void;
  onContractLengthChange: (value: string) => void;
  onPlanTypeChange: (value: string) => void;
  onPrepaidChange: (value: string) => void;
  onTimeOfUseChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onRenewableChange: (value: string) => void;
  onCancellationFeeChange: (value: [number, number]) => void;
  currentSort: string;
  currentContractLength: string;
  currentPlanType: string;
  currentPrepaid: string;
  currentTimeOfUse: string;
  currentCompany: string;
  currentRenewable: string;
  currentCancellationFee: [number, number];
  plans?: Plan[];
}

export function PlanFilters(props: PlanFiltersProps) {
  const companyOptions = getCompanyOptions(props.plans);

  return (
    <div className="mb-6">
      {/* Mobile Filters Dialog */}
      <div className="md:hidden">
        <MobileFiltersDialog {...props} />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:grid grid-cols-4 gap-4">
        <FilterSelect
          label="Sort by Price"
          value={props.currentSort}
          onValueChange={props.onSortChange}
          options={sortOptions}
        />
        <FilterSelect
          label="Contract Length"
          value={props.currentContractLength}
          onValueChange={props.onContractLengthChange}
          options={contractLengthOptions}
        />
        <FilterSelect
          label="Plan Type"
          value={props.currentPlanType}
          onValueChange={props.onPlanTypeChange}
          options={planTypeOptions}
        />
        <FilterSelect
          label="Company"
          value={props.currentCompany}
          onValueChange={props.onCompanyChange}
          options={companyOptions}
        />
        <FilterSelect
          label="Prepaid Plans"
          value={props.currentPrepaid}
          onValueChange={props.onPrepaidChange}
          options={prepaidOptions}
        />
        <FilterSelect
          label="Time of Use"
          value={props.currentTimeOfUse}
          onValueChange={props.onTimeOfUseChange}
          options={timeOfUseOptions}
        />
        <FilterSelect
          label="Renewable Energy"
          value={props.currentRenewable}
          onValueChange={props.onRenewableChange}
          options={renewableOptions}
        />
        <FilterSelect
          label="Cancellation Fee"
          value={getCurrentCancellationFeeValue(props.currentCancellationFee)}
          onValueChange={(value) => props.onCancellationFeeChange(handleCancellationFeeChange(value))}
          options={cancellationFeeOptions}
        />
      </div>
    </div>
  );
}