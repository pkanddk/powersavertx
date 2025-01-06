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
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="flex justify-end px-4 py-2">
          <AuthMenu />
        </div>
      </header>

      <main className="bg-teal-600">
        <div className="w-full px-4">
          <SearchForm onSearch={handleSearch} />
          <div className="flex justify-center gap-2 mt-2 mb-2">
            <Badge variant="secondary" className="bg-white/10">No Signup Required</Badge>
            <Badge variant="secondary" className="bg-white/10">Real-Time Rates</Badge>
            <Badge variant="secondary" className="bg-white/10">Trusted Providers</Badge>
          </div>
        </div>
      </main>
    </div>
  );
}