import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { AuthMenu } from "@/components/auth/AuthMenu";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="relative min-h-[80vh] flex items-start justify-center">
      {/* Auth Menu */}
      <div className="absolute top-4 right-4 z-50">
        <AuthMenu />
      </div>

      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/7edcecd9-8dd1-48a1-9600-0ba09103a4ba.png')",
          height: "80vh" // Make hero more horizontal
        }}
      >
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Content Container - Moved higher up */}
      <div className="relative w-full max-w-4xl mx-auto px-4 pt-24">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form */}
          <div className="w-full max-w-2xl mx-auto mt-8">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/20 py-1.5 px-4">
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/20 py-1.5 px-4">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/20 py-1.5 px-4">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}