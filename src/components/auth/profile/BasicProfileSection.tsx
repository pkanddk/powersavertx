import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "./types";

interface BasicProfileSectionProps {
  form: UseFormReturn<ProfileFormData>;
}

export function BasicProfileSection({ form }: BasicProfileSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Basic Information</h3>
      <FormField
        control={form.control}
        name="zip_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ZIP Code</FormLabel>
            <FormControl>
              <Input placeholder="Enter your ZIP code" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}