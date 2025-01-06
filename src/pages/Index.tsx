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
    <main 
      className="min-h-screen bg-cover bg-center relative"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/4401e154-998f-4a3f-99d5-7bcf11361699.png")',
        backgroundColor: 'rgba(45, 55, 72, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="absolute top-4 right-4 z-10">
        <AuthMenu />
      </div>

      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl px-4">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
              Find Your Perfect Energy Plan
            </h1>
            <p className="text-lg text-white drop-shadow mb-6">
              Compare electricity rates and plans from top providers in your area
            </p>
            
            <SearchForm onSearch={handleSearch} />
            
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              <Badge variant="secondary" className="glass-effect text-white">No Signup Required</Badge>
              <Badge variant="secondary" className="glass-effect text-white">Real-Time Rates</Badge>
              <Badge variant="secondary" className="glass-effect text-white">Trusted Providers</Badge>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}