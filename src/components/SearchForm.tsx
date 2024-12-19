import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFormProps {
  onSearch: (zipCode: string, estimatedUse: string) => void;
  isLoading?: boolean;
}

const USAGE_OPTIONS = [
  "500 kWh",
  "1,000 kWh",
  "2,000 kWh",
  "Any Range"
];

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [zipCode, setZipCode] = useState("");
  const [estimatedUse, setEstimatedUse] = useState(USAGE_OPTIONS[0]); // Default to 500 kWh

  // Effect to trigger search when values change
  useEffect(() => {
    if (zipCode.length === 5) {  // Only search when ZIP code is complete
      const usageValue = estimatedUse === USAGE_OPTIONS[3] ? "any" :
                        estimatedUse.split(" ")[0].replace(",", "");
      console.log("[SearchForm] Triggering search with:", { zipCode, usageValue });
      onSearch(zipCode, usageValue);
    }
  }, [zipCode, estimatedUse, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Extract just the number from the usage string
    const usageValue = estimatedUse === USAGE_OPTIONS[3] ? "any" :
                      estimatedUse.split(" ")[0].replace(",", "");
    console.log("[SearchForm] Manual submit with:", { zipCode, usageValue });
    onSearch(zipCode, usageValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:gap-4 max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Enter ZIP Code"
        value={zipCode}
        onChange={(e) => {
          console.log("[SearchForm] ZIP code changed:", e.target.value);
          setZipCode(e.target.value);
        }}
        className="md:flex-1"
        pattern="[0-9]{5}"
        maxLength={5}
        required
      />
      <Select 
        value={estimatedUse} 
        onValueChange={(value) => {
          console.log("[SearchForm] Usage changed:", value);
          setEstimatedUse(value);
        }}
      >
        <SelectTrigger className="md:w-64">
          <SelectValue placeholder="Estimated Usage" />
        </SelectTrigger>
        <SelectContent>
          {USAGE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Searching..." : "Search Plans"}
      </Button>
    </form>
  );
}