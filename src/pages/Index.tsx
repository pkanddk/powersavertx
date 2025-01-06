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
    <div className="min-h-screen bg-white">
      <div className="absolute top-4 right-4">
        <AuthMenu />
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Find Your Perfect Energy Plan
            </h1>
            <p className="text-muted-foreground">
              Compare electricity rates and plans from top providers in your area
            </p>
          </div>

          <SearchForm onSearch={handleSearch} />

          <div className="flex flex-wrap justify-center gap-2">
            <Badge className="bg-primary/5 text-primary hover:bg-primary/10">
              No Signup Required
            </Badge>
            <Badge className="bg-primary/5 text-primary hover:bg-primary/10">
              Real-Time Rates
            </Badge>
            <Badge className="bg-primary/5 text-primary hover:bg-primary/10">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}