import { Star } from "lucide-react";

interface PlanTitleProps {
  planName: string;
  companyName: string;
  rating?: number;
}

export function PlanTitle({ planName, companyName, rating }: PlanTitleProps) {
  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold">{planName}</h3>
        <p className="text-sm text-muted-foreground">{companyName}</p>
      </div>
      {rating && (
        <div className="flex items-center">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="ml-1 text-sm">{rating}</span>
        </div>
      )}
    </div>
  );
}