import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, Shield, ArrowRight } from "lucide-react";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-violet-800 to-violet-900">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative px-6 isolate overflow-hidden">
        {/* Gradient blob */}
        <div className="absolute inset-x-0 -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-400 to-violet-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>

        <div className="mx-auto max-w-4xl pt-32 sm:pt-48 lg:pt-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Find Your Perfect Energy Plan
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Compare electricity rates and plans from top providers in your area
            </p>
            
            <div className="mt-10 p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <SearchForm onSearch={handleSearch} />
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="p-3 rounded-full bg-violet-500/20">
                  <Lightbulb className="h-6 w-6 text-violet-200" />
                </div>
                <span className="text-white font-medium">No Signup Required</span>
              </div>
              
              <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="p-3 rounded-full bg-violet-500/20">
                  <Zap className="h-6 w-6 text-violet-200" />
                </div>
                <span className="text-white font-medium">Real-Time Rates</span>
              </div>
              
              <div className="flex flex-col items-center space-y-3 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="p-3 rounded-full bg-violet-500/20">
                  <Shield className="h-6 w-6 text-violet-200" />
                </div>
                <span className="text-white font-medium">Trusted Providers</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 pb-12">
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
              <span>100+ Energy Providers</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Badge>
            <Badge className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
              <span>Updated Daily</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Badge>
            <Badge className="px-4 py-2 text-sm bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-sm">
              <span>Price Alerts</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Badge>
          </div>
        </div>

        {/* Bottom gradient blob */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-violet-400 to-violet-300 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]" />
        </div>
      </div>
    </div>
  );
}