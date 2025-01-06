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
      className="min-h-[100vh] bg-cover bg-top relative overflow-hidden"
      style={{ 
        backgroundImage: 'url("/lovable-uploads/4401e154-998f-4a3f-99d5-7bcf11361699.png")',
        backgroundColor: 'rgba(45, 55, 72, 0.5)',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Auth Menu */}
      <div className="absolute top-4 right-4 z-10">
        <AuthMenu />
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4">
        <div className="min-h-[100vh] flex flex-col justify-center items-center">
          <div className="max-w-2xl w-full space-y-8 -mt-20">
            <div className="text-center space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                Find Your Perfect Energy Plan
              </h1>
              <p className="text-xl text-white mb-8 drop-shadow">
                Compare electricity rates and plans from top providers in your area
              </p>
              
              <SearchForm onSearch={handleSearch} />
              
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Badge variant="secondary" className="glass-effect text-white">No Signup Required</Badge>
                <Badge variant="secondary" className="glass-effect text-white">Real-Time Rates</Badge>
                <Badge variant="secondary" className="glass-effect text-white">Trusted Providers</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}