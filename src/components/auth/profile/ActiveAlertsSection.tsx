import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { PriceAlert } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ActiveAlertsSectionProps {
  alerts: PriceAlert[];
  onDeleteAlert: (alertId: string) => void;
  renewablePreference?: boolean;
}

export function ActiveAlertsSection({ 
  alerts, 
  onDeleteAlert, 
  renewablePreference = false 
}: ActiveAlertsSectionProps) {
  // Query to get current prices for each plan
  const { data: currentPrices } = useQuery({
    queryKey: ["currentPrices", alerts.map(a => a.plan_id)],
    queryFn: async () => {
      const planIds = alerts.map(alert => alert.plan_id).filter(Boolean);
      if (planIds.length === 0) return {};

      const { data, error } = await supabase
        .from('energy_plans')
        .select('*')
        .in('id', planIds);

      if (error) throw error;

      return data.reduce((acc: Record<string, any>, plan) => {
        acc[plan.id] = plan;
        return acc;
      }, {});
    },
    enabled: alerts.length > 0,
  });

  if (alerts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven't set up any price alerts yet.
      </p>
    );
  }

  // Sort alerts based on renewable preference
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (renewablePreference) {
      return (b.renewable_percentage || 0) - (a.renewable_percentage || 0);
    }
    return a.price_threshold - b.price_threshold;
  });

  return (
    <div className="space-y-4">
      {sortedAlerts.map((alert) => {
        const currentPlan = currentPrices?.[alert.plan_id];
        const currentPrice = currentPlan?.[`price_kwh${alert.kwh_usage}`];
        
        return (
          <div
            key={alert.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-1">
              <p className="font-medium">{alert.company_name}</p>
              <p className="text-sm text-muted-foreground">
                {alert.plan_name}
              </p>
              <p className="text-sm">
                Alert when price is below {formatPrice(alert.price_threshold)} at {alert.kwh_usage} kWh usage
              </p>
              {currentPrice && (
                <p className="text-sm font-medium text-muted-foreground">
                  Current price: {formatPrice(currentPrice)}/kWh
                </p>
              )}
              {alert.renewable_percentage !== undefined && (
                <p className="text-sm text-muted-foreground">
                  Renewable Energy: {alert.renewable_percentage}%
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Alert Type: {alert.alert_type === 'universal' ? 'Universal' : 'Specific'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteAlert(alert.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}