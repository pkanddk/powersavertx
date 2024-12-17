import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface PlanDetailsProps {
  details: string;
}

export function PlanDetails({ details }: PlanDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-center gap-2 hover:bg-secondary/50"
        >
          Plan Details
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="text-sm text-muted-foreground mt-2 space-y-2 animate-accordion-down">
        <div className="bg-secondary/20 p-4 rounded-md">
          {details}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}