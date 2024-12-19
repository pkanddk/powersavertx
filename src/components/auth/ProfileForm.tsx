import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatPrice";

const profileSchema = z.object({
  zip_code: z.string().min(5).max(10),
  current_kwh_usage: z.string().optional(),
  renewable_preference: z.boolean().default(false),
  universal_kwh_usage: z.string().optional(),
  universal_price_threshold: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface PriceAlert {
  id: string;
  plan_name: string;
  company_name: string;
  kwh_usage: string;
  price_threshold: number;
}

export function ProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      zip_code: "",
      current_kwh_usage: "",
      renewable_preference: false,
      universal_kwh_usage: "",
      universal_price_threshold: "",
    },
  });

  // Load user profile data and price alerts when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        // Load profile
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
            current_kwh_usage: profile.current_kwh_usage || "",
            renewable_preference: profile.renewable_preference || false,
            universal_kwh_usage: profile.universal_kwh_usage || "",
            universal_price_threshold: profile.universal_price_threshold?.toString() || "",
          });
        }

        // Load price alerts
        const { data: alerts, error: alertsError } = await supabase
          .from("user_plan_tracking")
          .select(`
            id,
            kwh_usage,
            price_threshold,
            energy_plans (
              plan_name,
              company_name
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
          current_kwh_usage: data.current_kwh_usage || null,
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
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ZIP code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current_kwh_usage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current kWh Usage</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1000" {...field} />
                </FormControl>
                <FormDescription>
                  Optional: Enter your typical monthly usage
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="renewable_preference"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Renewable Energy Preference
                  </FormLabel>
                  <FormDescription>
                    Prioritize renewable energy plans in your search results
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Separator className="my-6" />

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Universal Price Alert</h3>
            <p className="text-sm text-muted-foreground">
              Get notified when any plan matches these criteria
            </p>

            <FormField
              control={form.control}
              name="universal_kwh_usage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usage Level (kWh)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="universal_price_threshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price Threshold (¢/kWh)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      placeholder="e.g., 12.5" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      </Form>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Active Price Alerts</h3>
        {priceAlerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You haven't set up any price alerts yet.
          </p>
        ) : (
          <div className="space-y-4">
            {priceAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="font-medium">{alert.company_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {alert.plan_name}
                  </p>
                  <p className="text-sm">
                    Alert when price is below {formatPrice(alert.price_threshold)} at {alert.kwh_usage} kWh usage
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}