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
    <div className="min-h-screen bg-gradient-to-br from-[#1A1F2C] via-[#7E69AB] to-[#9b87f5] overflow-hidden relative">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-yellow-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto min-h-screen grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-6 relative z-10">
        {/* Left Column */}
        <div className="space-y-10">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              Smart Energy
              <span className="block bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Better Prices
              </span>
            </h1>
            <p className="text-xl text-gray-200 max-w-xl">
              Compare electricity rates and find the perfect plan for your home
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full max-w-2xl backdrop-blur-lg bg-white/10 p-8 rounded-2xl border border-white/20">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-4">
            <div className="px-6 py-4 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20">
              <p className="text-lg text-white font-medium">No Signup Required</p>
            </div>
            <div className="px-6 py-4 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20">
              <p className="text-lg text-white font-medium">Real-Time Rates</p>
            </div>
            <div className="px-6 py-4 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20">
              <p className="text-lg text-white font-medium">Trusted Providers</p>
            </div>
          </div>
        </div>

        {/* Right Column - Abstract Design */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-2xl aspect-square rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 p-8 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl"></div>
            <img 
              src="/lovable-uploads/97e1372f-e6d7-45fb-81e8-8dea9fe98544.png" 
              alt="Abstract Energy Design"
              className="w-full h-full object-cover rounded-2xl opacity-60"
            />
          </div>
        </div>
      </div>
    </div>
  );
}