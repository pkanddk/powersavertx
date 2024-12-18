import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeOfUseFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimeOfUseFilter({ value, onChange }: TimeOfUseFilterProps) {
  const getTimeOfUseLabel = (value: string) => {
    switch (value) {
      case "all": return "Show All Plans";
      case "tou-only": return "Time of Use Plans Only";
      case "no-tou": return "No Time of Use Plans";
      default: return "Show All Plans";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Time of Use Plans</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getTimeOfUseLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Show All Plans</SelectItem>
          <SelectItem value="tou-only">Time of Use Plans Only</SelectItem>
          <SelectItem value="no-tou">Do Not Show Time of Use Plans</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}