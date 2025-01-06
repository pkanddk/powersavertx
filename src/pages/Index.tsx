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
    <div className="relative min-h-screen bg-teal-600 flex items-center justify-center">
      {/* Auth Menu - Absolute positioned in top right */}
      <div className="absolute top-4 right-4">
        <AuthMenu />
      </div>

      {/* Main Content - Centered */}
      <div className="w-full max-w-2xl px-4 text-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Find Your Perfect Energy Plan
        </h1>
        <p className="text-xl text-white/90 mb-8">
          Compare electricity rates and plans from top providers in your area
        </p>
        
        <SearchForm onSearch={handleSearch} />
        
        <div className="flex justify-center gap-3 mt-6">
          <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">No Signup Required</Badge>
          <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">Real-Time Rates</Badge>
          <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 text-white">Trusted Providers</Badge>
        </div>
      </div>
    </div>
  );
}