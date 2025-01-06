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
    <main className="container mx-auto px-4 py-8">
      {/* Auth Menu */}
      <div className="absolute top-4 right-4 z-50">
        <AuthMenu />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form */}
          <div className="w-full max-w-2xl mx-auto mt-8">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Badge variant="secondary" className="py-1.5 px-4">
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="py-1.5 px-4">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="py-1.5 px-4">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </main>
  );
}