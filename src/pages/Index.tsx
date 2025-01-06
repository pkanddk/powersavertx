import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lightbulb, Zap, Shield } from "lucide-react";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="fixed inset-0 bg-gray-500 flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Card className="shadow-lg bg-transparent backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Find Your Perfect Energy Plan
            </h1>
            <p className="text-xl text-gray-100">
              Compare electricity rates and plans from top providers in your area
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <SearchForm onSearch={handleSearch} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center space-x-2 text-white">
                <Lightbulb className="h-4 w-4 text-white" />
                <span>No Signup Required</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white">
                <Zap className="h-4 w-4 text-white" />
                <span>Real-Time Rates</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-white">
                <Shield className="h-4 w-4 text-white" />
                <span>Trusted Providers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-white/10 text-white hover:bg-white/20 border-0">
              100+ Energy Providers
            </Badge>
            <Badge className="bg-white/10 text-white hover:bg-white/20 border-0">
              Updated Daily
            </Badge>
            <Badge className="bg-white/10 text-white hover:bg-white/20 border-0">
              Price Alerts
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}