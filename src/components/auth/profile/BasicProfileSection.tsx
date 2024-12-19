import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "./types";

interface BasicProfileSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export function BasicProfileSection({ form }: BasicProfileSectionProps) {
  return (
    <>
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
    </>
  );
}