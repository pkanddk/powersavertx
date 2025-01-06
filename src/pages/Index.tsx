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
    <main className="h-screen grid place-items-center relative">
      <div className="absolute right-4 top-4">
        <AuthMenu />
      </div>
      
      <div className="max-w-lg w-full px-4">
        <h1 className="text-4xl font-bold text-white mb-1">
          Find Your Perfect Energy Plan
        </h1>
        <p className="text-lg text-white/90 mb-3">
          Compare electricity rates and plans from top providers in your area
        </p>
        
        <SearchForm onSearch={handleSearch} />
        
        <div className="flex gap-1 justify-center mt-2">
          <Badge variant="secondary" className="glass-effect text-white">No Signup Required</Badge>
          <Badge variant="secondary" className="glass-effect text-white">Real-Time Rates</Badge>
          <Badge variant="secondary" className="glass-effect text-white">Trusted Providers</Badge>
        </div>
      </div>

      <div 
        className="absolute inset-0 -z-10" 
        style={{ 
          backgroundImage: 'url("/lovable-uploads/4401e154-998f-4a3f-99d5-7bcf11361699.png")',
          backgroundColor: 'rgba(45, 55, 72, 0.5)',
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </main>
  );
}