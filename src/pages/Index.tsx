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
    <div className="relative min-h-screen">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/ec1624f2-53c7-4cc2-b436-6eee1782d81b.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Lighter gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/10" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-screen text-center pt-24 pb-32">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight">
            Find Your Perfect Energy Plan
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form Container - Removed backdrop blur */}
          <div className="w-full max-w-md mx-auto">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Feature Badges - Removed backdrop blur */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Badge variant="secondary" className="text-white border-white/20 bg-transparent">
              <Sparkles className="w-4 h-4 mr-2" />
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="text-white border-white/20 bg-transparent">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="text-white border-white/20 bg-transparent">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}