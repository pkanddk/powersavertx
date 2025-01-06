import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="bg-gradient-to-b from-primary/5 to-background">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Compare & Save Today</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Find Your Perfect{" "}
              <span className="text-primary">Energy Plan</span>
            </h1>
            
            <p className="text-xl text-muted-foreground">
              Compare electricity rates and plans from top providers in your area. Save money on your energy bills today.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="px-3 py-1">
                No Signup Required
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Real-Time Rates
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Trusted Providers
              </Badge>
            </div>
          </div>

          {/* Right Column - Search Form */}
          <div className="lg:ml-auto w-full max-w-md">
            <div className="bg-card rounded-xl border shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Get Started
              </h2>
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}