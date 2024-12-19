import { Button } from "@/components/ui/button";
import { Eye, GitCompare, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { PriceAlert } from "./types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface ActiveAlertsSectionProps {
  alerts: PriceAlert[];
  onDeleteAlert: (alertId: string) => void;
  onCompare: (planId: string) => void;
  renewablePreference: boolean;
}

export function ActiveAlertsSection({ 
  alerts, 
  onDeleteAlert, 
  onCompare,
  renewablePreference 
}: ActiveAlertsSectionProps) {
  const navigate = useNavigate();

  // Sort alerts based on renewable preference
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (renewablePreference) {
      return (b.renewable_percentage || 0) - (a.renewable_percentage || 0);
    }
    return 0; // Keep original order if renewable preference is off
  });

  const { data: currentPrices } = useQuery({
    queryKey: ['currentPrices', alerts.map(a => a.plan_id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plans')
        .select('id, price_kwh500, price_kwh1000, price_kwh2000')
        .in('id', alerts.map(a => a.plan_id));

      if (error) throw error;
      return data;
    },
    enabled: alerts.length > 0
  });

  const getCurrentPrice = (planId: string, usage: string) => {
    const plan = currentPrices?.find(p => p.id === planId);
    if (!plan) return null;

    switch (usage) {
      case '500':
        return plan.price_kwh500;
      case '1000':
        return plan.price_kwh1000;
      case '2000':
        return plan.price_kwh2000;
      default:
        return plan.price_kwh1000;
    }
  };

  const handleViewPlan = (planId: string) => {
    navigate(`/?plan=${planId}`);
  };

  return (
    <div className="space-y-4">
      {sortedAlerts.length === 0 ? (
        <p className="text-muted-foreground">No active price alerts</p>
      ) : (
        sortedAlerts.map((alert) => {
          const currentPrice = getCurrentPrice(alert.plan_id, alert.kwh_usage);
          const isAboveThreshold = currentPrice && currentPrice > alert.price_threshold;

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border ${
                isAboveThreshold ? 'border-red-500 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{alert.company_name}</h4>
                  <p className="text-sm text-muted-foreground">{alert.plan_name}</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm">
                      Usage: {alert.kwh_usage} kWh
                    </p>
                    <p className="text-sm">
                      Alert Threshold: {formatPrice(alert.price_threshold)}/kWh
                    </p>
                    {currentPrice && (
                      <p className="text-sm font-medium">
                        Current Price: {formatPrice(currentPrice)}/kWh
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleViewPlan(alert.plan_id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onCompare(alert.plan_id)}
                  >
                    <GitCompare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}