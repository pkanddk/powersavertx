import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilterSelect } from "./FilterSelect";
import { SlidersHorizontal } from "lucide-react";
import { Plan } from "@/lib/api";

interface MobileFiltersDialogProps {
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

export function MobileFiltersDialog({
  onSortChange,
  onContractLengthChange,
  onPlanTypeChange,
  onPrepaidChange,
  onTimeOfUseChange,
  onCompanyChange,
  onRenewableChange,
  onCancellationFeeChange,
  currentSort,
  currentContractLength,
  currentPlanType,
  currentPrepaid,
  currentTimeOfUse,
  currentCompany,
  currentRenewable,
  currentCancellationFee,
  plans = [],
}: MobileFiltersDialogProps) {
  const companies = Array.from(new Set(plans.map(plan => plan.company_id))).map(id => {
    const plan = plans.find(p => p.company_id === id);
    return {
      id: plan?.company_id || '',
      name: plan?.company_name || ''
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const handleCancellationFeeChange = (value: string) => {
    switch (value) {
      case "under-50":
        onCancellationFeeChange([0, 49]);
        break;
      case "50-100":
        onCancellationFeeChange([50, 100]);
        break;
      case "100-200":
        onCancellationFeeChange([100, 200]);
        break;
      case "over-200":
        onCancellationFeeChange([201, 99999]);
        break;
      default:
        onCancellationFeeChange([0, 99999]);
    }
  };

  const getCurrentCancellationFeeValue = () => {
    const [min, max] = currentCancellationFee;
    if (min === 0 && max === 49) return "under-50";
    if (min === 50 && max === 100) return "50-100";
    if (min === 100 && max === 200) return "100-200";
    if (min === 201) return "over-200";
    return "all";
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle>Filter Plans</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FilterSelect
            label="Sort by Price"
            value={currentSort}
            onValueChange={onSortChange}
            options={[
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
            ]}
          />
          <FilterSelect
            label="Contract Length"
            value={currentContractLength}
            onValueChange={onContractLengthChange}
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
            value={currentPlanType}
            onValueChange={onPlanTypeChange}
            options={[
              { value: "all", label: "All Plan Types" },
              { value: "fixed", label: "Fixed Rate Only" },
              { value: "variable", label: "Variable Rate Only" },
              { value: "indexed", label: "Indexed Rate Only" },
            ]}
          />
          <FilterSelect
            label="Company"
            value={currentCompany}
            onValueChange={onCompanyChange}
            options={[
              { value: "all", label: "All Companies" },
              ...companies.map(company => ({
                value: company.id,
                label: company.name,
              })),
            ]}
          />
          <FilterSelect
            label="Prepaid Plans"
            value={currentPrepaid}
            onValueChange={onPrepaidChange}
            options={[
              { value: "all", label: "Show All" },
              { value: "prepaid-only", label: "Prepaid Only" },
              { value: "no-prepaid", label: "No Prepaid" },
            ]}
          />
          <FilterSelect
            label="Time of Use"
            value={currentTimeOfUse}
            onValueChange={onTimeOfUseChange}
            options={[
              { value: "all", label: "Show All" },
              { value: "tou-only", label: "Time of Use Only" },
              { value: "no-tou", label: "No Time of Use" },
            ]}
          />
          <FilterSelect
            label="Renewable Energy"
            value={currentRenewable}
            onValueChange={onRenewableChange}
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
        </div>
      </DialogContent>
    </Dialog>
  );
}