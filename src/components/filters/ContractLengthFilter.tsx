import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContractLengthFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function ContractLengthFilter({ value, onChange }: ContractLengthFilterProps) {
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

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Contract Length</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getContractLengthLabel(value)}</SelectValue>
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
  );
}