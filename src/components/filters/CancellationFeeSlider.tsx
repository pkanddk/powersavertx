import { Plan } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useEffect, useMemo } from "react";
import { parseCancellationFee } from "@/lib/utils/parseCancellationFee";

interface CancellationFeeSliderProps {
  plans: Plan[];
  onCancellationFeeChange: (value: [number, number]) => void;
  currentCancellationFee: [number, number];
}

export function CancellationFeeSlider({
  plans,
  onCancellationFeeChange,
  currentCancellationFee,
}: CancellationFeeSliderProps) {
  // Calculate min and max cancellation fees from plans
  const { minFee, maxFee } = useMemo(() => {
    const fees = plans
      .map(plan => parseCancellationFee(plan.pricing_details))
      .filter((fee): fee is number => fee !== null);
    
    console.log('[CancellationFeeSlider] All cancellation fees:', fees);
    
    return {
      minFee: Math.floor(Math.min(...fees, 0)),
      maxFee: Math.ceil(Math.max(...fees, 100))
    };
  }, [plans]);

  console.log('[CancellationFeeSlider] Min/Max cancellation fees:', { minFee, maxFee });

  // Update the range if min/max changes
  useEffect(() => {
    if (currentCancellationFee[0] < minFee || currentCancellationFee[1] > maxFee) {
      console.log('[CancellationFeeSlider] Updating range to match new min/max:', [minFee, maxFee]);
      onCancellationFeeChange([minFee, maxFee]);
    }
  }, [minFee, maxFee, currentCancellationFee, onCancellationFeeChange]);

  const handleSliderChange = (value: number[]) => {
    console.log('[CancellationFeeSlider] Slider value changed:', value);
    onCancellationFeeChange([value[0], value[1]]);
  };

  return (
    <div className="flex flex-col gap-2 min-w-[200px]">
      <Label className="text-sm font-medium">Cancellation Fee Range</Label>
      <div className="px-2">
        <Slider
          min={minFee}
          max={maxFee}
          step={1}
          value={[currentCancellationFee[0], currentCancellationFee[1]]}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>${currentCancellationFee[0]}</span>
        <span>${currentCancellationFee[1]}</span>
      </div>
    </div>
  );
}