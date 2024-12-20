import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFormProps {
  onSearch: (zipCode: string, estimatedUse: string) => void;
  isLoading?: boolean;
}

export function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [zipCode, setZipCode] = useState("");
  const [estimatedUse, setEstimatedUse] = useState("500");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("[SearchForm] Submitting search:", { zipCode, estimatedUse });
      onSearch(zipCode, estimatedUse);
    } catch (error) {
      console.error("[SearchForm] Error in handleSubmit:", error);
    }
  };

  const handleEstimatedUseChange = (value: string) => {
    try {
      console.log("[SearchForm] Estimated use changed:", value);
      setEstimatedUse(value);
    } catch (error) {
      console.error("[SearchForm] Error in handleEstimatedUseChange:", error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto py-2">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center justify-center gap-4 md:space-x-4 px-4 md:px-0">
        <Input
          type="text"
          placeholder="Enter ZIP Code"
          value={zipCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 5);
            console.log("[SearchForm] ZIP code changed:", value);
            setZipCode(value);
          }}
          className="w-full md:w-[180px] h-10"
          pattern="[0-9]{5}"
          maxLength={5}
          required
        />
        <Select
          value={estimatedUse}
          onValueChange={handleEstimatedUseChange}
        >
          <SelectTrigger className="w-full md:w-[140px] h-10">
            <SelectValue placeholder="Select usage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500">500 kWh</SelectItem>
            <SelectItem value="1000">1000 kWh</SelectItem>
            <SelectItem value="2000">2000 kWh</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full md:w-[140px] h-10 bg-primary hover:bg-primary/90"
        >
          {isLoading ? "Searching..." : "Search Plans"}
        </Button>
      </form>
    </div>
  );
}