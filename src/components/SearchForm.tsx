import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [zipCode, setZipCode] = useState("");
  const [estimatedUse, setEstimatedUse] = useState("1000");
  const { toast } = useToast();

  useEffect(() => {
    const zipFromUrl = searchParams.get("zip");
    if (zipFromUrl) {
      console.log("[SearchForm] Setting ZIP from URL:", zipFromUrl);
      setZipCode(zipFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("[SearchForm] Submitting search:", { zipCode, estimatedUse });
      
      if (!zipCode || zipCode.length !== 5) {
        toast({
          variant: "destructive",
          title: "Invalid ZIP Code",
          description: "Please enter a valid 5-digit ZIP code",
        });
        return;
      }

      onSearch(zipCode, estimatedUse);
    } catch (error) {
      console.error("[SearchForm] Error in handleSubmit:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while searching. Please try again.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 pt-2">
      <Input
        type="text"
        placeholder="Enter ZIP Code"
        value={zipCode}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, "").slice(0, 5);
          console.log("[SearchForm] ZIP code changed:", value);
          setZipCode(value);
        }}
        className="h-10 text-base bg-white/90 backdrop-blur-sm border-0 rounded-lg shadow-md"
        pattern="[0-9]{5}"
        maxLength={5}
        required
      />
      <Select
        value={estimatedUse}
        onValueChange={(value) => {
          console.log("[SearchForm] Estimated use changed:", value);
          setEstimatedUse(value);
        }}
      >
        <SelectTrigger className="h-10 text-base bg-white/90 backdrop-blur-sm border-0 rounded-lg shadow-md w-[140px]">
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
        className="h-10 text-base bg-white text-teal-700 hover:bg-white/90 rounded-lg shadow-md px-6"
      >
        {isLoading ? "Searching..." : "Search Plans"}
      </Button>
    </form>
  );
}