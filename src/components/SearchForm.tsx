import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Search, MapPin, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ZIP Code Input */}
      <div className="space-y-2">
        <Label htmlFor="zipCode" className="text-white">ZIP Code</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            id="zipCode"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="Enter ZIP Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ""))}
            className="pl-9 bg-white/90 border-transparent focus:border-primary focus:ring-primary"
          />
        </div>
      </div>

      {/* Monthly Usage Select */}
      <div className="space-y-2">
        <Label htmlFor="usage" className="text-white">Monthly Usage</Label>
        <div className="relative">
          <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
          <Select
            value={estimatedUse}
            onValueChange={setEstimatedUse}
          >
            <SelectTrigger 
              id="usage" 
              className="w-full pl-9 bg-white/90 border-transparent focus:ring-primary"
            >
              <SelectValue placeholder="Select usage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">500 kWh</SelectItem>
              <SelectItem value="1000">1000 kWh</SelectItem>
              <SelectItem value="2000">2000 kWh</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full bg-primary hover:bg-primary/90 text-white h-11 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
      >
        <Search className="w-4 h-4" />
        {isLoading ? "Searching..." : "Search Rates"}
      </button>
    </form>
  );
}