import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BasicProfileSection } from "./BasicProfileSection";
import { UniversalAlertSection } from "./UniversalAlertSection";
import { ActiveAlertsSection } from "./ActiveAlertsSection";
import { useProfileForm } from "./ProfileFormProvider";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormData } from "../types";

interface ProfileFormContentProps {
  form: UseFormReturn<ProfileFormData>;
}

export function ProfileFormContent({ form }: ProfileFormContentProps) {
  const { isLoading, priceAlerts, handleSubmit, handleDeleteAlert } = useProfileForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings" className="space-y-6">
            <BasicProfileSection form={form} />
            <UniversalAlertSection form={form} />
            
            <Alert className="mt-6 bg-muted">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm ml-2">
                You can also set individual plan alerts by clicking the "Set Price Alert" button on any plan in the main page.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <div className="space-y-4">
              <Separator className="my-6" />
              <h3 className="text-lg font-medium">Active Price Alerts</h3>
              <ActiveAlertsSection 
                alerts={priceAlerts} 
                onDeleteAlert={handleDeleteAlert}
                onCompare={(planId) => {
                  console.log("Compare plan:", planId);
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
}