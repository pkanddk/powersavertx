import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils/formatPrice";

interface AlertHistory {
  id: string;
  zip_code: string;
  kwh_usage: string;
  price_threshold: number;
  plans: Array<{
    plan_name: string;
    company_name: string;
    price_kwh: number;
    go_to_plan?: string;
  }>;
  created_at: string;
}

export default function Alerts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([]);

  useEffect(() => {
    const loadAlertHistory = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (profileError) throw profileError;

        const { data: alerts, error: alertsError } = await supabase
          .from('alert_history')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        if (alertsError) throw alertsError;

        setAlertHistory(alerts);
      } catch (error: any) {
        console.error('Error loading alert history:', error);
        toast({
          title: "Error",
          description: "Failed to load alert history",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAlertHistory();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Price Alert History</h1>
        <Button onClick={() => navigate('/profile')}>Manage Alerts</Button>
      </div>

      {alertHistory.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No alert history found.</p>
          <Button 
            className="mt-4" 
            variant="outline" 
            onClick={() => navigate('/profile')}
          >
            Set Up Alerts
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {alertHistory.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-lg shadow-md p-6 space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Alert for {alert.kwh_usage} kWh usage
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Price threshold: {formatPrice(alert.price_threshold)}/kWh
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(alert.created_at).toLocaleDateString()}
                </p>
              </div>

              <div className="space-y-4">
                {alert.plans.map((plan, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-4 space-y-2"
                  >
                    <p className="font-medium">{plan.company_name}</p>
                    <p>{plan.plan_name}</p>
                    <p className="text-sm">
                      Price: {formatPrice(plan.price_kwh)}/kWh
                    </p>
                    {plan.go_to_plan && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(plan.go_to_plan, '_blank')}
                      >
                        View Plan
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}