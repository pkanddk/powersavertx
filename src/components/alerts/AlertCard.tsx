import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/formatPrice";
import { Trash2, Edit } from "lucide-react";
import { AlertSettings } from "@/pages/ManageAlerts";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AlertCardProps {
  alert: AlertSettings;
  onDelete: (alert: AlertSettings) => Promise<void>;
  onEdit: (alert: AlertSettings) => void;
}

export function AlertCard({ alert, onDelete, onEdit }: AlertCardProps) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchCurrentPrice = async () => {
      if (alert.alert_type === 'specific' && alert.plan_id) {
        console.log('Fetching current price for plan:', alert.plan_id);
        const { data: plan, error } = await supabase
          .from('energy_plans')
          .select('*')
          .eq('id', alert.plan_id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching current price:', error);
          return;
        }

        if (plan) {
          console.log('Plan data:', plan);
          // Map the usage to the correct price column
          let priceColumn: string;
          switch (alert.kwh_usage) {
            case '500':
              priceColumn = 'price_kwh500';
              break;
            case '1000':
              priceColumn = 'price_kwh1000';
              break;
            case '2000':
              priceColumn = 'price_kwh2000';
              break;
            default:
              priceColumn = 'price_kwh1000'; // Default to 1000 kWh if usage is not standard
          }
          
          const price = plan[priceColumn];
          console.log('Current price:', price, 'for usage:', alert.kwh_usage, 'using column:', priceColumn);
          setCurrentPrice(typeof price === 'number' ? price : null);
        } else {
          console.log('No plan found for id:', alert.plan_id);
        }
      }
    };

    fetchCurrentPrice();
  }, [alert]);

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
          {alert.alert_type === 'specific' && (
            <p className="text-sm text-muted-foreground">
              Current price: {formatPrice(currentPrice)}/kWh
            </p>
          )}
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