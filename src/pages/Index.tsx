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
    <div className="h-screen flex flex-col">
      <div className="absolute top-4 right-4 z-10">
        <AuthMenu />
      </div>

      <main className="flex-1 flex items-center justify-center min-h-0">
        <div className="w-full max-w-xl px-4 py-6">
          <h1 className="text-4xl font-bold text-foreground text-center">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-lg text-muted-foreground mt-1 text-center">
            Compare electricity rates and plans from top providers in your area
          </p>
          
          <div className="mt-4 flex justify-center">
            <SearchForm onSearch={handleSearch} />
          </div>

          <div className="flex justify-center mt-3">
            <Badge variant="outline" className="mx-0.5">No Signup Required</Badge>
            <Badge variant="outline" className="mx-0.5">Real-Time Rates</Badge>
            <Badge variant="outline" className="mx-0.5">Trusted Providers</Badge>
          </div>
        </div>
      </main>
    </div>
  );
}