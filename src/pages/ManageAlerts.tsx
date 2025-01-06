import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils/formatPrice";
import { ArrowLeft, Trash2, Edit } from "lucide-react";
import { AuthMenu } from "@/components/auth/AuthMenu";

interface AlertSettings {
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

export default function ManageAlerts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [alerts, setAlerts] = useState<AlertSettings[]>([]);

  useEffect(() => {
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

        // Add specific plan alerts
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

        setAlerts(formattedAlerts);
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

    loadAlerts();
  }, [navigate, toast]);

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

      setAlerts(prev => prev.filter(a => a.id !== alert.id));
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Auth Menu */}
      <div className="absolute top-4 left-4 z-50">
        <AuthMenu />
      </div>

      <div className="flex items-center mb-8 space-x-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold">Manage Price Alerts</h1>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No active price alerts found.</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/pricing')}
          >
            Browse Plans
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">
                    {alert.alert_type === 'universal' 
                      ? "Universal Price Alert" 
                      : `${alert.plan_details?.company_name} - ${alert.plan_details?.plan_name}`
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Alert for {alert.kwh_usage} kWh usage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Price threshold: {formatPrice(alert.price_threshold)}/kWh
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(alert)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}