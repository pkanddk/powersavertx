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
        
        // First get the plan details to get company and plan name
        const { data: planDetails, error: planError } = await supabase
          .from('energy_plans')
          .select('company_name, plan_name')
          .eq('id', alert.plan_id)
          .maybeSingle();

        if (planError) {
          console.error('Error fetching plan details:', planError);
          return;
        }

        if (!planDetails) {
          console.log('No plan details found for id:', alert.plan_id);
          return;
        }

        // Then get the current price from the plans table
        const { data: currentPlan, error: priceError } = await supabase
          .from('plans')
          .select('*')
          .eq('company_name', planDetails.company_name)
          .eq('plan_name', planDetails.plan_name)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (priceError) {
          console.error('Error fetching current price:', priceError);
          return;
        }

        if (currentPlan) {
          console.log('Current plan data:', currentPlan);
          // Map the usage to the correct price column
          let price: number | null = null;
          switch (alert.kwh_usage) {
            case '500':
              price = currentPlan.price_kwh500;
              break;
            case '1000':
              price = currentPlan.price_kwh1000;
              break;
            case '2000':
              price = currentPlan.price_kwh2000;
              break;
            default:
              price = currentPlan.price_kwh1000; // Default to 1000 kWh if usage is not standard
          }
          
          console.log('Current price:', price, 'for usage:', alert.kwh_usage);
          setCurrentPrice(price);
        } else {
          console.log('No current price found for plan:', planDetails.plan_name);
        }
      }
    };

    fetchCurrentPrice();
  }, [alert]);

  return (
    <div className={`rounded-lg shadow-md p-6 ${
      alert.alert_type === 'universal' 
        ? 'bg-[#ea384c]/10' 
        : 'bg-white'
    }`}>
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
              Current price: {currentPrice ? formatPrice(currentPrice) : 'N/A'}/kWh
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