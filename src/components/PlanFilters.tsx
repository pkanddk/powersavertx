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
  // Get unique companies from plans
  const companies = Array.from(new Set(plans.map(plan => ({
    id: plan.company_id,
    name: plan.company_name
  })))).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="length-asc">Contract Length: Short to Long</SelectItem>
          <SelectItem value="length-desc">Contract Length: Long to Short</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentPlanType} onValueChange={onPlanTypeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Plan Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Plan Types</SelectItem>
          <SelectItem value="fixed">Fixed Rate Only</SelectItem>
          <SelectItem value="variable">Variable Rate Only</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentContractLength} onValueChange={onContractLengthChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Contract Length" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Lengths</SelectItem>
          <SelectItem value="0-6">0-6 Months</SelectItem>
          <SelectItem value="7-12">7-12 Months</SelectItem>
          <SelectItem value="13+">13+ Months</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentCompany} onValueChange={onCompanyChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Company" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Companies</SelectItem>
          {companies.map(company => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={currentPrepaid} onValueChange={onPrepaidChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Prepaid Plans" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Show All</SelectItem>
          <SelectItem value="prepaid-only">Prepaid Only</SelectItem>
          <SelectItem value="no-prepaid">No Prepaid</SelectItem>
        </SelectContent>
      </Select>

      <Select value={currentTimeOfUse} onValueChange={onTimeOfUseChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Time of Use" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Show All</SelectItem>
          <SelectItem value="tou-only">Time of Use Only</SelectItem>
          <SelectItem value="no-tou">No Time of Use</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}