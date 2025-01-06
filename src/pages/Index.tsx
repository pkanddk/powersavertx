import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="relative min-h-screen bg-[#E5F4F4]">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/9b3f98dd-a782-4449-9b3e-ff6601da67f8.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen text-center pt-16 pb-32">
          <h1 className="text-4xl md:text-6xl font-bold text-[#2D3648] mb-4 max-w-3xl mx-auto">
            Find Your Perfect Energy Plan
          </h1>
          
          <p className="text-lg md:text-xl text-[#4A5567] mb-12 max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form Container */}
          <div className="w-full max-w-md mx-auto bg-black/20 backdrop-blur-sm p-6 rounded-2xl">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge variant="secondary" className="bg-white/30 backdrop-blur-sm text-[#2D3648] border-transparent px-4 py-2">
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="bg-white/30 backdrop-blur-sm text-[#2D3648] border-transparent px-4 py-2">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="bg-white/30 backdrop-blur-sm text-[#2D3648] border-transparent px-4 py-2">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}