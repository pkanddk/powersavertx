import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SortFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortFilter({ value, onChange }: SortFilterProps) {
  const getSortLabel = (value: string) => {
    switch (value) {
      case "price-asc": return "Price: Low to High";
      case "price-desc": return "Price: High to Low";
      default: return "Price: Low to High";
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Sort by Price</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue>{getSortLabel(value)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}