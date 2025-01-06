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
    <div className="min-h-screen bg-teal-600">
      <header className="absolute top-0 right-0 left-0 border-b bg-white/80 backdrop-blur-sm">
        <div className="flex justify-end px-4 py-2">
          <AuthMenu />
        </div>
      </header>

      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl font-bold mb-4">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-xl mb-8">
            Compare electricity rates and plans from top providers in your area
          </p>
          
          <SearchForm onSearch={handleSearch} />
          
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">No Signup Required</Badge>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">Real-Time Rates</Badge>
            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30">Trusted Providers</Badge>
          </div>
        </div>
      </main>
    </div>
  );
}