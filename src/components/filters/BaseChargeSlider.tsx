import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { Plan } from "@/lib/api";

interface BaseChargeSliderProps {
  plans: Plan[];
  onBaseChargeChange: (value: [number, number]) => void;
  currentBaseCharge: [number, number];
}

export function BaseChargeSlider({ 
  plans, 
  onBaseChargeChange,
  currentBaseCharge 
}: BaseChargeSliderProps) {
  // Find min and max base charges from available plans
  const baseCharges = plans
    .map(plan => plan.base_charge || 0)
    .filter(charge => charge !== null);
  
  const minCharge = Math.min(...baseCharges);
  const maxCharge = Math.max(...baseCharges);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">Base Charge Range</label>
      <div className="px-2">
        <Slider
          min={minCharge}
          max={maxCharge}
          step={0.01}
          value={currentBaseCharge}
          onValueChange={onBaseChargeChange}
          className="w-[180px]"
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground px-2">
        <span>${currentBaseCharge[0].toFixed(2)}</span>
        <span>${currentBaseCharge[1].toFixed(2)}</span>
      </div>
    </div>
  );
}