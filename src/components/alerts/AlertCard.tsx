import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Trash2, Edit } from "lucide-react";
import { AlertSettings } from "@/pages/ManageAlerts";

interface AlertCardProps {
  alert: AlertSettings;
  onDelete: (alert: AlertSettings) => Promise<void>;
  onEdit: (alert: AlertSettings) => void;
}

export function AlertCard({ alert, onDelete, onEdit }: AlertCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
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
            onClick={() => onEdit(alert)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(alert)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}