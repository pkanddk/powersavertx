import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plan } from "@/lib/api";

interface CompanyFilterProps {
  value: string;
  onChange: (value: string) => void;
  plans: Plan[];
}

export function CompanyFilter({ value, onChange, plans }: CompanyFilterProps) {
  const companies = Array.from(new Set(plans.map(plan => plan.company_id))).map(id => {
    const plan = plans.find(p => p.company_id === id);
    return {
      id: plan?.company_id || '',
      name: plan?.company_name || ''
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const getCompanyLabel = (value: string) => {
    if (value === "all") return "All Companies";
    const company = companies.find(c => c.id === value);
    return company ? company.name : "All Companies";
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Company</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getCompanyLabel(value)}</SelectValue>
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
  );
}