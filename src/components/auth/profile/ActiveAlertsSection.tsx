import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceAlert } from "../types";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Info, Trash2 } from "lucide-react";

interface ActiveAlertsSectionProps {
  alerts: PriceAlert[];
  onDeleteAlert: (id: string) => void;
  renewablePreference: boolean;
  onCompare: (planId: string) => void;
}

export function ActiveAlertsSection({
  alerts,
  onDeleteAlert,
  renewablePreference,
  onCompare,
}: ActiveAlertsSectionProps) {
  // Sort alerts based on renewable preference
  const sortedAlerts = [...alerts].sort((a, b) => {
    if (renewablePreference) {
      // Sort by renewable percentage in descending order when renewable preference is enabled
      return (b.renewable_percentage || 0) - (a.renewable_percentage || 0);
    }
    return 0; // Keep original order if renewable preference is off
  });

  console.log("[ActiveAlertsSection] Renewable preference:", renewablePreference);
  console.log("[ActiveAlertsSection] Sorted alerts:", sortedAlerts);

  return (
    <div className="space-y-4">
      {sortedAlerts.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No active price alerts. Set up alerts for specific plans to get notified when prices drop.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedAlerts.map((alert) => (
            <Card key={alert.id} className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{alert.company_name}</h4>
                    <p className="text-sm text-muted-foreground">{alert.plan_name}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteAlert(alert.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <p className="text-sm">
                    Alert when price drops below{" "}
                    <span className="font-medium">
                      {formatPrice(alert.price_threshold)}/kWh
                    </span>
                  </p>
                  <p className="text-sm">
                    For usage: <span className="font-medium">{alert.kwh_usage} kWh</span>
                  </p>
                  {alert.renewable_percentage !== undefined && (
                    <p className="text-sm">
                      Renewable: <span className="font-medium">{alert.renewable_percentage}%</span>
                    </p>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          <Alert className="mt-6 bg-[#D6BCFA] border-[#D6BCFA]/50">
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm ml-2">
              Price alerts are automatically removed after 30 days.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}