import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RenewableFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function RenewableFilter({ value, onChange }: RenewableFilterProps) {
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
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Renewable Energy</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getRenewableLabel(value)}</SelectValue>
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
  );
}