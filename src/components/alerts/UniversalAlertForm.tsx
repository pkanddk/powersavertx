import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface UniversalAlertFormProps {
  onSubmit: (kwhUsage: string, priceThreshold: string) => Promise<void>;
}

export function UniversalAlertForm({ onSubmit }: UniversalAlertFormProps) {
  const [kwhUsage, setKwhUsage] = useState("");
  const [priceThreshold, setPriceThreshold] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(kwhUsage, priceThreshold);
    setKwhUsage("");
    setPriceThreshold("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Set Universal Price Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Usage Level (kWh)</Label>
            <Input
              type="text"
              value={kwhUsage}
              onChange={(e) => setKwhUsage(e.target.value)}
              placeholder="e.g., 1000"
            />
          </div>
          <div className="space-y-2">
            <Label>Price Threshold (¢/kWh)</Label>
            <Input
              type="number"
              step="0.1"
              value={priceThreshold}
              onChange={(e) => setPriceThreshold(e.target.value)}
              placeholder="e.g., 12.5"
            />
          </div>
          <Button type="submit" className="w-full">
            Set Universal Alert
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}