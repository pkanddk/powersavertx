import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "./types";

interface UniversalAlertSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export function UniversalAlertSection({ form }: UniversalAlertSectionProps) {
  return (
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
  );
}