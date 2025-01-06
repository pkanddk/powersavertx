import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Shield, ArrowRight, Lightbulb } from "lucide-react";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-pink-200 leading-tight">
                Power Your Home Smarter
              </h1>
              <p className="text-xl md:text-2xl text-violet-200/80">
                Find the perfect energy plan that fits your lifestyle and budget
              </p>
            </div>

            {/* Search Section */}
            <div className="max-w-2xl mx-auto">
              <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20 shadow-2xl">
                <SearchForm onSearch={handleSearch} />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
              <div className="group hover:scale-105 transition-all duration-300">
                <div className="h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center space-y-4">
                  <div className="p-3 rounded-full bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                    <Sparkles className="h-8 w-8 text-violet-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Instant Comparison</h3>
                  <p className="text-violet-200/70 text-center">Compare rates from top providers in real-time</p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-all duration-300">
                <div className="h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center space-y-4">
                  <div className="p-3 rounded-full bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                    <Shield className="h-8 w-8 text-violet-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Verified Providers</h3>
                  <p className="text-violet-200/70 text-center">All providers are thoroughly vetted and verified</p>
                </div>
              </div>

              <div className="group hover:scale-105 transition-all duration-300">
                <div className="h-full backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center space-y-4">
                  <div className="p-3 rounded-full bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                    <Lightbulb className="h-8 w-8 text-violet-200" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Smart Savings</h3>
                  <p className="text-violet-200/70 text-center">Find the most cost-effective plan for your usage</p>
                </div>
              </div>
            </div>

            {/* Bottom Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <Badge className="px-6 py-3 text-base bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Zap className="w-5 h-5 mr-2" />
                <span>100+ Energy Providers</span>
              </Badge>
              <Badge className="px-6 py-3 text-base bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <ArrowRight className="w-5 h-5 mr-2" />
                <span>Updated Daily</span>
              </Badge>
              <Badge className="px-6 py-3 text-base bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                <Shield className="w-5 h-5 mr-2" />
                <span>Price Alerts</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}