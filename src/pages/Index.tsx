import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";

interface IndexProps {
  onSearch: (zipCode: string, estimatedUse: string) => void;
}

export default function Index({ onSearch }: IndexProps) {
  const navigate = useNavigate();

  const handleSearch = (zipCode: string, estimatedUse: string) => {
    onSearch(zipCode, estimatedUse);
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-white">
      <div className="relative h-[100vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/lovable-uploads/a4379cad-194e-455b-abe8-bfe06c3cdf2a.png')",
            backgroundPosition: "center 65%"
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative h-full flex flex-col items-center justify-center px-4 text-center z-10">
          <div className="transform -translate-y-20 md:-translate-y-12 lg:-translate-y-16">
            <div className="flex items-center justify-center gap-2 mb-4 md:mb-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white animate-fade-in">
                Power Saver TX
              </h1>
              <Badge 
                variant="secondary" 
                className="text-xs md:text-sm bg-white/20 backdrop-blur-sm text-white border-white/30 animate-fade-in"
              >
                Beta
              </Badge>
            </div>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 md:mb-8 animate-fade-in delay-100">
              Empowering Texans with smarter energy choices for a sustainable future
            </p>
            <div className="w-full max-w-2xl mx-auto glass-effect rounded-2xl p-4 md:p-6 animate-fade-in delay-200">
              <SearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}