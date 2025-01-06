import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";

export default function Index({ onSearch }: { onSearch: (zipCode: string, estimatedUse: string) => void }) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    console.log("[Index] Handling search with:", { zipCode, estimatedUse });
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen relative bg-[#2F4858]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('/lovable-uploads/aa1e80a9-94ce-4e83-b72c-737ddb6b5920.png')" }}
      />
      
      {/* Content Container */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl mx-auto text-center space-y-8">
          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Find Your Perfect Energy Plan
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
            Compare electricity rates and plans from top providers in your area
          </p>

          {/* Search Form */}
          <div className="mt-12">
            <SearchForm onSearch={handleSearch} />
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm border border-white/20">
              No Signup Required
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm border border-white/20">
              Real-Time Rates
            </span>
            <span className="px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm border border-white/20">
              Trusted Providers
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}