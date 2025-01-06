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
    <div className="w-full">
      <nav className="w-full border-b bg-white">
        <div className="w-full px-4 py-3 flex justify-end">
          <AuthMenu />
        </div>
      </nav>

      <div className="w-full px-4 py-6">
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-semibold mb-2">Find Your Perfect Energy Plan</h1>
          <p className="text-muted-foreground mb-6">Compare electricity rates and plans from top providers in your area</p>
          
          <SearchForm onSearch={handleSearch} />
          
          <div className="flex gap-2 mt-4">
            <Badge variant="secondary">No Signup Required</Badge>
            <Badge variant="secondary">Real-Time Rates</Badge>
            <Badge variant="secondary">Trusted Providers</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}