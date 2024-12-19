import { FormField, FormItem, FormLabel, FormDescription, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "./types";

interface RenewablePreferenceSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export function RenewablePreferenceSection({ form }: RenewablePreferenceSectionProps) {
  return (
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
  );
}