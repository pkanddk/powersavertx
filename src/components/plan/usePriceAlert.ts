import { useState } from "react";
import { Plan } from "@/lib/api";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export function usePriceAlert(plan: Plan, onClose: () => void) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (kwhUsage: string, priceThreshold: string) => {
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

      // Check if an alert already exists for this plan
      const { data: existingAlert, error: alertError } = await supabase
        .from("user_plan_tracking")
        .select("id")
        .eq("user_id", profile.id)
        .eq("plan_id", planId)
        .maybeSingle();

      if (alertError) throw alertError;

      if (existingAlert) {
        // Update existing alert
        const { error: updateError } = await supabase
          .from("user_plan_tracking")
          .update({
            kwh_usage: kwhUsage,
            price_threshold: parseFloat(priceThreshold),
            active: true,
          })
          .eq("id", existingAlert.id);

        if (updateError) throw updateError;

        toast({
          title: "Price alert updated",
          description: "Your price alert has been updated successfully.",
        });
      } else {
        // Create new alert
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
      }
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

  return { isLoading, handleSubmit };
}