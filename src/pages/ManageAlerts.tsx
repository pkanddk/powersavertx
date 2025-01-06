import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { AlertCard } from "@/components/alerts/AlertCard";
import { EditAlertDialog } from "@/components/alerts/EditAlertDialog";
import { UniversalAlertForm } from "@/components/alerts/UniversalAlertForm";

export interface AlertSettings {
  id: string;
  kwh_usage: string;
  price_threshold: number;
  plan_id?: string;
  plan_details?: {
    company_name: string;
    plan_name: string;
  };
  alert_type: 'specific' | 'universal';
}

// Helper function to sort alerts with universal first
const sortAlerts = (alerts: AlertSettings[]) => {
  return alerts.sort((a, b) => {
    if (a.alert_type === 'universal') return -1;
    if (b.alert_type === 'universal') return 1;
    return 0;
  });
};

export default function ManageAlerts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertSettings[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<AlertSettings | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id, universal_price_threshold, universal_kwh_usage')
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      const formattedAlerts: AlertSettings[] = [];

      // Add universal alert if it exists
      if (profile.universal_price_threshold) {
        formattedAlerts.push({
          id: 'universal',
          kwh_usage: profile.universal_kwh_usage || '1000',
          price_threshold: profile.universal_price_threshold,
          alert_type: 'universal'
        });
      }

      // Get specific plan alerts
      const { data: planAlerts, error: alertsError } = await supabase
        .from('user_plan_tracking')
        .select(`
          id,
          kwh_usage,
          price_threshold,
          plan_id,
          energy_plans (
            company_name,
            plan_name
          )
        `)
        .eq('user_id', profile.id)
        .eq('active', true);

      if (alertsError) throw alertsError;

      if (planAlerts) {
        formattedAlerts.push(
          ...planAlerts.map(alert => ({
            id: alert.id,
            kwh_usage: alert.kwh_usage,
            price_threshold: alert.price_threshold,
            plan_id: alert.plan_id,
            plan_details: alert.energy_plans ? {
              company_name: alert.energy_plans.company_name,
              plan_name: alert.energy_plans.plan_name
            } : undefined,
            alert_type: 'specific' as const
          }))
        );
      }

      setAlerts(sortAlerts(formattedAlerts));
    } catch (error: any) {
      console.error('Error loading alerts:', error);
      toast({
        title: "Error",
        description: "Failed to load alerts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (alert: AlertSettings) => {
    try {
      if (alert.alert_type === 'universal') {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            universal_price_threshold: null,
            universal_kwh_usage: null
          })
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_plan_tracking')
          .update({ active: false })
          .eq('id', alert.id);

        if (error) throw error;
      }

      setAlerts(prev => sortAlerts(prev.filter(a => a.id !== alert.id)));
      toast({
        title: "Alert deleted",
        description: "The price alert has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting alert:', error);
      toast({
        title: "Error",
        description: "Failed to delete the alert",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (alert: AlertSettings) => {
    setSelectedAlert(alert);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (alert: AlertSettings, newThreshold: number) => {
    try {
      if (alert.alert_type === 'universal') {
        const { error } = await supabase
          .from('user_profiles')
          .update({ universal_price_threshold: newThreshold })
          .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('user_plan_tracking')
          .update({ price_threshold: newThreshold })
          .eq('id', alert.id);

        if (error) throw error;
      }

      setAlerts(prev => sortAlerts(prev.map(a => 
        a.id === alert.id ? { ...a, price_threshold: newThreshold } : a
      )));

      toast({
        title: "Alert updated",
        description: "Price threshold has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating alert:', error);
      toast({
        title: "Error",
        description: "Failed to update the alert",
        variant: "destructive",
      });
    }
  };

  const handleUniversalAlert = async (kwhUsage: string, priceThreshold: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          universal_kwh_usage: kwhUsage,
          universal_price_threshold: parseFloat(priceThreshold)
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      const newAlert: AlertSettings = {
        id: 'universal',
        kwh_usage: kwhUsage,
        price_threshold: parseFloat(priceThreshold),
        alert_type: 'universal'
      };

      setAlerts(prev => {
        const filtered = prev.filter(a => a.alert_type !== 'universal');
        return sortAlerts([...filtered, newAlert]);
      });

      toast({
        title: "Universal alert set",
        description: "Universal price alert has been set successfully.",
      });
    } catch (error) {
      console.error('Error setting universal alert:', error);
      toast({
        title: "Error",
        description: "Failed to set universal alert",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold ml-4">Manage Price Alerts</h1>
      </div>

      <div className="space-y-8">
        {/* Universal Alert Form - Always at the top */}
        <div className="w-full">
          <UniversalAlertForm onSubmit={handleUniversalAlert} />
        </div>

        {/* Current Alerts Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Current Alerts</h2>
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No active price alerts found.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate('/pricing')}
              >
                Browse Plans
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <AlertCard
                  key={alert.id}
                  alert={alert}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <EditAlertDialog
        alert={selectedAlert}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedAlert(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}