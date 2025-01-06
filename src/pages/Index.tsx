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
    <div className="h-screen flex">
      <div className="fixed top-4 right-4">
        <AuthMenu />
      </div>

      <div className="w-full self-center px-4">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-lg text-white/80 mt-1">
            Compare electricity rates and plans from top providers in your area
          </p>
          
          <div className="mt-4">
            <SearchForm onSearch={handleSearch} />
          </div>

          <div className="flex mt-3">
            <Badge variant="outline" className="bg-white/10 text-white border-0 mx-0.5">No Signup Required</Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-0 mx-0.5">Real-Time Rates</Badge>
            <Badge variant="outline" className="bg-white/10 text-white border-0 mx-0.5">Trusted Providers</Badge>
          </div>
        </div>
      </div>

      <div 
        className="fixed inset-0 -z-10" 
        style={{ 
          backgroundImage: 'url("/lovable-uploads/4401e154-998f-4a3f-99d5-7bcf11361699.png")',
          backgroundColor: 'rgba(45, 55, 72, 0.5)',
          backgroundBlendMode: 'overlay',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
}