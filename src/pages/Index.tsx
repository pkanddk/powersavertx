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
    <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-500">
      <div className="w-full max-w-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-lg text-white/90 text-center mt-2">
            Compare electricity rates and plans from top providers in your area
          </p>
        </div>

        {/* Search Form */}
        <SearchForm onSearch={handleSearch} />

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <p className="text-sm text-white">No Signup Required</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <p className="text-sm text-white">Real-Time Rates</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <p className="text-sm text-white">Trusted Providers</p>
          </div>
        </div>
      </div>
    </div>
  );
}