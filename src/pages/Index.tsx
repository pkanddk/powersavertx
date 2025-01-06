import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="relative min-h-screen bg-[#E5F4F6]">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sun and Power Lines */}
        <div className="absolute left-32 top-1/3 w-32 h-32 bg-[#FFB84C] rounded-full" />
        <div className="absolute left-24 top-1/3 space-y-6">
          <div className="w-1 h-16 bg-gray-400 transform rotate-12" />
          <div className="w-1 h-16 bg-gray-400 transform rotate-12" />
          <div className="w-1 h-16 bg-gray-400 transform rotate-12" />
        </div>

        {/* Clouds */}
        <div className="absolute left-1/4 top-24 w-24 h-8 bg-[#FFB1C8] rounded-full" />
        <div className="absolute right-1/4 top-32 w-32 h-10 bg-[#96DED1] rounded-full" />
        <div className="absolute right-48 top-16 w-20 h-6 bg-[#FFB1C8] rounded-full" />

        {/* Wind Turbine */}
        <div className="absolute right-48 top-48">
          <div className="w-4 h-48 bg-gray-200 rounded-t-full" />
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative w-32 h-32">
              <div className="absolute w-4 h-24 bg-gray-200 origin-bottom transform rotate-0 rounded-full" />
              <div className="absolute w-4 h-24 bg-gray-200 origin-bottom transform rotate-120 rounded-full" />
              <div className="absolute w-4 h-24 bg-gray-200 origin-bottom transform rotate-240 rounded-full" />
            </div>
          </div>
        </div>

        {/* Trees */}
        <div className="absolute right-32 bottom-32">
          <div className="w-8 h-16 bg-[#FFB1C8] rounded-full" />
        </div>
        <div className="absolute left-48 bottom-48">
          <div className="w-12 h-20 bg-[#96DED1] rounded-full" />
        </div>
      </div>

      {/* Search Container */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center min-h-screen max-w-md mx-auto">
          {/* Search Form */}
          <div className="w-full bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Find Your Perfect Energy Plan
            </h2>
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20">
              <Search className="w-4 h-4 mr-1" />
              No Signup Required
            </Badge>
            <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20">
              Real-Time Rates
            </Badge>
            <Badge className="bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}