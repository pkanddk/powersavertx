import { useState } from "react";
import { Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";

interface PriceAlertFormProps {
  plan: Plan;
  isLoading: boolean;
  onSubmit: (kwhUsage: string, priceThreshold: string) => void;
  onClose: () => void;
}

export function PriceAlertForm({ plan, isLoading, onSubmit, onClose }: PriceAlertFormProps) {
  const [kwhUsage, setKwhUsage] = useState("1000");
  const [priceThreshold, setPriceThreshold] = useState(
    String(plan[`price_kwh${kwhUsage}`] || 0)
  );
  const { toast } = useToast();
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(kwhUsage, priceThreshold);
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      console.log("[PriceAlertForm] Testing price alert");
      const { data, error } = await supabase.functions.invoke('test-price-alert');
      
      if (error) throw error;
      
      toast({
        title: "Test Completed",
        description: "Check your email for the test alert. If you don't receive it, check the function logs.",
      });
      
    } catch (error: any) {
      console.error("[PriceAlertForm] Test error:", error);
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Usage Level</Label>
          <Select
            value={kwhUsage}
            onValueChange={(value) => {
              setKwhUsage(value);
              setPriceThreshold(String(plan[`price_kwh${value}`] || 0));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select usage level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="500">500 kWh</SelectItem>
              <SelectItem value="1000">1000 kWh</SelectItem>
              <SelectItem value="2000">2000 kWh</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Price Threshold (¢/kWh)</Label>
          <Input
            type="number"
            step="0.1"
            value={priceThreshold}
            onChange={(e) => setPriceThreshold(e.target.value)}
            min="0"
            max="100"
            required
          />
          <p className="text-sm text-muted-foreground">
            Current price: {plan[`price_kwh${kwhUsage}`]}¢/kWh
          </p>
        </div>
      </div>

      <DialogFooter className="gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
          disabled={isLoading || isTesting}
        >
          Cancel
        </Button>
        <Button 
          variant="secondary"
          type="button"
          onClick={handleTest}
          disabled={isLoading || isTesting}
        >
          {isTesting ? "Testing..." : "Test Alert"}
        </Button>
        <Button type="submit" disabled={isLoading || isTesting}>
          {isLoading ? "Setting alert..." : "Set Alert"}
        </Button>
      </DialogFooter>
    </form>
  );
}