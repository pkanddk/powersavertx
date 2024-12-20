import { Plan } from "@/lib/api";
import { FilterSelect } from "./filters/FilterSelect";
import { MobileFiltersDialog } from "./filters/MobileFiltersDialog";

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
  const companies = Array.from(new Set(props.plans?.map(plan => plan.company_id))).map(id => {
    const plan = props.plans?.find(p => p.company_id === id);
    return {
      id: plan?.company_id || '',
      name: plan?.company_name || ''
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const handleCancellationFeeChange = (value: string) => {
    switch (value) {
      case "under-50":
        props.onCancellationFeeChange([0, 49]);
        break;
      case "50-100":
        props.onCancellationFeeChange([50, 100]);
        break;
      case "100-200":
        props.onCancellationFeeChange([100, 200]);
        break;
      case "over-200":
        props.onCancellationFeeChange([201, 99999]);
        break;
      default:
        props.onCancellationFeeChange([0, 99999]);
    }
  };

  const getCurrentCancellationFeeValue = () => {
    const [min, max] = props.currentCancellationFee;
    if (min === 0 && max === 49) return "under-50";
    if (min === 50 && max === 100) return "50-100";
    if (min === 100 && max === 200) return "100-200";
    if (min === 201) return "over-200";
    return "all";
  };

  return (
    <div className="mb-6">
      {/* Mobile Filters Dialog */}
      <div className="md:hidden">
        <MobileFiltersDialog {...props} />
      </div>

      {/* Desktop Filters */}
      <div className="hidden md:flex flex-wrap gap-4">
        <FilterSelect
          label="Sort by Price"
          value={props.currentSort}
          onValueChange={props.onSortChange}
          options={[
            { value: "price-asc", label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
          ]}
        />
        <FilterSelect
          label="Contract Length"
          value={props.currentContractLength}
          onValueChange={props.onContractLengthChange}
          options={[
            { value: "all", label: "All Lengths" },
            { value: "length-asc", label: "Length: Short to Long" },
            { value: "length-desc", label: "Length: Long to Short" },
            { value: "0-6", label: "0-6 Months" },
            { value: "7-12", label: "7-12 Months" },
            { value: "13+", label: "13+ Months" },
          ]}
        />
        <FilterSelect
          label="Plan Type"
          value={props.currentPlanType}
          onValueChange={props.onPlanTypeChange}
          options={[
            { value: "all", label: "All Plan Types" },
            { value: "fixed", label: "Fixed Rate Only" },
            { value: "variable", label: "Variable Rate Only" },
            { value: "indexed", label: "Indexed Rate Only" },
          ]}
        />
        <FilterSelect
          label="Company"
          value={props.currentCompany}
          onValueChange={props.onCompanyChange}
          options={[
            { value: "all", label: "All Companies" },
            ...companies.map(company => ({
              value: company.id,
              label: company.name,
            })),
          ]}
        />
        <FilterSelect
          label="Time of Use"
          value={props.currentTimeOfUse}
          onValueChange={props.onTimeOfUseChange}
          options={[
            { value: "all", label: "Show All" },
            { value: "tou-only", label: "Time of Use Only" },
            { value: "no-tou", label: "No Time of Use" },
          ]}
        />
        <FilterSelect
          label="Renewable Energy"
          value={props.currentRenewable}
          onValueChange={props.onRenewableChange}
          options={[
            { value: "all", label: "Show All" },
            { value: "100", label: "100% Renewable" },
            { value: "50", label: "50%+ Renewable" },
            { value: "25", label: "25%+ Renewable" },
            { value: "0-25", label: "0-25% Renewable" },
          ]}
        />
        <FilterSelect
          label="Cancellation Fee"
          value={getCurrentCancellationFeeValue()}
          onValueChange={handleCancellationFeeChange}
          options={[
            { value: "all", label: "All Fees" },
            { value: "under-50", label: "Under $50" },
            { value: "50-100", label: "$50 - $100" },
            { value: "100-200", label: "$100 - $200" },
            { value: "over-200", label: "Over $200" },
          ]}
        />
        <FilterSelect
          label="Prepaid Plans"
          value={props.currentPrepaid}
          onValueChange={props.onPrepaidChange}
          options={[
            { value: "all", label: "Show All" },
            { value: "prepaid-only", label: "Prepaid Only" },
            { value: "no-prepaid", label: "No Prepaid" },
          ]}
        />
      </div>
    </div>
  );
}