import { useNavigate } from "react-router-dom";
import { SearchForm } from "@/components/SearchForm";
import { Badge } from "@/components/ui/badge";

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
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gradient-to-b from-sky-50/50 via-white to-white px-4">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Find the Best Electricity Plans in Texas
          </h1>
          <p className="text-xl text-muted-foreground">
            Compare rates and save on your electricity bill
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="text-sm">
            100+ Plans Available
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Real-Time Rates
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Price Alerts
          </Badge>
        </div>

        <div className="w-full max-w-xl mx-auto">
          <SearchForm onSearch={handleSearch} />
        </div>

        <div className="text-sm text-muted-foreground">
          Enter your ZIP code to see available plans in your area
        </div>
      </div>
    </div>
  );
}