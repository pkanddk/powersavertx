import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";
import { AuthMenu } from "@/components/auth/AuthMenu";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-white">
      <div className="absolute top-4 right-4 z-10">
        <AuthMenu />
      </div>

      <div className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-lg mx-auto text-center py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mb-6">
            Compare electricity rates and plans from top providers in your area
          </p>
          
          <div className="mb-4">
            <SearchForm onSearch={handleSearch} />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}