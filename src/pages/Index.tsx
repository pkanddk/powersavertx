import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, ArrowRight } from "lucide-react";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-900 to-violet-950">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="w-full max-w-[1400px] mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-pink-200 leading-tight">
              Find Your Perfect <br />Energy Plan
            </h1>
            <p className="text-lg md:text-xl text-violet-200/80 max-w-xl">
              Compare rates instantly and save on your electricity bill
            </p>

            {/* Search Form */}
            <div className="backdrop-blur-lg bg-white/10 p-6 rounded-2xl border border-white/20">
              <SearchForm onSearch={handleSearch} />
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              <Badge variant="secondary" className="justify-center py-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Zap className="w-4 h-4 mr-1" />
                Real-Time Rates
              </Badge>
              <Badge variant="secondary" className="justify-center py-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Shield className="w-4 h-4 mr-1" />
                Trusted Providers
              </Badge>
              <Badge variant="secondary" className="justify-center py-2 bg-white/10 hover:bg-white/20 text-white border-white/30">
                <ArrowRight className="w-4 h-4 mr-1" />
                Easy Comparison
              </Badge>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="hidden lg:block relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 blur-3xl" />
            <div className="relative backdrop-blur-3xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="h-20 w-full rounded-xl bg-gradient-to-r from-violet-400/20 to-fuchsia-400/20 animate-pulse" />
                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-white/20" />
                  <div className="h-4 w-1/2 rounded bg-white/20" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 rounded-lg bg-white/10" />
                  <div className="h-24 rounded-lg bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}