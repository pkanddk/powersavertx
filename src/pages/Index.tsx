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
    <div className="min-h-screen bg-background">
      <header className="w-full border-b">
        <div className="container mx-auto px-4 py-4 flex justify-end">
          <AuthMenu />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Find Your Perfect Energy Plan
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            Compare electricity rates and plans from top providers in your area
          </p>

          <SearchForm onSearch={handleSearch} />

          <div className="flex flex-wrap gap-2 mt-6">
            <Badge variant="secondary">No Signup Required</Badge>
            <Badge variant="secondary">Real-Time Rates</Badge>
            <Badge variant="secondary">Trusted Providers</Badge>
          </div>
        </div>
      </main>
    </div>
  );
}