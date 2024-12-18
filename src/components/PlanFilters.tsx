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
            <SelectValue defaultValue="all">All Contract Lengths</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Contract Lengths</SelectItem>
            <SelectItem value="0-6">0-6 Months</SelectItem>
            <SelectItem value="6-12">6-12 Months</SelectItem>
            <SelectItem value="12-24">12-24 Months</SelectItem>
            <SelectItem value="24+">24+ Months</SelectItem>
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
        <label className="text-sm font-medium">Time of Use Plans</label>
        <Select value={currentTimeOfUse || "all"} onValueChange={onTimeOfUseChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">Show All Plans</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All Plans</SelectItem>
            <SelectItem value="tou-only">Show Only Time of Use Plans</SelectItem>
            <SelectItem value="no-tou">Do Not Show Time of Use Plans</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Pricing and Billing</label>
        <Select value={currentMinUsage || "all"} onValueChange={onMinUsageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">Show All Plans</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All Plans</SelectItem>
            <SelectItem value="no-minimum">No Minimum Usage Fee/Credit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Renewable Energy</label>
        <Select value={currentRenewable || "all"} onValueChange={onRenewableChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue defaultValue="all">All Renewable Levels</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Renewable Levels</SelectItem>
            <SelectItem value="0-25">0-25%</SelectItem>
            <SelectItem value="25-50">25-50%</SelectItem>
            <SelectItem value="50-75">50-75%</SelectItem>
            <SelectItem value="75-99">75-99%</SelectItem>
            <SelectItem value="100">100%</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}