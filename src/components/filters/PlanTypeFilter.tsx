import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PlanTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function PlanTypeFilter({ value, onChange }: PlanTypeFilterProps) {
  const getPlanTypeLabel = (value: string) => {
    switch (value) {
      case "all": return "All Plan Types";
      case "fixed": return "Fixed Rate Only";
      case "variable": return "Variable Rate Only";
      default: return "All Plan Types";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Plan Type</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getPlanTypeLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Plan Types</SelectItem>
          <SelectItem value="fixed">Fixed Rate Only</SelectItem>
          <SelectItem value="variable">Variable Rate Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}