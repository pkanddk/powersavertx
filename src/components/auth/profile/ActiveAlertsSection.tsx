import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { PriceAlert } from "./types";

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
      // Sort by renewable percentage first, then by price
      if (a.renewable_percentage !== b.renewable_percentage) {
        return (b.renewable_percentage || 0) - (a.renewable_percentage || 0);
      }
    }
    // Default sort by price threshold
    return a.price_threshold - b.price_threshold;
  });

  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="space-y-4">
        {sortedAlerts.map((alert) => (
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
        ))}
      </div>
    </ScrollArea>
  );
}