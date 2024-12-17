import { CardHeader } from "@/components/ui/card";

interface PlanHeaderProps {
  companyLogo: string;
  companyName: string;
}

export function PlanHeader({ companyLogo, companyName }: PlanHeaderProps) {
  return (
    <CardHeader className="flex-none h-32 flex items-center justify-center p-4 bg-secondary/50">
      <img 
        src={companyLogo} 
        alt={`${companyName} logo`}
        className="max-h-full max-w-full object-contain"
      />
    </CardHeader>
  );
}