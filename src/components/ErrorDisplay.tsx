import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function ErrorDisplay({ error }: { error: Error | null }) {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        {error instanceof Error ? error.message : "Failed to fetch energy plans. Please try again."}
      </AlertDescription>
    </Alert>
  );
}