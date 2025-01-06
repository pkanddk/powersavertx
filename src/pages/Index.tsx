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
    <div className="relative min-h-screen">
      {/* Auth Menu */}
      <div className="absolute top-4 right-4 z-50">
        <AuthMenu />
      </div>

      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/lovable-uploads/f5d9d82f-2512-4bcd-96fe-aeca04160865.png')",
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative h-screen flex flex-col items-center justify-center max-w-4xl mx-auto px-4 -mt-20">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form */}
          <div className="w-full max-w-2xl mx-auto">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 py-1.5">
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 py-1.5">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="bg-white/10 text-white border-white/20 py-1.5">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}