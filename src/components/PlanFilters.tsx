import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@/lib/api";
import { CancellationFeeSlider } from "./filters/CancellationFeeSlider";

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

export function PlanFilters({
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
}: PlanFiltersProps) {
  const companies = Array.from(new Set(plans.map(plan => plan.company_id))).map(id => {
    const plan = plans.find(p => p.company_id === id);
    return {
      id: plan?.company_id || '',
      name: plan?.company_name || ''
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Sort by Price</label>
        <Select value={currentSort || "price-asc"} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="price-asc">Price: Low to High</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Contract Length</label>
        <Select value={currentContractLength || "all"} onValueChange={onContractLengthChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">Show All</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Lengths</SelectItem>
            <SelectItem value="length-asc">Length: Short to Long</SelectItem>
            <SelectItem value="length-desc">Length: Long to Short</SelectItem>
            <SelectItem value="0-6">0-6 Months</SelectItem>
            <SelectItem value="7-12">7-12 Months</SelectItem>
            <SelectItem value="13+">13+ Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Plan Type</label>
        <Select value={currentPlanType || "all"} onValueChange={onPlanTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">All Plan Types</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plan Types</SelectItem>
            <SelectItem value="fixed">Fixed Rate Only</SelectItem>
            <SelectItem value="variable">Variable Rate Only</SelectItem>
            <SelectItem value="indexed">Indexed Rate Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Company</label>
        <Select value={currentCompany || "all"} onValueChange={onCompanyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">All Companies</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map(company => (
              <SelectItem key={`company-${company.id}`} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Prepaid Plans</label>
        <Select value={currentPrepaid || "all"} onValueChange={onPrepaidChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">Show All</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All</SelectItem>
            <SelectItem value="prepaid-only">Prepaid Only</SelectItem>
            <SelectItem value="no-prepaid">No Prepaid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Time of Use</label>
        <Select value={currentTimeOfUse || "all"} onValueChange={onTimeOfUseChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">Show All</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All</SelectItem>
            <SelectItem value="tou-only">Time of Use Only</SelectItem>
            <SelectItem value="no-tou">No Time of Use</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Renewable Energy</label>
        <Select value={currentRenewable || "all"} onValueChange={onRenewableChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">Show All</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All</SelectItem>
            <SelectItem value="100">100% Renewable</SelectItem>
            <SelectItem value="50">50%+ Renewable</SelectItem>
            <SelectItem value="25">25%+ Renewable</SelectItem>
            <SelectItem value="0-25">0-25% Renewable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CancellationFeeSlider
        plans={plans}
        onCancellationFeeChange={onCancellationFeeChange}
        currentCancellationFee={currentCancellationFee}
      />
    </div>
  );
}