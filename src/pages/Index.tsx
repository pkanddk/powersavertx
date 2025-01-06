import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { AuthMenu } from "@/components/auth/AuthMenu";
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-violet-50 to-white">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Find Your Perfect Energy Plan
            </h1>
            <p className="text-xl text-muted-foreground">
              Compare electricity rates and plans from top providers in your area
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            <div className="bg-violet-50 p-6 rounded-lg">
              <SearchForm onSearch={handleSearch} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-center space-x-2">
                <Lightbulb className="h-4 w-4 text-violet-500" />
                <span>No Signup Required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-4 w-4 text-violet-500" />
                <span>Real-Time Rates</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-4 w-4 text-violet-500" />
                <span>Trusted Providers</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-0">
              100+ Energy Providers
            </Badge>
            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-0">
              Updated Daily
            </Badge>
            <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-200 border-0">
              Price Alerts
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}