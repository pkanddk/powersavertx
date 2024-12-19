import { useState } from "react";
import { Plan } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(kwhUsage, priceThreshold);
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

      <DialogFooter>
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Setting alert..." : "Set Alert"}
        </Button>
      </DialogFooter>
    </form>
  );
}