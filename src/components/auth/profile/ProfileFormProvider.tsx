import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PriceAlert, ProfileFormData } from "../types";
import { UseFormReturn } from "react-hook-form";

interface ProfileFormContextType {
  isLoading: boolean;
  isLoadingProfile: boolean;
  priceAlerts: PriceAlert[];
  handleSubmit: (data: ProfileFormData) => Promise<void>;
  handleDeleteAlert: (alertId: string) => Promise<void>;
}

const ProfileFormContext = createContext<ProfileFormContextType | undefined>(undefined);

export function ProfileFormProvider({ 
  children, 
  form 
}: { 
  children: React.ReactNode;
  form: UseFormReturn<ProfileFormData>;
}) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  useEffect(() => {
    loadProfile();
  }, []);

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
          plan_id,
          kwh_usage,
          price_threshold,
          energy_plans (
            plan_name,
            company_name,
            go_to_plan
          )
        `)
        .eq("user_id", profile.id)
        .eq("active", true);

      if (alertsError) throw alertsError;

      if (alerts) {
        console.log("[ProfileForm] Loaded alerts:", alerts);
        setPriceAlerts(alerts.map(alert => ({
          id: alert.id,
          plan_id: alert.plan_id,
          plan_name: alert.energy_plans.plan_name,
          company_name: alert.energy_plans.company_name,
          kwh_usage: alert.kwh_usage,
          price_threshold: alert.price_threshold,
          go_to_plan: alert.energy_plans.go_to_plan,
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

  const handleSubmit = async (data: ProfileFormData) => {
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

  return (
    <ProfileFormContext.Provider 
      value={{ 
        isLoading, 
        isLoadingProfile, 
        priceAlerts, 
        handleSubmit, 
        handleDeleteAlert 
      }}
    >
      {children}
    </ProfileFormContext.Provider>
  );
}

export function useProfileForm() {
  const context = useContext(ProfileFormContext);
  if (context === undefined) {
    throw new Error("useProfileForm must be used within a ProfileFormProvider");
  }
  return context;
}