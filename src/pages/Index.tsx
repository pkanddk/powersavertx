import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl space-y-8 text-center">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-xl text-white/90">
            Compare electricity rates and plans from top providers in your area
          </p>
        </div>

        {/* Search Form */}
        <div className="w-full">
          <SearchForm onSearch={handleSearch} />
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-3">
          <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
            <p className="text-sm text-white">No Signup Required</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
            <p className="text-sm text-white">Real-Time Rates</p>
          </div>
          <div className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
            <p className="text-sm text-white">Trusted Providers</p>
          </div>
        </div>
      </div>
    </div>
  );
}