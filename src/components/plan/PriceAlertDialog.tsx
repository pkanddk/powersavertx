import { useState } from "react";
import { Plan } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PriceAlertDialogProps {
  plan: Plan;
  isOpen: boolean;
  onClose: () => void;
}

export function PriceAlertDialog({ plan, isOpen, onClose }: PriceAlertDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [kwhUsage, setKwhUsage] = useState("1000");
  const [priceThreshold, setPriceThreshold] = useState(
    String(plan[`price_kwh${kwhUsage}`] || 0)
  );
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to set price alerts");

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (profileError) throw profileError;
      if (!profile) throw new Error("User profile not found");

      // First, ensure the plan exists in energy_plans
      const { data: existingPlan, error: planError } = await supabase
        .from("energy_plans")
        .select("id")
        .eq("company_id", plan.company_id)
        .eq("plan_name", plan.plan_name)
        .maybeSingle();

      if (planError) throw planError;

      let planId;
      if (!existingPlan) {
        // Insert the plan if it doesn't exist
        const { data: newPlan, error: insertError } = await supabase
          .from("energy_plans")
          .insert({
            company_id: plan.company_id,
            company_name: plan.company_name,
            company_logo: plan.company_logo,
            plan_name: plan.plan_name,
            plan_type_name: plan.plan_type_name,
            fact_sheet: plan.fact_sheet,
            go_to_plan: plan.go_to_plan,
            minimum_usage: plan.minimum_usage,
            new_customer: plan.new_customer,
            plan_details: plan.plan_details,
            base_charge: plan.base_charge,
            contract_length: plan.contract_length,
          })
          .select("id")
          .maybeSingle();

        if (insertError) throw insertError;
        if (!newPlan) throw new Error("Failed to create plan record");
        planId = newPlan.id;
      } else {
        planId = existingPlan.id;
      }

      // Create the price alert
      const { error: trackingError } = await supabase
        .from("user_plan_tracking")
        .insert({
          user_id: profile.id,
          plan_id: planId,
          kwh_usage: kwhUsage,
          price_threshold: parseFloat(priceThreshold),
          active: true,
        });

      if (trackingError) throw trackingError;

      toast({
        title: "Price alert set",
        description: "We'll notify you when the price drops below your threshold.",
      });
      onClose();
    } catch (error: any) {
      console.error("Error setting price alert:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Price Alert</DialogTitle>
          <DialogDescription>
            Get notified when this plan's price drops below your threshold.
          </DialogDescription>
        </DialogHeader>

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
      </DialogContent>
    </Dialog>
  );
}