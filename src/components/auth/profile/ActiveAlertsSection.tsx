import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatPrice";
import { PriceAlert } from "./types";

interface ActiveAlertsSectionProps {
  alerts: PriceAlert[];
  onDeleteAlert: (alertId: string) => void;
}

export function ActiveAlertsSection({ alerts, onDeleteAlert }: ActiveAlertsSectionProps) {
  if (alerts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        You haven't set up any price alerts yet.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
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
  );
}