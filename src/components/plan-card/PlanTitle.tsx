import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PlanTitleProps {
  planName: string;
  companyName: string;
  rating?: number | null;
  ratingYear?: string | null;
}

export function PlanTitle({ planName, companyName, rating, ratingYear }: PlanTitleProps) {
  // A plan has a valid rating if rating is not null/undefined/0 and has a rating year
  const hasRating = rating && rating > 0 && ratingYear;

  return (
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-semibold">{planName}</h3>
        <p className="text-sm text-muted-foreground">{companyName}</p>
      </div>
      {hasRating ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="ml-1 text-sm">{rating}/5</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>J.D. Power Rating ({ratingYear})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center text-muted-foreground">
                <Star className="w-4 h-4" />
                <span className="ml-1 text-sm">No rating</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>No J.D. Power Rating available</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}