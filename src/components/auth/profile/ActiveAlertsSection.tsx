import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PriceAlert } from "../types";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Info, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActiveAlertsSectionProps {
  alerts: PriceAlert[];
  onDeleteAlert: (id: string) => void;
  onCompare: (planId: string) => void;
}

export function ActiveAlertsSection({
  alerts,
  onDeleteAlert,
  onCompare,
}: ActiveAlertsSectionProps) {
  const navigate = useNavigate();

  const handleCompare = (planId: string) => {
    onCompare(planId);
    navigate('/compare');
  };

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">
          No active price alerts. Set up alerts for specific plans to get notified when prices drop.
        </p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
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
                </div>

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(alert.go_to_plan, '_blank')}
                  >
                    View Plan
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCompare(alert.plan_id)}
                  >
                    Compare
                  </Button>
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