import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Bug } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function BugReportDialog() {
  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(
        `${(await supabase.functions.invoke("send-bug-report")).data?.url}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send bug report");
      }

      toast({
        title: "Bug report sent!",
        description: "Thank you for helping us improve Power Saver TX.",
      });
      
      setDescription("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send bug report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
        >
          <Bug className="h-4 w-4" />
          Report Bug
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Report a Bug</SheetTitle>
          <SheetDescription>
            Help us improve by reporting any issues you encounter.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <Textarea
            placeholder="Describe the bug or issue you encountered..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[150px]"
            required
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Sending..." : "Send Report"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}