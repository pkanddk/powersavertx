import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    try {
      console.log("[Index] Handling search:", { zipCode, estimatedUse });
      onSearch(zipCode, estimatedUse);
      navigate("/pricing");
    } catch (error) {
      console.error("[Index] Error in handleSearch:", error);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
      {/* Hero Image Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/lovable-uploads/a4379cad-194e-455b-abe8-bfe06c3cdf2a.png')",
          backgroundPosition: "center 65%"
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8 px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Power Saver TX
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Compare and save on your electricity bill. Simple savings.
            </p>
          </div>
          <p className="text-lg text-white/80">
            Find and compare the best electricity plans in Texas
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="text-sm bg-white/20 backdrop-blur-sm text-white border-white/30">
            100+ Plans Available
          </Badge>
          <Badge variant="secondary" className="text-sm bg-white/20 backdrop-blur-sm text-white border-white/30">
            Real-Time Rates
          </Badge>
          <Badge variant="secondary" className="text-sm bg-white/20 backdrop-blur-sm text-white border-white/30">
            Price Alerts
          </Badge>
        </div>

        <div className="w-full max-w-xl mx-auto glass-effect rounded-2xl p-4 md:p-6">
          <SearchForm onSearch={handleSearch} />
        </div>

        <div className="text-sm text-white/80">
          Enter your ZIP code to see available plans in your area
        </div>
      </div>
    </div>
  );
}