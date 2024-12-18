import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MinUsageFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function MinUsageFilter({ value, onChange }: MinUsageFilterProps) {
  const getMinUsageLabel = (value: string) => {
    switch (value) {
      case "all": return "Show All Plans";
      case "no-minimum": return "No Minimum Usage Fee/Credit";
      default: return "Show All Plans";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Pricing and Billing</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getMinUsageLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Show All Plans</SelectItem>
          <SelectItem value="no-minimum">No Minimum Usage Fee/Credit</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}