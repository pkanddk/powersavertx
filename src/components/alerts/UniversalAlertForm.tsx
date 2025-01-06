import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UniversalAlertFormProps {
  onSubmit: (kwhUsage: string, priceThreshold: string) => Promise<void>;
}

export function UniversalAlertForm({ onSubmit }: UniversalAlertFormProps) {
  const [kwhUsage, setKwhUsage] = useState("1000");
  const [priceThreshold, setPriceThreshold] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(kwhUsage, priceThreshold);
    setPriceThreshold("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Universal Price Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Usage Level</Label>
            <Select
              value={kwhUsage}
              onValueChange={(value) => setKwhUsage(value)}
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