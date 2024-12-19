import { Plan } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEffect, useMemo } from "react";

interface BaseChargeSliderProps {
  plans: Plan[];
  onBaseChargeChange: (value: [number, number]) => void;
  currentBaseCharge: [number, number];
}

export function BaseChargeSlider({
  plans,
  onBaseChargeChange,
  currentBaseCharge,
}: BaseChargeSliderProps) {
  // Calculate min and max base charges from plans
  const { minBaseCharge, maxBaseCharge } = useMemo(() => {
    const charges = plans
      .map(plan => plan.base_charge || 0)
      .filter(charge => charge !== null);
    
    console.log('[BaseChargeSlider] All base charges:', charges);
    
    return {
      minBaseCharge: Math.floor(Math.min(...charges, 0)),
      maxBaseCharge: Math.ceil(Math.max(...charges, 100))
    };
  }, [plans]);

  console.log('[BaseChargeSlider] Min/Max base charges:', { minBaseCharge, maxBaseCharge });

  // Update the range if min/max changes
  useEffect(() => {
    if (currentBaseCharge[0] < minBaseCharge || currentBaseCharge[1] > maxBaseCharge) {
      console.log('[BaseChargeSlider] Updating range to match new min/max:', [minBaseCharge, maxBaseCharge]);
      onBaseChargeChange([minBaseCharge, maxBaseCharge]);
    }
  }, [minBaseCharge, maxBaseCharge, currentBaseCharge, onBaseChargeChange]);

  const handleSliderChange = (value: number[]) => {
    console.log('[BaseChargeSlider] Slider value changed:', value);
    onBaseChargeChange([value[0], value[1]]);
  };

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <Label className="text-sm font-medium">Base Charge Range</Label>
      <div className="px-2">
        <Slider
          min={minBaseCharge}
          max={maxBaseCharge}
          step={1}
          value={[currentBaseCharge[0], currentBaseCharge[1]]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>${currentBaseCharge[0]}</span>
        <span>${currentBaseCharge[1]}</span>
      </div>
    </div>
  );
}