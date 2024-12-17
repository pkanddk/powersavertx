import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@/lib/api";

interface PlanFiltersProps {
  onSortChange: (value: string) => void;
  onContractLengthChange: (value: string) => void;
  onPlanTypeChange: (value: string) => void;
  onPrepaidChange: (value: string) => void;
  onTimeOfUseChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  currentSort: string;
  currentContractLength: string;
  currentPlanType: string;
  currentPrepaid: string;
  currentTimeOfUse: string;
  currentCompany: string;
  plans?: Plan[];
}

export function PlanFilters({
  onSortChange,
  onContractLengthChange,
  onPlanTypeChange,
  onPrepaidChange,
  onTimeOfUseChange,
  onCompanyChange,
  currentSort,
  currentContractLength,
  currentPlanType,
  currentPrepaid,
  currentTimeOfUse,
  currentCompany,
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
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Price: Low to High" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Contract Length</label>
        <Select value={currentContractLength} onValueChange={onContractLengthChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Show All" />
          </SelectTrigger>
          <SelectContent>
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
        <Select value={currentPlanType} onValueChange={onPlanTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Plan Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plan Types</SelectItem>
            <SelectItem value="fixed">Fixed Rate Only</SelectItem>
            <SelectItem value="variable">Variable Rate Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Company</label>
        <Select value={currentCompany} onValueChange={onCompanyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Companies" />
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
        <Select value={currentPrepaid} onValueChange={onPrepaidChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Show All" />
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
        <Select value={currentTimeOfUse} onValueChange={onTimeOfUseChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Show All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All</SelectItem>
            <SelectItem value="tou-only">Time of Use Only</SelectItem>
            <SelectItem value="no-tou">No Time of Use</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}