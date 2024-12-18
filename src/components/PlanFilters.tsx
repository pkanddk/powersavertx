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

  const getSortLabel = (value: string) => {
    switch (value) {
      case "price-asc": return "Price: Low to High";
      case "price-desc": return "Price: High to Low";
      default: return "Price: Low to High";
    }
  };

  const getContractLengthLabel = (value: string) => {
    switch (value) {
      case "all": return "All Contract Lengths";
      case "0-6": return "0-6 Months";
      case "6-12": return "6-12 Months";
      case "12-24": return "12-24 Months";
      case "24+": return "24+ Months";
      default: return "All Contract Lengths";
    }
  };

  const getPlanTypeLabel = (value: string) => {
    switch (value) {
      case "all": return "All Plan Types";
      case "fixed": return "Fixed Rate Only";
      case "variable": return "Variable Rate Only";
      default: return "All Plan Types";
    }
  };

  const getTimeOfUseLabel = (value: string) => {
    switch (value) {
      case "all": return "Show All Plans";
      case "tou-only": return "Time of Use Plans Only";
      case "no-tou": return "No Time of Use Plans";
      default: return "Show All Plans";
    }
  };

  const getCompanyLabel = (value: string) => {
    if (value === "all") return "All Companies";
    const company = companies.find(c => c.id === value);
    return company ? company.name : "All Companies";
  };

  const getMinUsageLabel = (value: string) => {
    switch (value) {
      case "all": return "Show All Plans";
      case "no-minimum": return "No Minimum Usage Fee/Credit";
      default: return "Show All Plans";
    }
  };

  const getRenewableLabel = (value: string) => {
    switch (value) {
      case "all": return "All Renewable Levels";
      case "0-25": return "0-25% Renewable";
      case "25-50": return "25-50% Renewable";
      case "50-75": return "50-75% Renewable";
      case "75-99": return "75-99% Renewable";
      case "100": return "100% Renewable";
      default: return "All Renewable Levels";
    }
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Sort by Price</label>
        <Select value={currentSort} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getSortLabel(currentSort)}</SelectValue>
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
            <SelectValue>{getContractLengthLabel(currentContractLength)}</SelectValue>
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
        <Select value={currentPlanType} onValueChange={onPlanTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getPlanTypeLabel(currentPlanType)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Plan Types</SelectItem>
            <SelectItem value="fixed">Fixed Rate Only</SelectItem>
            <SelectItem value="variable">Variable Rate Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Time of Use Plans</label>
        <Select value={currentTimeOfUse} onValueChange={onTimeOfUseChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getTimeOfUseLabel(currentTimeOfUse)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All Plans</SelectItem>
            <SelectItem value="tou-only">Time of Use Plans Only</SelectItem>
            <SelectItem value="no-tou">Do Not Show Time of Use Plans</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Company</label>
        <Select value={currentCompany} onValueChange={onCompanyChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getCompanyLabel(currentCompany)}</SelectValue>
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
        <label className="text-sm font-medium">Pricing and Billing</label>
        <Select value={currentMinUsage} onValueChange={onMinUsageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getMinUsageLabel(currentMinUsage)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Show All Plans</SelectItem>
            <SelectItem value="no-minimum">No Minimum Usage Fee/Credit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Renewable Energy</label>
        <Select value={currentRenewable} onValueChange={onRenewableChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getRenewableLabel(currentRenewable)}</SelectValue>
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