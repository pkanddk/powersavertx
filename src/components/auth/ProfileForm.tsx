import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { BasicProfileSection } from "./profile/BasicProfileSection";
import { RenewablePreferenceSection } from "./profile/RenewablePreferenceSection";
import { UniversalAlertSection } from "./profile/UniversalAlertSection";
import { ActiveAlertsSection } from "./profile/ActiveAlertsSection";
import { profileSchema, type ProfileFormData, type PriceAlert } from "./profile/types";

export function ProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      zip_code: "",
      renewable_preference: false,
      universal_kwh_usage: "",
      universal_price_threshold: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { data: profile, error: profileError } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          console.log("[ProfileForm] Loaded profile:", profile);
          form.reset({
            zip_code: profile.zip_code || "",
            renewable_preference: profile.renewable_preference || false,
            universal_kwh_usage: profile.universal_kwh_usage || "",
            universal_price_threshold: profile.universal_price_threshold?.toString() || "",
          });
        }

        const { data: alerts, error: alertsError } = await supabase
          .from("user_plan_tracking")
          .select(`
            id,
            kwh_usage,
            price_threshold,
            energy_plans (
              plan_name,
              company_name,
              renewable_percentage
            )
          `)
          .eq("user_id", profile.id)
          .eq("active", true);

        if (alertsError) throw alertsError;

        if (alerts) {
          console.log("[ProfileForm] Loaded alerts:", alerts);
          setPriceAlerts(alerts.map(alert => ({
            id: alert.id,
            plan_name: alert.energy_plans.plan_name,
            company_name: alert.energy_plans.company_name,
            kwh_usage: alert.kwh_usage,
            price_threshold: alert.price_threshold,
            renewable_percentage: alert.energy_plans.renewable_percentage,
            alert_type: 'specific'
          })));
        }
      } catch (error: any) {
        console.error("[ProfileForm] Error loading profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile",
          variant: "destructive",
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, [form, toast]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("user_profiles")
        .update({
          zip_code: data.zip_code,
          renewable_preference: data.renewable_preference,
          universal_kwh_usage: data.universal_kwh_usage || null,
          universal_price_threshold: data.universal_price_threshold ? parseFloat(data.universal_price_threshold) : null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("user_plan_tracking")
        .update({ active: false })
        .eq("id", alertId);

      if (error) throw error;

      setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId));
      toast({
        title: "Alert deleted",
        description: "Price alert has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete price alert",
        variant: "destructive",
      });
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <BasicProfileSection form={form} />
            <RenewablePreferenceSection form={form} />
            <Separator className="my-6" />
            <UniversalAlertSection form={form} />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </Form>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Active Price Alerts</h3>
          <ActiveAlertsSection 
            alerts={priceAlerts} 
            onDeleteAlert={handleDeleteAlert}
            renewablePreference={form.watch("renewable_preference")}
          />
        </div>
      </div>
    </div>
  );
}
