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
import { Search } from "lucide-react";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter ZIP Code"
            value={zipCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 5);
              console.log("[SearchForm] ZIP code changed:", value);
              setZipCode(value);
            }}
            className="h-16 text-xl bg-white/10 backdrop-blur-md border-white/20 text-white placeholder:text-gray-300 focus:ring-2 focus:ring-purple-400"
            maxLength={5}
            required
          />
        </div>
        
        <Select
          value={estimatedUse}
          onValueChange={(value) => {
            console.log("[SearchForm] Estimated use changed:", value);
            setEstimatedUse(value);
          }}
        >
          <SelectTrigger className="h-16 min-w-[180px] bg-white/10 backdrop-blur-md border-white/20 text-white">
            <SelectValue placeholder="Select usage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="500">500 kWh</SelectItem>
            <SelectItem value="1000">1000 kWh</SelectItem>
            <SelectItem value="2000">2000 kWh</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        disabled={isLoading}
        className="h-16 text-lg bg-gradient-to-r from-purple-400 to-pink-400 hover:from-purple-500 hover:to-pink-500 text-white border-0"
      >
        <Search className="h-6 w-6 mr-2" />
        {isLoading ? "Searching..." : "Search Rates"}
      </Button>
    </form>
  );
}