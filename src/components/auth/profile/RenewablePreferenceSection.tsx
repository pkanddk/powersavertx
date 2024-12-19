import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "./types";

interface RenewablePreferenceSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export function RenewablePreferenceSection({ form }: RenewablePreferenceSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Renewable Energy Preference</h3>
      <FormField
        control={form.control}
        name="renewable_preference"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">
                Sort by Renewable Energy
              </FormLabel>
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
    </div>
  );
}