import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchFormProps {
  onSearch: (zipCode: string, estimatedUse: string) => void;
  isLoading?: boolean;
}

const USAGE_OPTIONS = [
  "Any Range",
  "500 kWh",
  "1,000 kWh",
  "2,000 kWh"
];

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [zipCode, setZipCode] = useState("");
  const [estimatedUse, setEstimatedUse] = useState(USAGE_OPTIONS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert the formatted string back to the expected API format
    const usageValue = estimatedUse === "Any Range" ? estimatedUse :
                      estimatedUse === "500 kWh" ? "500" :
                      estimatedUse === "1,000 kWh" ? "1000" :
                      estimatedUse === "2,000 kWh" ? "2000" : estimatedUse;
    onSearch(zipCode, usageValue);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:flex md:gap-4 max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Enter ZIP Code"
        value={zipCode}
        onChange={(e) => setZipCode(e.target.value)}
        className="md:flex-1"
        pattern="[0-9]{5}"
        maxLength={5}
        required
      />
      <Select value={estimatedUse} onValueChange={setEstimatedUse}>
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