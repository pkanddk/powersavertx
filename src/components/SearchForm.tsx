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
  const [estimatedUse, setEstimatedUse] = useState(USAGE_OPTIONS[0]);

  useEffect(() => {
    if (zipCode.length === 5) {
      try {
        const usageValue = estimatedUse === USAGE_OPTIONS[3] ? "any" :
                          estimatedUse.split(" ")[0].replace(",", "");
        console.log("[SearchForm] Triggering search with:", { zipCode, usageValue });
        onSearch(zipCode, usageValue);
      } catch (error) {
        console.error("[SearchForm] Error in search:", error);
      }
    }
  }, [zipCode, estimatedUse, onSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const usageValue = estimatedUse === USAGE_OPTIONS[3] ? "any" :
                        estimatedUse.split(" ")[0].replace(",", "");
      console.log("[SearchForm] Manual submit with:", { zipCode, usageValue });
      onSearch(zipCode, usageValue);
    } catch (error) {
      console.error("[SearchForm] Error in manual submit:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
      <Input
        type="text"
        placeholder="Enter ZIP Code"
        value={zipCode}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 5);
          console.log("[SearchForm] ZIP code changed:", value);
          setZipCode(value);
        }}
        className="w-full md:w-auto md:flex-1"
        pattern="[0-9]{5}"
        maxLength={5}
        required
      />
      <div className="flex w-full md:w-auto gap-2">
        <Select 
          value={estimatedUse} 
          onValueChange={(value) => {
            console.log("[SearchForm] Usage changed:", value);
            setEstimatedUse(value);
          }}
        >
          <SelectTrigger className="w-full md:w-[140px]">
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
        <Button type="submit" disabled={isLoading || zipCode.length !== 5} className="bg-primary hover:bg-primary/90">
          {isLoading ? "Searching..." : "Search Plans"}
        </Button>
      </div>
    </form>
  );
}