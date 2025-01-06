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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Main Content */}
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Smart Energy <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                Better Prices
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg">
              Compare electricity rates and find the perfect plan for your home
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full max-w-xl">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-4">
            <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
              <p className="text-white font-medium">No Signup Required</p>
            </div>
            <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
              <p className="text-white font-medium">Real-Time Rates</p>
            </div>
            <div className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20">
              <p className="text-white font-medium">Trusted Providers</p>
            </div>
          </div>
        </div>

        {/* Right Column - Abstract Design */}
        <div className="hidden md:flex items-center justify-center relative">
          <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="relative">
            <div className="w-full max-w-lg aspect-square rounded-2xl bg-gradient-to-r from-gray-900/50 to-purple-900/50 backdrop-blur-lg border border-white/10 p-8">
              <img 
                src="/lovable-uploads/4401e154-998f-4a3f-99d5-7bcf11361699.png" 
                alt="Abstract Design" 
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}