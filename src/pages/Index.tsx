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
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="flex justify-end px-4 py-2">
          <AuthMenu />
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-teal-600 to-teal-700">
        <div className="w-full px-6 py-12 text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Energy Plan</h1>
          <p className="text-xl mb-8">Compare electricity rates and plans from top providers in your area</p>
          
          <div className="max-w-3xl mx-auto">
            <SearchForm onSearch={handleSearch} />
            
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="secondary" className="bg-white/10">No Signup Required</Badge>
              <Badge variant="secondary" className="bg-white/10">Real-Time Rates</Badge>
              <Badge variant="secondary" className="bg-white/10">Trusted Providers</Badge>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}