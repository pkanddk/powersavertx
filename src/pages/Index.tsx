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
    <div className="relative min-h-screen">
      {/* Auth Menu - Now only on the right side */}
      <div className="absolute top-4 right-4 z-50">
        <AuthMenu />
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Hero Image Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ 
            backgroundImage: "url('/lovable-uploads/d9ee4c20-c018-4d57-99e8-7520e837bb79.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Find Your Perfect Energy Plan
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form */}
          <div className="max-w-md mx-auto w-full">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              No Signup Required
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Real-Time Rates
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              Trusted Providers
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}