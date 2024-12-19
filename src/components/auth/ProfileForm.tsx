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

const profileSchema = z.object({
  zip_code: z.string().min(5).max(10),
  current_kwh_usage: z.string().optional(),
  renewable_preference: z.boolean().default(false),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      zip_code: "",
      current_kwh_usage: "",
      renewable_preference: false,
    },
  });

  // Load user profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No user found");

        const { data: profile, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (profile) {
          console.log("[ProfileForm] Loaded profile:", profile);
          form.reset({
            zip_code: profile.zip_code || "",
            current_kwh_usage: profile.current_kwh_usage || "",
            renewable_preference: profile.renewable_preference || false,
          });
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

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Updating..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
}